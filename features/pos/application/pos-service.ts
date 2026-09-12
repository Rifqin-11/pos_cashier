import {
  calculate,
  changeQuantity,
  createItem,
  createOrder,
  saveItem,
  validateVoucher,
} from "../domain/order";
import { shiftSummary } from "../domain/shift";
import type {
  Item,
  PaymentInput,
  Product,
  Settings,
  Store,
} from "../domain/types";
import type { PosDependencies } from "./ports";

/** Use cases have no React, Next.js, DOM, or browser-storage dependencies. */
export class PosService {
  private paying = false;
  constructor(readonly dependencies: PosDependencies) {}

  load() {
    return this.dependencies.repository.load() ?? this.dependencies.seed();
  }
  persist(store: Store) {
    this.dependencies.repository.save(store);
  }
  totals(store: Store, order = store.order) {
    return calculate(
      order,
      store.settings,
      this.dependencies.vouchers,
      this.dependencies.now(),
    );
  }
  private requireShift(store: Store) {
    if (!store.session || !store.shift)
      throw new Error("Buka shift terlebih dahulu untuk menerima pesanan.");
    return store.shift;
  }
  newItem(store: Store, product: Product) {
    this.requireShift(store);
    if (!product.available) throw new Error("Menu ini sedang tidak tersedia.");
    return createItem(product, this.dependencies.createId());
  }
  saveItem(store: Store, item: Item, editing: boolean): Store {
    this.requireShift(store);
    return { ...store, order: saveItem(store.order, item, editing) };
  }
  quantity(store: Store, id: string, amount: number): Store {
    return { ...store, order: changeQuantity(store.order, id, amount) };
  }
  cancel(store: Store): Store {
    return { ...store, order: createOrder(this.dependencies.createId()) };
  }
  hold(store: Store): Store {
    this.requireShift(store);
    if (!store.order.items.length)
      throw new Error("Tambahkan menu terlebih dahulu.");
    if (!store.order.customer.trim() || !store.order.table.trim())
      throw new Error(
        "Nama pelanggan dan nomor meja wajib diisi sebelum pembayaran.",
      );
    return { ...this.cancel(store), held: [...store.held, store.order] };
  }
  resume(store: Store, id: string): Store {
    this.requireShift(store);
    const order = store.held.find((value) => value.id === id);
    if (!order) throw new Error("Pesanan tidak ditemukan.");
    return {
      ...store,
      order,
      held: [
        ...store.held.filter((value) => value.id !== id),
        ...(store.order.items.length ? [store.order] : []),
      ],
    };
  }
  applyVoucher(store: Store, input: string): Store {
    const code = input.trim().toUpperCase();
    const voucher = this.dependencies.vouchers.find(
      (value) => value.code === code,
    );
    const issue = validateVoucher(
      voucher,
      this.totals(store).subtotal,
      this.dependencies.now(),
    );
    if (issue) {
      const errors = {
        "not-found": "Kode voucher tidak ditemukan.",
        inactive: "Voucher ini sedang tidak aktif.",
        expired: "Voucher ini sudah kedaluwarsa.",
        minimum: `Minimum belanja Rp${voucher?.minimum.toLocaleString("id-ID")} untuk voucher ini.`,
      };
      throw new Error(errors[issue]);
    }
    return { ...store, order: { ...store.order, voucher: code } };
  }
  async checkout(store: Store, input: PaymentInput) {
    const shift = this.requireShift(store);
    if (this.paying) throw new Error("Pembayaran sedang diproses.");
    if (store.transactions.some((t) => t.id === store.order.id))
      throw new Error("Pesanan ini sudah dibayar.");
    if (!store.order.items.length)
      throw new Error("Tambahkan menu terlebih dahulu.");
    if (store.order.voucher) this.applyVoucher(store, store.order.voucher);
    const totals = this.totals(store);
    if (
      input.method === "Tunai" &&
      (!Number.isFinite(input.received) || input.received < totals.total)
    )
      throw new Error("Uang diterima belum mencukupi total pembayaran.");
    if (input.method !== "Tunai" && !input.confirmed)
      throw new Error("Konfirmasi pembayaran diterima sebelum melanjutkan.");
    if (input.method === "Kartu debit" && !input.reference.trim())
      throw new Error("Masukkan nomor referensi dari mesin EDC.");
    this.paying = true;
    try {
      await this.dependencies.payments.process(store.settings);
      const transaction = {
        ...store.order,
        ...totals,
        shiftId: shift.id,
        cashier: store.session!.name,
        date: this.dependencies.now().toISOString(),
        payment: input.method,
        received: input.method === "Tunai" ? input.received : totals.total,
        status: "Lunas" as const,
        reference: input.reference.trim(),
      };
      const next = {
        ...this.cancel(store),
        transactions: [transaction, ...store.transactions],
      };
      // Persist before reporting success, so failed saves leave the order recoverable.
      this.persist(next);
      return { store: next, transaction };
    } finally {
      this.paying = false;
    }
  }
  refund(store: Store, id: string, reason: string): Store {
    const shift = this.requireShift(store);
    if (!reason.trim()) throw new Error("Alasan refund wajib diisi.");
    const transaction = store.transactions.find((t) => t.id === id);
    if (!transaction || transaction.status !== "Lunas")
      throw new Error("Transaksi tidak dapat di-refund kembali.");
    return {
      ...store,
      transactions: store.transactions.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "Refund",
              refundReason: reason.trim(),
              refundedAt: this.dependencies.now().toISOString(),
              refundShiftId: shift.id,
            }
          : t,
      ),
    };
  }
  openShift(store: Store, opening: number): Store {
    if (!store.session) throw new Error("Masuk ke akun kasir terlebih dahulu.");
    if (store.shift) throw new Error("Shift masih aktif.");
    if (!Number.isFinite(opening) || opening < 0)
      throw new Error("Saldo awal tidak valid.");
    return {
      ...store,
      shift: {
        id: this.dependencies.createId(),
        cashier: store.session.name,
        opening,
        start: this.dependencies.now().toISOString(),
      },
    };
  }
  closeShift(store: Store, closing: number): Store {
    const shift = this.requireShift(store);
    if (store.order.items.length || store.held.length)
      throw new Error(
        "Selesaikan atau batalkan seluruh pesanan aktif dan ditahan sebelum menutup shift.",
      );
    if (!Number.isFinite(closing) || closing < 0)
      throw new Error("Masukkan nominal kas akhir yang valid.");
    return {
      ...store,
      shift: null,
      shifts: [
        {
          ...shift,
          end: this.dependencies.now().toISOString(),
          closing,
          expected: shiftSummary(store).expected,
        },
        ...store.shifts,
      ],
    };
  }
  login(store: Store, name: string, pin: string): Store {
    if (pin !== "1234")
      throw new Error("PIN tidak sesuai. Gunakan PIN demo 1234.");
    return {
      ...store,
      session: { name, loginAt: this.dependencies.now().toISOString() },
    };
  }
  logout(store: Store): Store {
    if (store.shift)
      throw new Error("Tutup shift aktif terlebih dahulu sebelum keluar.");
    return { ...store, session: null };
  }
  settings(store: Store, patch: Partial<Settings>): Store {
    const settings = { ...store.settings, ...patch };
    if (
      ![settings.tax, settings.service].every(
        (n) => Number.isFinite(n) && n >= 0 && n <= 100,
      )
    )
      throw new Error("Persentase harus di antara 0 dan 100.");
    return { ...store, settings };
  }
}

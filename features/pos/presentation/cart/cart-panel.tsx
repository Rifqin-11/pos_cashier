import {
  ArrowRight,
  Check,
  Coffee,
  DotsThree,
  ForkKnife,
  NotePencil,
  Pause,
  Plus,
  Receipt,
  ShoppingBag,
  Tag,
  X,
} from "@phosphor-icons/react";
import { Button, IconButton } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Badge } from "@/components/ui/primitives";
import { itemCount } from "../../domain/order";
import type { Order } from "../../domain/types";
import { usePos } from "../pos-provider";
import { money, orderCode } from "../lib/format";
import { CartItem } from "./cart-item";
import { OrderTotals } from "./order-totals";

export function CartPanel() {
  const {
    store,
    service,
    mobileCart,
    setMobileCart,
    setDialog,
    setEditing,
    setToast,
    commit,
    run,
  } = usePos();
  const { order, settings } = store;
  const totals = service.totals(store);
  const count = itemCount(order);
  const patch = (value: Partial<Order>) =>
    run(() => commit((s) => ({ ...s, order: { ...s.order, ...value } })));
  return (
    <aside
      aria-label="Keranjang pesanan"
      data-testid="cart-panel"
      className={`${mobileCart ? "fixed inset-0 z-10 flex" : "hidden"} h-full min-h-0 flex-col overflow-hidden border-l border-line bg-surface p-5 md:relative md:flex md:p-5 xl:p-6 [@media(min-width:768px)_and_(max-height:850px)]:p-4`}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full border border-line text-brand-ink">
            <Receipt size={20} />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Pesanan baru
            </h2>
            <span className="mt-1 block font-mono text-[9px] text-muted">
              {orderCode(order.id)}
            </span>
          </div>
        </div>
        <IconButton
          aria-label="Catatan pesanan"
          className="hidden md:flex"
          onClick={() => setDialog("note")}
        >
          <DotsThree size={25} />
        </IconButton>
        <IconButton
          aria-label="Tutup keranjang"
          className="md:hidden"
          onClick={() => setMobileCart(false)}
        >
          <X size={20} />
        </IconButton>
      </header>
      <div className="shrink-0 py-3">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface-alt p-1">
          {(["Dine In", "Take Away"] as const).map((type) => (
            <button
              key={type}
              onClick={() => patch({ type })}
              className={`flex items-center justify-center gap-2 rounded-md py-2.5 text-xs ${order.type === type ? "bg-brand text-white" : "text-muted"}`}
            >
              {type === "Dine In" ? (
                <ForkKnife size={16} />
              ) : (
                <ShoppingBag size={16} />
              )}
              {type}
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-[1.15fr_1fr] gap-3">
          <Field label="Nama pelanggan *">
            <Input
              className="h-10"
              required
              aria-required="true"
              placeholder="Pelanggan"
              value={order.customer}
              onChange={(e) => patch({ customer: e.target.value })}
              maxLength={60}
            />
          </Field>
          <Field label="Nomor meja *">
            <Select
              className="h-10"
              required
              aria-required="true"
              value={order.table}
              onChange={(e) => patch({ table: e.target.value })}
            >
              <option value="">Pilih meja</option>
              {Array.from({ length: 12 }, (_, i) =>
                String(i + 1).padStart(2, "0"),
              ).map((table) => (
                <option key={table} value={table}>
                  Meja {table}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between border-b border-line pb-3">
        <h3 className="flex items-center gap-2 text-xs font-semibold">
          Daftar pesanan<Badge>{count}</Badge>
        </h3>
        <button
          disabled={!count}
          onClick={() => setDialog("cancel")}
          className="text-[10px] text-muted"
        >
          Bersihkan
        </button>
      </div>
      <div
        data-testid="cart-items"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {order.items.length ? (
          order.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onEdit={() => setEditing({ item, existing: true })}
              onRemove={() =>
                patch({
                  items: order.items.filter((value) => value.id !== item.id),
                })
              }
              onQuantity={(amount) =>
                run(() => commit((s) => service.quantity(s, item.id, amount)))
              }
            />
          ))
        ) : (
          <div className="px-2 py-7 text-center">
            <div className="mx-auto mb-4 grid size-18 place-items-center rounded-full bg-surface-alt text-brand-ink">
              <Coffee size={40} weight="duotone" />
            </div>
            <h3 className="text-xs font-medium">Belum ada menu yang dipilih</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              Pilih menu di sebelah kiri
              <br />
              untuk membuat pesanan pertama.
            </p>
          </div>
        )}
      </div>
      <div className="shrink-0 pt-2">
        <button
          onClick={() => setDialog("note")}
          className="mb-3 flex w-full items-center gap-2 text-[11px] text-muted"
        >
          <NotePencil size={16} />
          <span className="flex-1 truncate text-left">
            {order.note || "Tambah catatan pesanan"}
          </span>
          <Plus size={14} />
        </button>
        <button
          onClick={() => setDialog("voucher")}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-brand/35 bg-surface-alt p-3 text-[11px]"
        >
          <Tag size={17} />
          <span className="flex-1 text-left">
            {order.voucher
              ? `${order.voucher} · ${money(totals.discount)}`
              : "Punya kode voucher?"}
          </span>
          {order.voucher ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
        <OrderTotals
          totals={totals}
          count={count}
          tax={settings.tax}
          service={order.type === "Dine In" ? settings.service : 0}
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={!count}
            onClick={() =>
              run(
                () => commit((s) => service.hold(s)),
                "Pesanan disimpan. Lanjutkan kapan saja dari Pesanan ditahan.",
              )
            }
          >
            <Pause size={17} />
            Tahan
          </Button>
          <Button
            data-testid="pay-button"
            disabled={!count || !store.shift}
            className="flex-1 justify-between px-3"
            onClick={() => {
              if (!order.customer.trim() || !order.table.trim()) {
                setToast("Nama pelanggan dan nomor meja wajib diisi.");
                return;
              }
              setDialog("payment");
            }}
          >
            Bayar sekarang
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </aside>
  );
}

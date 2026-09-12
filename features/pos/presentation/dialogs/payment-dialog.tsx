import { useRef, useState } from "react";
import {
  ArrowRight,
  CreditCard,
  HandCoins,
  QrCode,
  SpinnerGap,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CurrencyInput, Field, Input } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { DetailRow, Notice } from "@/components/ui/primitives";
import { itemCount } from "../../domain/order";
import type { Payment } from "../../domain/types";
import { money, orderCode } from "../lib/format";
import { usePos } from "../pos-provider";
import { PaymentOrderSummary } from "../cart/payment-order-summary";

const methods = [
  { name: "Tunai", icon: HandCoins },
  { name: "QRIS", icon: QrCode },
  { name: "Kartu debit", icon: CreditCard },
] as const;
export function PaymentDialog() {
  const { store, service, replace, setSelected, setDialog, setToast } =
    usePos();
  const [method, setMethod] = useState<Payment>("Tunai");
  const [cash, setCash] = useState("");
  const [reference, setReference] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const totals = service.totals(store);
  async function pay() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await service.checkout(store, {
        method,
        received: Number(cash),
        confirmed,
        reference,
      });
      replace(result.store, true);
      setSelected(result.transaction);
      setDialog("receipt");
      setToast(
        store.settings.printerFailure
          ? "Pembayaran tersimpan. Printer simulasi gagal; struk dapat dicetak ulang."
          : `Pembayaran berhasil.${store.settings.drawer && method === "Tunai" ? " Laci kas terbuka (simulasi)." : ""}`,
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Pembayaran gagal.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Modal
      title="Selesaikan pembayaran"
      subtitle={`${orderCode(store.order.id)} · ${store.order.customer || "Pelanggan"} · ${itemCount(store.order)} item`}
      onClose={() => setDialog(null)}
      busy={busy}
      wide
    >
      <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] md:items-start">
        <PaymentOrderSummary order={store.order} totals={totals} />
        <section data-testid="payment-method-section">
          <div className="mb-5 rounded-xl border border-line bg-brand-soft p-6 text-center">
            <span className="text-xs text-muted">Total pembayaran</span>
            <strong className="my-2 block text-4xl font-semibold tracking-tight text-brand-ink">
              {money(totals.total)}
            </strong>
            <small className="text-[10px] text-muted">
              Termasuk pajak dan biaya layanan
            </small>
          </div>
          <div className="mb-5 grid grid-cols-3 gap-2">
            {methods.map(({ name, icon: Icon }) => (
              <button
                key={name}
                disabled={busy}
                onClick={() => {
                  setMethod(name);
                  setConfirmed(false);
                  setError("");
                }}
                className={`flex flex-col items-center gap-2 rounded-lg border py-4 text-xs ${method === name ? "border-brand bg-brand-soft text-brand-ink" : "border-line text-muted"}`}
              >
                <Icon size={25} />
                {name}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {method === "Tunai" ? (
              <>
                <Field label="Uang diterima (Rp)">
                  <CurrencyInput
                    autoFocus
                    disabled={busy}
                    value={cash}
                    onValueChange={setCash}
                    placeholder="Masukkan nominal uang"
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set([
                      totals.total,
                      ...[50000, 100000, 150000, 200000, 500000]
                        .filter((n) => n > totals.total)
                        .slice(0, 3),
                    ]),
                  ).map((amount) => (
                    <Button
                      key={amount}
                      variant="secondary"
                      className="min-h-8 flex-1 px-2 py-2 text-[10px]"
                      disabled={busy}
                      onClick={() => setCash(String(amount))}
                    >
                      {amount === totals.total ? "Uang pas" : money(amount)}
                    </Button>
                  ))}
                </div>
                <DetailRow label="Kembalian">
                  <strong className="text-lg text-brand-ink">
                    {money(Math.max(0, Number(cash) - totals.total))}
                  </strong>
                </DetailRow>
              </>
            ) : (
              <>
                <Notice>
                  {method === "QRIS"
                    ? "QRIS statis · Simulasi. Pada operasional nyata, pelanggan memindai QRIS outlet. Untuk demo, tandai konfirmasi di bawah."
                    : "Proses kartu pada mesin EDC eksternal, lalu catat nomor referensinya. Mode demo: gunakan nomor bebas."}
                </Notice>
                <Field
                  label={
                    method === "Kartu debit"
                      ? "Nomor referensi EDC"
                      : "Nomor referensi (opsional)"
                  }
                >
                  <Input
                    disabled={busy}
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Contoh: EDC-012345"
                    maxLength={60}
                  />
                </Field>
                <label className="flex items-center gap-2 text-xs leading-relaxed">
                  <input
                    type="checkbox"
                    disabled={busy}
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                  <span>
                    Saya mengonfirmasi pembayaran telah diterima (simulasi)
                  </span>
                </label>
              </>
            )}
            {error && <Notice error>{error}</Notice>}
            <Button className="w-full" disabled={busy} onClick={pay}>
              {busy ? (
                <>
                  <SpinnerGap size={18} className="motion-safe:animate-spin" />
                  Memproses pembayaran…
                </>
              ) : (
                <>
                  Konfirmasi pembayaran
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
            <p className="text-center text-[10px] text-muted">
              Mode demo. Tidak ada dana sungguhan yang diproses.
            </p>
          </div>
        </section>
      </div>
    </Modal>
  );
}

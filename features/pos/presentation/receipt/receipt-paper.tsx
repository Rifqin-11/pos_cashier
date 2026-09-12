import { Flower } from "@phosphor-icons/react";
import { unitPrice } from "../../domain/order";
import type { Transaction } from "../../domain/types";
import { dateLabel, money, orderCode, time } from "../lib/format";

function ReceiptRow({
  label,
  value,
  total = false,
}: {
  label: string;
  value: string;
  total?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-3 ${total ? "my-3 border-t border-dashed border-line pt-4 text-sm font-semibold" : "py-1 text-[10px]"}`}
    >
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
export function ReceiptPaper({
  transaction: t,
  kitchen,
}: {
  transaction: Transaction;
  kitchen: boolean;
}) {
  return (
    <div
      data-print-receipt
      className="rounded-lg border border-dashed border-line bg-canvas p-5 text-ink print:absolute print:left-0 print:top-0 print:w-[76mm] print:border-0 print:bg-white print:p-[5mm] print:text-black"
    >
      <div className="flex flex-col items-center text-center">
        <Flower size={27} weight="fill" className="text-brand-ink" />
        <h3 className="my-1 text-xl font-semibold tracking-tight">
          mekar coffee
        </h3>
        <span className="text-[10px] text-muted">Semarang · Jawa Tengah</span>
        <small className="mt-4 text-[10px] font-semibold">
          {kitchen ? "TIKET DAPUR" : "STRUK PEMBAYARAN"} · {t.status}
        </small>
      </div>
      <div className="my-4 space-y-1 border-y border-dashed border-line py-4 text-[10px]">
        <p>{orderCode(t.id)}</p>
        <p>
          {dateLabel(t.date)} {time(t.date)}
        </p>
        <p>Kasir: {t.cashier}</p>
        <p>
          {t.customer || "Pelanggan"} · {t.type}
          {t.table ? ` · Meja ${t.table}` : ""}
        </p>
      </div>
      <div className="space-y-3 border-b border-dashed border-line pb-4">
        {t.items.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between gap-3 text-[11px] font-medium">
              <span>
                {item.quantity}× {item.name}
              </span>
              {!kitchen && (
                <span>{money(unitPrice(item) * item.quantity)}</span>
              )}
            </div>
            <small className="mt-1 block text-[9px] text-muted">
              {item.temperature} · {item.size} · {item.sugar}
              {item.extra ? " · Extra shot" : ""}
            </small>
            {item.note && (
              <small className="mt-1 block text-[9px] break-words text-muted">
                Catatan: {item.note}
              </small>
            )}
          </div>
        ))}
      </div>
      {t.note && (
        <p className="py-3 text-[10px] break-words">Catatan: {t.note}</p>
      )}
      {!kitchen && (
        <>
          <div className="pt-3">
            <ReceiptRow label="Subtotal" value={money(t.subtotal)} />
            {t.discount > 0 && (
              <ReceiptRow
                label={`Diskon (${t.voucher})`}
                value={`−${money(t.discount)}`}
              />
            )}
            <ReceiptRow label="Pajak" value={money(t.tax)} />
            <ReceiptRow label="Layanan" value={money(t.service)} />
            <ReceiptRow label="Total" value={money(t.total)} total />
            <ReceiptRow label={t.payment} value={money(t.received)} />
            {t.payment === "Tunai" && (
              <ReceiptRow
                label="Kembalian"
                value={money(t.received - t.total)}
              />
            )}
            {t.reference && (
              <ReceiptRow label="Referensi" value={t.reference} />
            )}
          </div>
          {t.status === "Refund" && (
            <p className="py-3 text-[10px] break-words">
              Refund: {t.refundReason}
            </p>
          )}
          <p className="mt-4 border-t border-dashed border-line pt-4 text-center text-[10px] leading-relaxed">
            Good coffee. Good company.
            <br />
            Sampai bertemu di cerita berikutnya.
          </p>
        </>
      )}
      <p className="mt-4 text-center text-[8px] tracking-wide text-muted">
        MOCKUP · BUKAN BUKTI PEMBAYARAN NYATA
      </p>
    </div>
  );
}

import { ForkKnife, ShoppingBag, User } from "@phosphor-icons/react";
import { DetailRow } from "@/components/ui/primitives";
import { itemCount, unitPrice } from "../../domain/order";
import type { Order, Totals } from "../../domain/types";
import { money } from "../lib/format";
import { ProductImage } from "../components/product-image";

export function PaymentOrderSummary({
  order,
  totals,
}: {
  order: Order;
  totals: Totals;
}) {
  return (
    <section
      data-testid="payment-order-summary"
      className="rounded-xl border border-line bg-canvas p-4 md:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Ringkasan pesanan
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            {itemCount(order)} item
          </h3>
        </div>
        <span className="rounded-md bg-surface-alt px-2 py-1 font-mono text-[9px] text-muted">
          {order.id.slice(0, 8).toUpperCase()}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-[10px] text-muted">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1.5">
          <User size={14} /> {order.customer || "Pelanggan"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1.5">
          {order.type === "Dine In" ? (
            <ForkKnife size={14} />
          ) : (
            <ShoppingBag size={14} />
          )}
          {order.type}
          {order.table ? ` · Meja ${order.table}` : ""}
        </span>
      </div>

      <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
        {order.items.map((item) => (
          <article
            key={item.id}
            className="flex gap-3 border-b border-dashed border-line pb-3 last:border-0 last:pb-0"
          >
            <ProductImage
              src={item.image}
              name={item.name}
              className="size-12 shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-semibold">
                    {item.quantity}× {item.name}
                  </h4>
                  <p className="mt-1 text-[10px] text-muted">
                    {item.temperature} · {item.size} · {item.sugar}
                    {item.extra ? " · Extra shot" : ""}
                  </p>
                  {item.note && (
                    <p className="mt-1 break-words text-[10px] text-muted">
                      Catatan: {item.note}
                    </p>
                  )}
                </div>
                <strong className="shrink-0 text-xs font-medium">
                  {money(unitPrice(item) * item.quantity)}
                </strong>
              </div>
            </div>
          </article>
        ))}
      </div>

      {order.note && (
        <p className="mt-4 break-words rounded-lg bg-surface px-3 py-2.5 text-[10px] leading-relaxed text-muted">
          Catatan pesanan: {order.note}
        </p>
      )}

      <div className="mt-4 border-t border-line pt-3">
        <DetailRow label="Subtotal">{money(totals.subtotal)}</DetailRow>
        {totals.discount > 0 && (
          <DetailRow label={`Voucher ${order.voucher}`}>
            <span className="text-brand-ink">−{money(totals.discount)}</span>
          </DetailRow>
        )}
        <DetailRow label="Pajak">{money(totals.tax)}</DetailRow>
        <DetailRow label="Layanan">{money(totals.service)}</DetailRow>
      </div>
    </section>
  );
}

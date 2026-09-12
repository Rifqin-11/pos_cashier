import { DetailRow } from "@/components/ui/primitives";
import type { Totals } from "../../domain/types";
import { money } from "../lib/format";

export function OrderTotals({
  totals,
  count,
  tax,
  service,
}: {
  totals: Totals;
  count: number;
  tax: number;
  service: number;
}) {
  return (
    <div className="py-3">
      <DetailRow
        label={
          <>
            Subtotal <small className="text-[11px]">({count} item)</small>
          </>
        }
      >
        {money(totals.subtotal)}
      </DetailRow>
      {totals.discount > 0 && (
        <DetailRow label="Diskon voucher">
          <span className="text-brand-ink">−{money(totals.discount)}</span>
        </DetailRow>
      )}
      <DetailRow label={`Pajak (${tax}%)`}>{money(totals.tax)}</DetailRow>
      <DetailRow label={`Biaya layanan (${service}%)`}>
        {money(totals.service)}
      </DetailRow>
      <DetailRow label="Total pembayaran" total>
        <strong className="text-xl font-semibold tracking-tight text-brand-ink">
          {money(totals.total)}
        </strong>
      </DetailRow>
    </div>
  );
}

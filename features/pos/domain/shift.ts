import type { Payment, Store } from "./types";

export function shiftSummary(store: Store) {
  const transactions = store.transactions.filter(
    (t) => t.shiftId === store.shift?.id,
  );
  const paid = transactions.filter((t) => t.status === "Lunas");
  const breakdown: Record<Payment, number> = {
    Tunai: 0,
    QRIS: 0,
    "Kartu debit": 0,
  };
  paid.forEach((t) => {
    breakdown[t.payment] += t.total;
  });
  const previousCashRefunds = store.transactions
    .filter(
      (t) =>
        t.shiftId !== store.shift?.id &&
        t.status === "Refund" &&
        t.payment === "Tunai" &&
        (t.refundShiftId
          ? t.refundShiftId === store.shift?.id
          : t.refundedAt && store.shift && t.refundedAt >= store.shift.start),
    )
    .reduce((sum, t) => sum + t.total, 0);
  return {
    count: paid.length,
    sales: paid.reduce((sum, t) => sum + t.total, 0),
    breakdown,
    refunds: transactions
      .filter((t) => t.status === "Refund")
      .reduce((sum, t) => sum + t.total, 0),
    expected:
      (store.shift?.opening ?? 0) + breakdown.Tunai - previousCashRefunds,
  };
}

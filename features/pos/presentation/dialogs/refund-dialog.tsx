import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/primitives";
import { usePos } from "../pos-provider";
import { money, orderCode } from "../lib/format";

export function RefundDialog() {
  const { service, selected, commit, setSelected, setDialog, setToast } =
    usePos();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  if (!selected) return null;
  return (
    <Modal
      title="Refund transaksi"
      subtitle={`${orderCode(selected.id)} · ${money(selected.total)}`}
      onClose={() => setDialog("receipt")}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const next = commit((s) => service.refund(s, selected.id, reason));
            setSelected(next.transactions.find((t) => t.id === selected.id)!);
            setDialog("receipt");
            setToast("Refund berhasil dicatat. Rekap shift diperbarui.");
          } catch (error) {
            setError(error instanceof Error ? error.message : "Refund gagal.");
          }
        }}
      >
        <Notice>
          Refund penuh dicatat ke rekap kasir. Pengembalian dana{" "}
          {selected.payment} dilakukan secara manual; pada mockup ini hanya
          simulasi.
        </Notice>
        <Field label="Alasan refund">
          <Textarea
            required
            rows={3}
            maxLength={300}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Jelaskan alasan pengembalian…"
          />
        </Field>
        {error && <Notice error>{error}</Notice>}
        <Button type="submit" variant="danger" className="w-full">
          Konfirmasi refund · {money(selected.total)}
        </Button>
      </form>
    </Modal>
  );
}

import { useState } from "react";
import { Check, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/primitives";
import { usePos } from "../pos-provider";

export function OrderNoteDialog() {
  const { store, commit, setDialog, setToast } = usePos();
  const [note, setNote] = useState(store.order.note);
  const [error, setError] = useState("");
  return (
    <Modal
      title="Catatan pesanan"
      subtitle="Catatan ini akan disertakan pada tiket dapur."
      onClose={() => setDialog(null)}
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            commit((s) => ({ ...s, order: { ...s.order, note } }));
            setDialog(null);
            setToast("Catatan pesanan disimpan.");
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Catatan belum disimpan.",
            );
          }
        }}
      >
        <Field label="Catatan untuk barista">
          <Textarea
            rows={4}
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: sajikan makanan bersama minuman…"
          />
        </Field>
        {error && <Notice error>{error}</Notice>}
        <Button type="submit" className="w-full">
          Simpan catatan
          <Check size={18} />
        </Button>
      </form>
    </Modal>
  );
}

export function CancelOrderDialog() {
  const { service, commit, setDialog, setToast } = usePos();
  const [error, setError] = useState("");
  return (
    <Modal
      title="Batalkan pesanan ini?"
      subtitle="Semua item, catatan, dan voucher pesanan ini akan dihapus."
      onClose={() => setDialog(null)}
    >
      <div className="mx-auto my-7 grid size-20 place-items-center rounded-full bg-red-50 text-red-700">
        <Trash size={32} />
      </div>
      {error && <Notice error>{error}</Notice>}
      <div className="mt-5 flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => setDialog(null)}
        >
          Kembali
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={() => {
            try {
              commit((s) => service.cancel(s));
              setDialog(null);
              setToast("Pesanan dibatalkan.");
            } catch (error) {
              setError(
                error instanceof Error
                  ? error.message
                  : "Pesanan belum dibatalkan.",
              );
            }
          }}
        >
          Batalkan pesanan
        </Button>
      </div>
    </Modal>
  );
}

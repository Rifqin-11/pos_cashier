import { useState } from "react";
import { Check, Printer } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Notice, SegmentedControl } from "@/components/ui/primitives";
import { usePos } from "../pos-provider";
import { ReceiptPaper } from "../receipt/receipt-paper";

export function ReceiptDialog() {
  const { store, service, selected, setDialog, navigate, setToast } = usePos();
  const [tab, setTab] = useState("Struk pelanggan");
  const [error, setError] = useState("");
  if (!selected) return null;
  const kitchen = tab === "Tiket dapur";
  return (
    <Modal
      title={
        selected.status === "Refund"
          ? "Transaksi dikembalikan"
          : "Pembayaran berhasil!"
      }
      subtitle="Terima kasih. Satu cerita lagi dimulai bersama Mekar."
      onClose={() => setDialog(null)}
    >
      <div className="space-y-4">
        <SegmentedControl
          value={tab}
          options={["Struk pelanggan", "Tiket dapur"]}
          onChange={(value) => {
            setTab(value);
            setError("");
          }}
        />
        {error && <Notice error>{error}</Notice>}
        <ReceiptPaper transaction={selected} kitchen={kitchen} />
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              try {
                service.dependencies.devices.print(store.settings, kitchen);
                setError("");
              } catch (error) {
                setError(
                  error instanceof Error
                    ? error.message
                    : "Printer tidak merespons.",
                );
              }
            }}
          >
            <Printer size={18} />
            {kitchen ? "Cetak tiket" : "Cetak struk"}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setDialog(null);
              navigate("Kasir");
            }}
          >
            Selesai
            <Check size={17} />
          </Button>
        </div>
        {selected.status === "Lunas" && (
          <button
            className="w-full text-center text-xs text-red-700 dark:text-red-300"
            onClick={() => {
              if (!store.shift) {
                setDialog(null);
                navigate("Shift kasir");
                setToast("Buka shift terlebih dahulu untuk mencatat refund.");
              } else setDialog("refund");
            }}
          >
            Ajukan refund transaksi ini
          </button>
        )}
      </div>
    </Modal>
  );
}

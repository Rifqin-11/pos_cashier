import { useState } from "react";
import { ArrowRight, Check, Tag } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/primitives";
import { usePos } from "../pos-provider";
import { dateLabel } from "../lib/format";

export function VoucherDialog() {
  const { store, service, commit, setDialog, setToast } = usePos();
  const [code, setCode] = useState(store.order.voucher);
  const [error, setError] = useState("");
  function apply() {
    try {
      commit((s) => service.applyVoucher(s, code));
      setDialog(null);
      setToast(`Voucher ${code.toUpperCase()} berhasil digunakan.`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Voucher tidak dapat digunakan.",
      );
    }
  }
  return (
    <Modal
      title="Sedikit lebih hemat"
      subtitle="Gunakan satu voucher untuk setiap pesanan."
      onClose={() => setDialog(null)}
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
      >
        <Field label="Kode voucher">
          <Input
            value={code}
            placeholder="Masukkan kode voucher"
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
          />
        </Field>
        {error && <Notice error>{error}</Notice>}
        <div className="space-y-3">
          {service.dependencies.vouchers
            .filter(
              (v) =>
                v.active &&
                new Date(v.expires).getTime() >
                  service.dependencies.now().getTime(),
            )
            .map((v) => (
              <button
                type="button"
                key={v.code}
                onClick={() => {
                  setCode(v.code);
                  setError("");
                }}
                className="flex w-full items-center gap-3 rounded-lg border border-dashed border-brand/40 bg-brand-soft p-4 text-left"
              >
                <Tag size={23} className="text-brand-ink" />
                <span className="flex-1">
                  <strong className="block text-xs font-semibold">
                    {v.label}
                  </strong>
                  <small className="mt-1 block text-[10px] text-muted">
                    {v.code} · {v.description}
                  </small>
                  <small className="mt-1 block text-[10px] text-muted">
                    Berlaku hingga {dateLabel(v.expires)}
                  </small>
                </span>
                <ArrowRight size={17} />
              </button>
            ))}
        </div>
        <div className="flex gap-2">
          {store.order.voucher && (
            <Button
              variant="secondary"
              onClick={() => {
                try {
                  commit((s) => ({ ...s, order: { ...s.order, voucher: "" } }));
                  setDialog(null);
                } catch (error) {
                  setError(String(error));
                }
              }}
            >
              Hapus voucher
            </Button>
          )}
          <Button type="submit" className="flex-1">
            Gunakan voucher
            <Check size={17} />
          </Button>
        </div>
      </form>
    </Modal>
  );
}

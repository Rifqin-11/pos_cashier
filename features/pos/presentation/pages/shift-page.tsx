import { useState } from "react";
import { ArrowRight, Clock, Wallet } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CurrencyInput, Field } from "@/components/ui/field";
import {
  Badge,
  DetailRow,
  Notice,
  Panel,
  SectionHeading,
} from "@/components/ui/primitives";
import { shiftSummary } from "../../domain/shift";
import { usePos } from "../pos-provider";
import { dateLabel, money, time } from "../lib/format";

export function ShiftPage() {
  const { store, service, commit, navigate, setToast } = usePos();
  const [opening, setOpening] = useState("300000");
  const [closing, setClosing] = useState("");
  const [error, setError] = useState("");
  const summary = shiftSummary(store);
  function submit(close: boolean) {
    try {
      if (close && closing === "")
        throw new Error("Masukkan nominal kas akhir yang valid.");
      commit((s) =>
        close
          ? service.closeShift(s, Number(closing))
          : service.openShift(s, Number(opening)),
      );
      setError("");
      setClosing("");
      setToast(
        close
          ? "Shift berhasil ditutup. Rekap shift telah disimpan."
          : "Shift dibuka. Siap menyajikan kopi!",
      );
      if (!close) navigate("Kasir");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Shift tidak dapat diperbarui.",
      );
    }
  }
  return (
    <>
      <SectionHeading
        title="Shift kasir"
        description="Awali dengan rapi, tutup hari dengan tenang."
      >
        <Badge>
          <Clock size={14} />
          {store.shift ? "Sedang berjalan" : "Belum dibuka"}
        </Badge>
      </SectionHeading>
      {store.shift ? (
        <>
          <div className="mb-5 flex items-center gap-4 rounded-xl border border-line bg-brand-soft p-6">
            <Wallet size={40} weight="duotone" className="text-brand-ink" />
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Selamat bekerja, {store.shift.cashier.split(" ")[0]}.
              </h2>
              <p className="mt-2 text-xs text-muted">
                Shift dimulai {dateLabel(store.shift.start)} pukul{" "}
                {time(store.shift.start)}
              </p>
            </div>
          </div>
          <div className="mb-5 grid gap-3 xl:grid-cols-3">
            {[
              { label: "Penjualan shift ini", value: money(summary.sales) },
              { label: "Transaksi selesai", value: summary.count },
              { label: "Saldo awal", value: money(store.shift.opening) },
            ].map((stat) => (
              <Panel key={stat.label}>
                <span className="text-xs text-muted">{stat.label}</span>
                <strong className="mt-3 block text-xl font-semibold">
                  {stat.value}
                </strong>
              </Panel>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title="Rincian pembayaran">
              {Object.entries(summary.breakdown).map(([label, amount]) => (
                <DetailRow key={label} label={label}>
                  {money(amount)}
                </DetailRow>
              ))}
              <DetailRow label="Refund shift ini">
                {money(summary.refunds)}
              </DetailRow>
              <DetailRow label="Kas yang diharapkan" total>
                {money(summary.expected)}
              </DetailRow>
            </Panel>
            <Panel
              title="Tutup shift"
              description="Hitung uang fisik di laci kas, lalu masukkan nominalnya."
            >
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(true);
                }}
              >
                <Field label="Kas akhir aktual (Rp)">
                  <CurrencyInput
                    required
                    value={closing}
                    onValueChange={setClosing}
                    placeholder="0"
                  />
                </Field>
                {closing !== "" && (
                  <DetailRow label="Selisih kas">
                    {money(Number(closing) - summary.expected)}
                  </DetailRow>
                )}
                {error && <Notice error>{error}</Notice>}
                <Button type="submit" className="w-full">
                  Tutup shift
                  <ArrowRight size={17} />
                </Button>
              </form>
            </Panel>
          </div>
        </>
      ) : (
        <Panel
          title="Siap untuk hari yang baru?"
          description="Masukkan saldo awal laci kas untuk memulai shift."
          className="mx-auto my-10 max-w-md"
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit(false);
            }}
          >
            <Field label="Saldo awal kas (Rp)">
              <CurrencyInput
                required
                value={opening}
                onValueChange={setOpening}
              />
            </Field>
            {error && <Notice error>{error}</Notice>}
            <Button type="submit" className="w-full">
              Buka shift
              <ArrowRight size={18} />
            </Button>
          </form>
        </Panel>
      )}
      {store.shifts.length > 0 && (
        <Panel title="Riwayat shift" className="mt-5">
          {store.shifts.map((shift) => (
            <div
              className="flex justify-between gap-3 border-t border-line py-4 text-xs"
              key={shift.id}
            >
              <div>
                <strong>{shift.cashier}</strong>
                <small className="mt-1 block text-[10px] text-muted">
                  {dateLabel(shift.start)} · {time(shift.start)}–
                  {time(shift.end!)}
                </small>
              </div>
              <div>
                <span className="block text-muted">Kas akhir</span>
                <strong>{money(shift.closing ?? 0)}</strong>
              </div>
              <div>
                <span className="block text-muted">Selisih</span>
                <strong>
                  {money((shift.closing ?? 0) - (shift.expected ?? 0))}
                </strong>
              </div>
            </div>
          ))}
        </Panel>
      )}
    </>
  );
}

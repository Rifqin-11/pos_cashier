import { useState } from "react";
import {
  ArrowUpRight,
  DownloadSimple,
  Receipt,
  X,
} from "@phosphor-icons/react";
import { Button, IconButton } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import {
  Badge,
  EmptyState,
  Panel,
  SectionHeading,
} from "@/components/ui/primitives";
import { usePos } from "../pos-provider";
import { dateLabel, money, orderCode, time } from "../lib/format";

export function HistoryPage() {
  const { store, service, run, setSelected, setDialog } = usePos();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua status");
  const [date, setDate] = useState("");
  const transactions = store.transactions.filter(
    (t) =>
      `${orderCode(t.id)} ${t.customer} ${t.payment}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === "Semua status" || t.status === status) &&
      (!date || new Date(t.date).toLocaleDateString("en-CA") === date),
  );
  const paid = store.transactions.filter((t) => t.status === "Lunas");
  const stats = [
    {
      label: "Total penjualan",
      value: money(paid.reduce((sum, t) => sum + t.total, 0)),
    },
    { label: "Transaksi selesai", value: String(paid.length) },
    {
      label: "Total refund",
      value: money(
        store.transactions
          .filter((t) => t.status === "Refund")
          .reduce((sum, t) => sum + t.total, 0),
      ),
    },
  ];
  return (
    <>
      <SectionHeading
        title="Riwayat transaksi"
        description="Setiap cangkir, setiap transaksi, tercatat di sini."
      >
        <Button
          variant="secondary"
          onClick={() =>
            run(
              () => service.dependencies.reports.export(transactions),
              "Laporan transaksi berhasil diunduh.",
            )
          }
        >
          <DownloadSimple size={17} />
          Ekspor CSV
        </Button>
      </SectionHeading>
      <div className="mb-6 grid gap-3 xl:grid-cols-3">
        {stats.map((stat) => (
          <Panel key={stat.label}>
            <span className="text-[11px] text-muted">{stat.label}</span>
            <strong className="mt-3 block text-xl font-semibold tracking-tight">
              {stat.value}
            </strong>
          </Panel>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          aria-label="Cari transaksi"
          placeholder="Cari ID atau nama pelanggan…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-40 flex-1"
        />
        <Select
          aria-label="Filter status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-auto"
        >
          <option>Semua status</option>
          <option>Lunas</option>
          <option>Refund</option>
        </Select>
        <Input
          aria-label="Filter tanggal transaksi"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-auto"
        />
        {date && (
          <IconButton
            aria-label="Hapus filter tanggal"
            onClick={() => setDate("")}
          >
            <X size={16} />
          </IconButton>
        )}
      </div>
      {transactions.length ? (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full whitespace-nowrap text-left text-[11px]">
            <thead className="bg-surface-alt text-muted">
              <tr>
                {[
                  "Transaksi",
                  "Pelanggan",
                  "Pembayaran",
                  "Total",
                  "Status",
                  "",
                ].map((label, i) => (
                  <th key={i} className="px-3 py-4 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t border-line bg-surface">
                  <td className="px-3 py-4">
                    <strong className="font-medium">{orderCode(t.id)}</strong>
                    <small className="mt-1 block text-[9px] text-muted">
                      {dateLabel(t.date)} · {time(t.date)}
                    </small>
                  </td>
                  <td className="px-3 py-4">
                    {t.customer || "Pelanggan"}
                    <small className="mt-1 block text-[9px] text-muted">
                      {t.type}
                    </small>
                  </td>
                  <td className="px-3 py-4">{t.payment}</td>
                  <td className="px-3 py-4 font-medium">{money(t.total)}</td>
                  <td className="px-3 py-4">
                    <Badge warning={t.status === "Refund"}>{t.status}</Badge>
                  </td>
                  <td className="px-3 py-4">
                    <IconButton
                      aria-label={`Detail ${orderCode(t.id)}`}
                      onClick={() => {
                        setSelected(t);
                        setDialog("receipt");
                      }}
                    >
                      <ArrowUpRight size={18} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<Receipt size={32} />}
          title="Belum ada transaksi"
          description={
            store.transactions.length
              ? "Tidak ada transaksi yang cocok dengan filter ini."
              : "Selesaikan pembayaran pertama untuk melihat riwayat transaksi."
          }
        />
      )}
    </>
  );
}

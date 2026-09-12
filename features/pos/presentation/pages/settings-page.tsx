import { Info, Moon, Printer, Receipt, Wallet } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import {
  Badge,
  Notice,
  Panel,
  SectionHeading,
  Toggle,
} from "@/components/ui/primitives";
import type { Settings } from "../../domain/types";
import { usePos } from "../pos-provider";

const devices = [
  {
    key: "receiptPrinter",
    label: "Printer struk",
    description: "Struk pembayaran pelanggan",
    icon: Printer,
  },
  {
    key: "kitchenPrinter",
    label: "Printer dapur",
    description: "Tiket pesanan untuk barista",
    icon: Receipt,
  },
  {
    key: "drawer",
    label: "Laci kas",
    description: "Terbuka saat pembayaran tunai",
    icon: Wallet,
  },
] as const;
const failures = [
  { key: "networkFailure", label: "Koneksi terputus" },
  { key: "paymentFailure", label: "Pembayaran gagal" },
  { key: "printerFailure", label: "Printer tidak merespons" },
] as const;
export function SettingsPage() {
  const { store, service, commit, run, dark, toggleTheme, setDialog } =
    usePos();
  const update = (patch: Partial<Settings>) =>
    run(() => commit((s) => service.settings(s, patch)));
  return (
    <>
      <SectionHeading
        title="Pengaturan"
        description="Sesuaikan meja kasir dengan kebutuhan operasional."
      >
        <Badge>Tersimpan otomatis</Badge>
      </SectionHeading>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Perangkat kasir"
          description="Perangkat dijalankan dalam mode simulasi. Cetak menggunakan dialog browser."
        >
          {devices.map(({ key, label, description, icon: Icon }) => (
            <Toggle
              key={key}
              label={label}
              description={description}
              icon={<Icon size={23} />}
              value={store.settings[key]}
              onChange={(value) => update({ [key]: value })}
            />
          ))}
          <Button
            variant="secondary"
            className="mt-4 w-full"
            disabled={!store.settings.drawer}
            onClick={() =>
              run(
                () => service.dependencies.devices.openDrawer(store.settings),
                "Laci kas berhasil dibuka (simulasi).",
              )
            }
          >
            Tes buka laci kas
            <Wallet size={17} />
          </Button>
        </Panel>
        <Panel
          title="Pajak & biaya layanan"
          description="Nilai awal demo: pajak 10% dan layanan 5%. Layanan hanya untuk Dine In."
        >
          <div className="space-y-5">
            <Field label="Pajak (%)">
              <Input
                type="number"
                min="0"
                max="100"
                value={store.settings.tax}
                onChange={(e) => update({ tax: Number(e.target.value) })}
              />
            </Field>
            <Field label="Biaya layanan (%)">
              <Input
                type="number"
                min="0"
                max="100"
                value={store.settings.service}
                onChange={(e) => update({ service: Number(e.target.value) })}
              />
            </Field>
            <Notice>
              Dihitung dari subtotal setelah diskon. Transaksi yang sudah lunas
              tidak berubah.
            </Notice>
          </div>
        </Panel>
        <Panel
          title="Simulasi kegagalan"
          description="Uji penanganan error dan coba ulang dengan aman."
        >
          {failures.map(({ key, label }) => (
            <Toggle
              key={key}
              label={label}
              value={store.settings[key]}
              onChange={(value) => update({ [key]: value })}
            />
          ))}
        </Panel>
        <Panel title="Tampilan & bantuan">
          <Toggle
            label="Mode gelap"
            description="Lebih nyaman untuk shift malam"
            icon={<Moon size={22} />}
            value={dark}
            onChange={toggleTheme}
          />
          <Button
            variant="secondary"
            className="mt-4 w-full"
            onClick={() => setDialog("help")}
          >
            <Info size={18} />
            Panduan mockup
          </Button>
          <p className="mt-6 text-xs leading-relaxed text-muted">
            Mekar POS · Mockup v1.0
            <br />
            Data disimpan lokal di browser ini.
          </p>
        </Panel>
      </div>
    </>
  );
}

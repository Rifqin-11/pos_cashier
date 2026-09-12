import type {
  PaymentProcessor,
  PosDevices,
  PreferencesRepository,
  ReportExporter,
  StoreRepository,
} from "../application/ports";
import type { Store, Transaction } from "../domain/types";

const STORAGE_KEY = "mekar-pos-demo-v1";
const THEME_KEY = "mekar-theme";

export class BrowserStoreRepository implements StoreRepository {
  load(): Store | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      return data?.version === 1 &&
        Array.isArray(data.transactions) &&
        Array.isArray(data.held) &&
        Array.isArray(data.shifts) &&
        Array.isArray(data.order?.items) &&
        data.settings
        ? (data as Store)
        : null;
    } catch {
      return null;
    }
  }
  save(store: Store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      throw new Error(
        "Transaksi belum disimpan: penyimpanan browser tidak tersedia. Kosongkan ruang browser lalu coba lagi.",
      );
    }
  }
}
export const browserPreferences: PreferencesRepository = {
  getTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  },
  setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  },
};
export const browserDevices: PosDevices = {
  print(settings, kitchen) {
    if (settings.printerFailure)
      throw new Error(
        "Printer simulasi tidak merespons. Transaksi aman; nonaktifkan simulasi kegagalan di Pengaturan lalu cetak ulang.",
      );
    if (kitchen ? !settings.kitchenPrinter : !settings.receiptPrinter)
      throw new Error("Printer ini dinonaktifkan. Aktifkan di Pengaturan.");
    window.print();
  },
  openDrawer(settings) {
    if (!settings.drawer) throw new Error("Laci kas dinonaktifkan.");
  },
};
export const demoPayments: PaymentProcessor = {
  async process(settings) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    if (settings.networkFailure)
      throw new Error(
        "Koneksi simulasi terputus. Nonaktifkan simulasi di Pengaturan, lalu coba lagi. Pesanan tetap tersimpan.",
      );
    if (settings.paymentFailure)
      throw new Error(
        "Pembayaran simulasi gagal. Nonaktifkan simulasi di Pengaturan, lalu coba lagi. Transaksi belum dicatat.",
      );
  },
};
export function transactionsCsv(transactions: readonly Transaction[]) {
  const cell = (value: string | number) =>
    `"${String(value)
      .replace(/^[=+@-]/, "'$&")
      .replaceAll('"', '""')}"`;
  const rows = [
    [
      "ID",
      "Tanggal",
      "Pelanggan",
      "Metode",
      "Subtotal",
      "Diskon",
      "Pajak",
      "Layanan",
      "Total",
      "Status",
    ],
    ...transactions.map((t) => [
      `MK-${t.id.slice(0, 6).toUpperCase()}`,
      t.date,
      t.customer || "Pelanggan",
      t.payment,
      t.subtotal,
      t.discount,
      t.tax,
      t.service,
      t.total,
      t.status,
    ]),
  ];
  return "\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
export const browserReports: ReportExporter = {
  export(transactions) {
    const url = URL.createObjectURL(
      new Blob([transactionsCsv(transactions)], {
        type: "text/csv;charset=utf-8;",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mekar-transaksi-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  },
};

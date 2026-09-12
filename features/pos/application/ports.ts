import type {
  Product,
  Settings,
  Store,
  Transaction,
  Voucher,
} from "../domain/types";

export interface StoreRepository {
  load(): Store | null;
  save(store: Store): void;
}
export interface PreferencesRepository {
  getTheme(): "light" | "dark";
  setTheme(theme: "light" | "dark"): void;
}
export interface PosDevices {
  print(settings: Settings, kitchen: boolean): void;
  openDrawer(settings: Settings): void;
}
export interface ReportExporter {
  export(transactions: readonly Transaction[]): void;
}
export interface PaymentProcessor {
  process(settings: Settings): Promise<void>;
}
export interface PosDependencies {
  repository: StoreRepository;
  preferences: PreferencesRepository;
  devices: PosDevices;
  reports: ReportExporter;
  payments: PaymentProcessor;
  products: readonly Product[];
  vouchers: readonly Voucher[];
  now(): Date;
  createId(): string;
  seed(): Store;
}

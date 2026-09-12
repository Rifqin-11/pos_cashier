import { PosService } from "./application/pos-service";
import {
  BrowserStoreRepository,
  browserDevices,
  browserPreferences,
  browserReports,
  demoPayments,
} from "./infrastructure/browser-adapters";
import {
  createDemoStore,
  products,
  vouchers,
} from "./infrastructure/demo-data";

/** Composition root: this is the only place that wires concrete browser adapters. */
export function createBrowserPosService() {
  const now = () => new Date();
  const createId = () => crypto.randomUUID();
  return new PosService({
    repository: new BrowserStoreRepository(),
    preferences: browserPreferences,
    devices: browserDevices,
    reports: browserReports,
    payments: demoPayments,
    products,
    vouchers,
    now,
    createId,
    seed: () => createDemoStore(now(), createId),
  });
}

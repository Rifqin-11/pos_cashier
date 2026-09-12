"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Flower } from "@phosphor-icons/react";
import type { PosService } from "../application/pos-service";
import type { Item, Store, Transaction } from "../domain/types";

export type Page =
  | "Kasir"
  | "Pesanan ditahan"
  | "Riwayat transaksi"
  | "Shift kasir"
  | "Pengaturan";
export type Dialog =
  | "voucher"
  | "payment"
  | "cancel"
  | "note"
  | "receipt"
  | "refund"
  | "notifications"
  | "logout"
  | "help"
  | null;

function usePosController(service: PosService) {
  const [store, setStore] = useState<Store | null>(null);
  const [page, setPage] = useState<Page>("Kasir");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [editing, setEditing] = useState<{
    item: Item;
    existing: boolean;
  } | null>(null);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(false);
  const [mobileCart, setMobileCart] = useState(false);
  const storeRef = useRef<Store | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loaded = service.load();
      storeRef.current = loaded;
      setStore(loaded);
      setDark(service.dependencies.preferences.getTheme() === "dark");
      try {
        service.persist(loaded);
      } catch {
        setToast("Penyimpanan browser tidak tersedia.");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [service]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  function replace(next: Store, persisted = false) {
    if (!persisted) service.persist(next);
    storeRef.current = next;
    setStore(next);
  }
  function commit(change: (current: Store) => Store) {
    if (!storeRef.current) throw new Error("Kasir belum siap.");
    const next = change(storeRef.current);
    replace(next);
    return next;
  }
  function run(action: () => void, message?: string) {
    try {
      action();
      if (message) setToast(message);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Terjadi kesalahan.");
    }
  }
  function navigate(next: Page) {
    setPage(next);
    setMobileCart(false);
  }
  function toggleTheme(value: boolean) {
    run(() => {
      service.dependencies.preferences.setTheme(value ? "dark" : "light");
      setDark(value);
    });
  }
  return {
    store,
    service,
    page,
    dialog,
    editing,
    selected,
    toast,
    dark,
    mobileCart,
    setDialog,
    setEditing,
    setSelected,
    setToast,
    setMobileCart,
    commit,
    replace,
    run,
    navigate,
    toggleTheme,
  };
}
type PosContextValue = Omit<ReturnType<typeof usePosController>, "store"> & {
  store: Store;
};
const PosContext = createContext<PosContextValue | null>(null);

export function PosProvider({
  service,
  children,
}: {
  service: PosService;
  children: ReactNode;
}) {
  const controller = usePosController(service);
  if (!controller.store)
    return (
      <div className="grid min-h-dvh place-content-center bg-canvas text-center text-brand">
        <Flower size={48} weight="fill" className="mx-auto" />
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          mekar coffee
        </h1>
        <p className="mt-6 text-xs text-muted">Menyiapkan meja kasirmu…</p>
      </div>
    );
  return (
    <PosContext.Provider value={{ ...controller, store: controller.store }}>
      <div
        data-theme={controller.dark ? "dark" : "light"}
        className="h-dvh w-full overflow-hidden bg-canvas text-ink"
      >
        {children}
      </div>
    </PosContext.Provider>
  );
}
export function usePos() {
  const context = useContext(PosContext);
  if (!context)
    throw new Error("Komponen POS harus berada di dalam PosProvider.");
  return context;
}

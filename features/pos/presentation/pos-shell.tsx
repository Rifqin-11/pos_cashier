"use client";
import { useEffect } from "react";
import { ArrowRight, ShoppingBag, X } from "@phosphor-icons/react";
import { itemCount } from "../domain/order";
import { CatalogPage } from "./catalog/catalog-page";
import { CartPanel } from "./cart/cart-panel";
import { AppFooter } from "./components/app-footer";
import { AppHeader } from "./components/app-header";
import { Navigation } from "./components/navigation";
import { HeldOrdersPage } from "./pages/held-orders-page";
import { HistoryPage } from "./pages/history-page";
import { SettingsPage } from "./pages/settings-page";
import { ShiftPage } from "./pages/shift-page";
import { LoginPage } from "./pages/login-page";
import { DialogHost } from "./dialogs/dialog-host";
import { money } from "./lib/format";
import { usePos } from "./pos-provider";

const pages = {
  Kasir: CatalogPage,
  "Pesanan ditahan": HeldOrdersPage,
  "Riwayat transaksi": HistoryPage,
  "Shift kasir": ShiftPage,
  Pengaturan: SettingsPage,
};

export function PosShell() {
  const {
    store,
    service,
    page,
    dialog,
    editing,
    toast,
    setToast,
    setMobileCart,
    navigate,
  } = usePos();
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!store.session || dialog || editing) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        navigate("Kasir");
        requestAnimationFrame(() =>
          window.dispatchEvent(new Event("pos:search")),
        );
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [store.session, dialog, editing, navigate]);
  if (!store.session) return <LoginPage />;
  const Page = pages[page];
  return (
    <div data-testid="pos-app" className="flex h-full flex-col pb-19 md:pb-0">
      <AppHeader />
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[minmax(0,1fr)_325px] xl:grid-cols-[minmax(0,1fr)_355px] min-[1500px]:grid-cols-[minmax(0,1fr)_390px]">
        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-canvas">
          <Navigation />
          <div
            data-testid="page-scroll"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-canvas px-5 py-6 md:px-7"
          >
            <Page />
          </div>
        </main>
        <CartPanel />
      </div>
      <AppFooter />
      <button
        onClick={() => setMobileCart(true)}
        className="fixed inset-x-3 bottom-3 z-2 flex items-center gap-3 rounded-xl bg-brand px-4 py-4 text-xs text-white shadow-lg md:hidden"
      >
        <ShoppingBag size={21} />
        <span className="flex-1 text-left">
          Lihat pesanan ({itemCount(store.order)})
        </span>
        <strong>{money(service.totals(store).total)}</strong>
        <ArrowRight size={18} />
      </button>
      <DialogHost />
      {toast && (
        <div
          role="status"
          className="fixed bottom-22 left-1/2 z-40 flex w-max max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3 rounded-lg bg-brand px-4 py-3 text-xs leading-relaxed text-white shadow-lg md:bottom-6"
        >
          <span className="flex-1">{toast}</span>
          <button onClick={() => setToast("")} aria-label="Tutup notifikasi">
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}

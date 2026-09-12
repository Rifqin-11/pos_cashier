import { Bell, CaretDown, Flower } from "@phosphor-icons/react";
import { IconButton } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/primitives";
import { usePos } from "../pos-provider";
import { initials } from "../lib/format";
import { HeaderDate } from "./header-date";

export function AppHeader() {
  const { store, navigate, setDialog } = usePos();
  return (
    <header
      data-testid="app-header"
      className="flex h-17 shrink-0 items-center gap-3 border-b border-line bg-white px-4 md:h-20 md:gap-6 md:px-8 dark:bg-canvas [@media(min-width:768px)_and_(max-height:850px)]:h-16"
    >
      <button
        onClick={() => navigate("Kasir")}
        aria-label="Mekar Coffee, halaman kasir"
        className="flex items-center gap-2.5 text-left text-brand-ink"
      >
        <Flower size={39} weight="fill" className="hidden min-[400px]:block" />
        <span className="text-3xl font-bold leading-none tracking-[-2px] md:text-4xl">
          mekar
          <span className="mt-2 block text-[7px] font-semibold tracking-[1.25px]">
            EATERY & COFFEE
          </span>
        </span>
      </button>
      <HeaderDate />
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <span className="hidden rounded-md border border-dashed border-line px-2 py-1 text-[10px] text-muted xl:block">
          Mode demo
        </span>
        <button
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-2 text-[10px] md:px-3 ${store.shift ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200" : "bg-red-100 text-red-900 dark:bg-red-950/50 dark:text-red-200"}`}
          onClick={() => navigate("Shift kasir")}
        >
          <StatusDot tone={store.shift ? "success" : "danger"} />
          {store.shift ? "Shift aktif" : "Shift ditutup"}
          <CaretDown size={12} className="hidden md:block" />
        </button>
        <IconButton
          aria-label="Notifikasi"
          className="hidden md:flex"
          onClick={() => setDialog("notifications")}
        >
          <Bell size={21} />
        </IconButton>
        <button
          onClick={() => setDialog("logout")}
          className="flex items-center gap-2.5 text-left"
        >
          <span className="grid size-9 place-items-center rounded-full border-[3px] border-surface bg-[#d4b37a] text-[11px] font-semibold text-[#3f3825] outline outline-line dark:bg-[#b08b51] dark:text-[#fff8e8]">
            {initials(store.session?.name ?? "?")}
          </span>
          <span className="hidden md:block">
            <strong className="block text-[11px] font-semibold">
              {store.session?.name ?? "Belum masuk"}
            </strong>
            <small className="mt-1 block text-[10px] text-muted">Kasir</small>
          </span>
          <CaretDown size={13} className="hidden md:block" />
        </button>
      </div>
    </header>
  );
}

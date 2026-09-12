import {
  Clock,
  GearSix,
  GridFour,
  Pause,
  Receipt,
} from "@phosphor-icons/react";
import { usePos, type Page } from "../pos-provider";

const items = [
  { name: "Kasir", icon: GridFour },
  { name: "Pesanan ditahan", icon: Pause },
  { name: "Riwayat transaksi", icon: Receipt },
  { name: "Shift kasir", icon: Clock },
] as const;
export function Navigation() {
  const { page, navigate, store } = usePos();
  const active = (name: Page) =>
    page === name ? "bg-brand text-white" : "text-muted hover:bg-surface-alt";
  return (
    <nav
      aria-label="Navigasi utama"
      className="mx-5 flex min-h-16 shrink-0 items-center gap-2 border-b border-line md:mx-7"
    >
      {items.map(({ name, icon: Icon }) => (
        <button
          key={name}
          aria-label={name}
          aria-current={page === name ? "page" : undefined}
          onClick={() => navigate(name)}
          className={`flex h-9 items-center gap-2 rounded-lg px-3 text-[11px] ${active(name)}`}
        >
          <Icon size={18} weight={page === name ? "fill" : "regular"} />
          <span className={name === "Kasir" ? "" : "hidden xl:inline"}>
            {name}
          </span>
          {name === "Pesanan ditahan" && store.held.length > 0 && (
            <span className="rounded bg-brand-soft px-1 text-[10px] text-ink">
              {store.held.length}
            </span>
          )}
        </button>
      ))}
      <button
        aria-label="Pengaturan"
        onClick={() => navigate("Pengaturan")}
        className={`ml-auto grid size-9 place-items-center rounded-lg ${active("Pengaturan")}`}
      >
        <GearSix size={20} />
      </button>
    </nav>
  );
}

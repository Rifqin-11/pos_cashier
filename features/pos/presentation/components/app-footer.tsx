import { Info } from "@phosphor-icons/react";
import { StatusDot } from "@/components/ui/primitives";
import { usePos } from "../pos-provider";

export function AppFooter() {
  const { setDialog } = usePos();
  return (
    <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-line bg-canvas px-5 py-3 text-[11px] text-muted md:px-8">
      <span>
        © {new Date().getFullYear()} Mekar Coffee
        <span className="hidden lg:inline"> / Made for your daily flow.</span>
      </span>
      <button
        onClick={() => setDialog("help")}
        className="flex items-center gap-1.5"
      >
        <Info size={14} />
        Bantuan & pintasan
      </button>
      <span className="hidden items-center gap-1.5 md:flex">
        <StatusDot />
        Tersimpan di perangkat ini
      </span>
    </footer>
  );
}

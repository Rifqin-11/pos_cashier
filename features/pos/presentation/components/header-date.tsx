import { useEffect, useState } from "react";
import { CalendarBlank } from "@phosphor-icons/react";

export function HeaderDate() {
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex shrink-0 items-center gap-3 border-l border-line pl-3 md:pl-7">
      <span className="hidden size-9 place-items-center rounded-xl border border-line bg-surface-alt md:grid">
        <CalendarBlank size={20} />
      </span>
      <time dateTime={today.toISOString()}>
        <span className="block text-[11px] font-semibold md:text-xs">
          {today.toLocaleDateString("id-ID", {
            weekday: "long",
            timeZone: "Asia/Jakarta",
          })}
        </span>
        <span className="mt-1 block text-[10px] text-muted md:text-[11px]">
          {today.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Jakarta",
          })}
        </span>
      </time>
    </div>
  );
}

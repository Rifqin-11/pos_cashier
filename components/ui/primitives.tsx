import type { ReactNode } from "react";
import { Info, Minus, Plus } from "@phosphor-icons/react";

export function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-line bg-surface p-5 ${className}`}
    >
      {title && (
        <h2 className="mb-3 text-base font-semibold tracking-tight">{title}</h2>
      )}
      {description && (
        <p className="mb-5 text-xs leading-relaxed text-muted">{description}</p>
      )}
      {children}
    </section>
  );
}
export function Badge({
  children,
  warning = false,
}: {
  children: ReactNode;
  warning?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-[10px] ${warning ? "bg-orange-100 text-orange-900" : "bg-brand-soft text-ink"}`}
    >
      {children}
    </span>
  );
}
export function StatusDot({
  tone = "brand",
}: {
  tone?: "brand" | "success" | "danger";
}) {
  const tones = {
    brand: "bg-brand-ink",
    success: "bg-emerald-600",
    danger: "bg-red-600",
  };
  return (
    <span
      className={`inline-block size-1.5 shrink-0 rounded-full ${tones[tone]}`}
    />
  );
}
export function Notice({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <div
      role={error ? "alert" : undefined}
      className={`flex gap-2 rounded-lg p-3 text-xs leading-relaxed ${error ? "bg-red-50 text-red-800" : "bg-brand-soft text-ink"}`}
    >
      <Info size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="px-4 py-14 text-center">
      <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mx-auto mb-5 mt-2 max-w-xs text-xs leading-relaxed text-muted">
        {description}
      </p>
      {children}
    </div>
  );
}
export function SectionHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-xs text-muted">{description}</p>
      </div>
      {children}
    </header>
  );
}
export function DetailRow({
  label,
  children,
  total = false,
}: {
  label: ReactNode;
  children: ReactNode;
  total?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 ${total ? "mt-3 border-t border-dashed border-line pt-4 text-sm font-semibold" : "py-1.5 text-xs"}`}
    >
      <span className={total ? "" : "text-muted"}>{label}</span>
      <span>{children}</span>
    </div>
  );
}
export function QuantityControl({
  value,
  decrease,
  increase,
  minimum = 0,
  name = "",
}: {
  value: number;
  decrease(): void;
  increase(): void;
  minimum?: number;
  name?: string;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-line">
      <button
        type="button"
        aria-label={name ? `Kurangi ${name}` : "Kurangi jumlah"}
        disabled={value <= minimum}
        onClick={decrease}
        className="grid size-8 place-items-center bg-surface-alt"
      >
        <Minus size={13} />
      </button>
      <span className="min-w-8 text-center text-xs">{value}</span>
      <button
        type="button"
        aria-label={name ? `Tambah jumlah ${name}` : "Tambah jumlah"}
        onClick={increase}
        className="grid size-8 place-items-center bg-surface-alt"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange(value: T): void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`min-h-10 flex-1 rounded-lg border px-2 py-2 text-[11px] ${value === option ? "border-brand bg-brand-soft text-ink" : "border-line bg-surface text-muted"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
export function Toggle({
  label,
  description,
  value,
  onChange,
  icon,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange(value: boolean): void;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line py-4">
      {icon}
      <div className="flex-1">
        <strong className="block text-xs font-medium">{label}</strong>
        {description && (
          <small className="mt-1 block text-[11px] text-muted">
            {description}
          </small>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`h-6 w-10 rounded-full p-1 ${value ? "bg-brand" : "bg-stone-400"}`}
      >
        <span
          className={`block size-4 rounded-full bg-white transition-transform ${value ? "translate-x-4" : ""}`}
        />
      </button>
    </div>
  );
}

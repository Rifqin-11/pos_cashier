import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const inputStyles =
  "w-full min-w-0 rounded-lg border border-line bg-surface px-3 py-2.5 text-xs text-ink placeholder:text-muted disabled:opacity-50";
export function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[11px] font-medium">{label}</legend>
      {children}
    </fieldset>
  );
}
export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`flex min-w-0 flex-col gap-2 text-[11px] font-medium ${className}`}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${inputStyles} ${className}`} {...props} />;
}
export function CurrencyInput({
  value,
  onValueChange,
  className = "",
  ...props
}: Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> & {
  value: string;
  onValueChange(value: string): void;
}) {
  const formatted = value
    ? new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
        Number(value),
      )
    : "";
  return (
    <input
      {...props}
      inputMode="numeric"
      value={formatted}
      onChange={(event) => onValueChange(event.target.value.replace(/\D/g, ""))}
      className={`${inputStyles} ${className}`}
    />
  );
}
export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${inputStyles} ${className}`} {...props} />;
}
export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={`${inputStyles} resize-y ${className}`} {...props} />
  );
}

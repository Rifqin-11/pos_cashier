import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-alt",
  danger: "bg-red-700 text-white hover:bg-red-800",
  ghost: "text-muted hover:bg-surface-alt hover:text-ink",
};
export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
export function IconButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant="ghost"
      className={`size-9 min-h-9 rounded-full p-0 ${className}`}
      {...props}
    />
  );
}

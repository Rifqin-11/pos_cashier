"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import { IconButton } from "./button";

export function Modal({
  title,
  subtitle,
  children,
  onClose,
  busy = false,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose(): void;
  busy?: boolean;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = ref.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        if (busy) event.preventDefault();
        else onClose();
      }}
      onClick={(event) => {
        if (!busy && event.target === event.currentTarget) onClose();
      }}
      className={`m-auto max-h-[calc(100dvh-32px)] ${wide ? "w-[min(920px,calc(100vw-24px))]" : "w-[min(480px,calc(100vw-24px))]"} overflow-y-auto rounded-2xl border border-line bg-surface p-6 text-ink shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm print:absolute print:inset-0 print:m-0 print:max-h-none print:w-[80mm] print:overflow-visible print:border-0 print:p-0 print:shadow-none`}
    >
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 id={titleId} className="text-[22px] font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
              {subtitle}
            </p>
          )}
        </div>
        <IconButton aria-label="Tutup dialog" disabled={busy} onClick={onClose}>
          <X size={20} />
        </IconButton>
      </header>
      {children}
    </dialog>
  );
}

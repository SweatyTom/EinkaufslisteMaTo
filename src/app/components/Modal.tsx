"use client";

import { ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-black/5">
          <div className="px-5 py-4 border-b border-zinc-200/60 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>
          <div className="px-5 py-4">{children}</div>
          {footer ? <div className="px-5 pb-5">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

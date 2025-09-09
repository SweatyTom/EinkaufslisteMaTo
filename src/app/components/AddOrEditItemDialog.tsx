"use client";

import { useEffect, useMemo, useState } from "react";
import { Item } from "../types";
import Modal from "./Modal";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (item: Omit<Item, "id">, editingId?: string) => void;
  editing?: Item | null;
};

export default function AddOrEditItemDialog({
  open,
  onOpenChange,
  onSubmit,
  editing,
}: Props) {
  const isEdit = Boolean(editing);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(false);
  const [date, setDate] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (editing) {
      setTitle(editing.productTitle);
      setStatus(editing.status);
      setDate(editing.date);
      setImageUrl(editing.imageUrl ?? "");
    } else {
      setTitle("");
      setStatus(false);
      setDate(new Date().toISOString().slice(0, 10));
      setImageUrl("");
    }
  }, [editing, open]);

  const valid = useMemo(
    () => title.trim().length > 0 && date.trim().length > 0,
    [title, date]
  );

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title={isEdit ? "Eintrag bearbeiten" : "Neuen Eintrag hinzufügen"}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-3 py-2 text-sm border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Abbrechen
          </button>
          <button
            disabled={!valid}
            onClick={() => {
              const payload: Omit<Item, "id"> = {
                productTitle: title.trim(),
                status,
                date,
                imageUrl: imageUrl.trim() || undefined,
              };
              onSubmit(payload, editing?.id);
              onOpenChange(false);
            }}
            className={`rounded-lg px-3 py-2 text-sm text-white ${
              valid
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-emerald-600/50 cursor-not-allowed"
            }`}
          >
            {isEdit ? "Speichern" : "Hinzufügen"}
          </button>
        </div>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Produkt
          </label>
          <input
            id="title"
            placeholder="z.B. Milch 1L"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="date" className="text-sm font-medium">
            Datum
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="image" className="text-sm font-medium">
            Bild-URL (optional)
          </label>
          <input
            id="image"
            placeholder="https://…"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            id="status"
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            className="h-4 w-4 accent-emerald-600"
          />
          <span>Schon gekauft</span>
        </label>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Vorschau"
            className="h-24 w-full object-cover rounded-xl ring-1 ring-zinc-200 dark:ring-white/10"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : null}
      </div>
    </Modal>
  );
}

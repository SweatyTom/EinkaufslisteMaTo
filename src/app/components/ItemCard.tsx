"use client";

import { Item } from "../types";

type Props = {
  item: Item;
  onToggle: (id: string, next: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function ItemCard({ item, onToggle, onDelete, onEdit }: Props) {
  const d = new Date(item.date);
  const pretty = isNaN(d.getTime()) ? item.date : d.toLocaleDateString();

  return (
    <div className="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur shadow-md p-4 flex gap-4">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.productTitle}
          className="h-20 w-20 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-white/10"
        />
      ) : (
        <div className="h-20 w-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
          Kein Bild
        </div>
      )}

      <div className="flex-1 min-w-0">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={item.status}
            onChange={(e) => onToggle(item.id, e.target.checked)}
            className="mt-1 h-5 w-5 accent-emerald-600"
          />
          <div className="min-w-0">
            <div
              className={`font-semibold ${
                item.status ? "line-through opacity-60" : ""
              }`}
            >
              {item.productTitle}
            </div>
            <div className="text-sm text-zinc-500">{pretty}</div>
          </div>
        </label>
      </div>

      <div className="flex items-start gap-2">
        <button
          onClick={() => onEdit(item.id)}
          className="rounded-md px-2 py-1 text-sm border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Bearbeiten"
          title="Bearbeiten"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="rounded-md px-2 py-1 text-sm border border-red-200/80 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
          aria-label="Löschen"
          title="Löschen"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

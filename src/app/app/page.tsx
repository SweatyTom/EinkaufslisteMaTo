"use client";

import { useMemo, useState } from "react";
import { Item } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ItemCard from "../components/ItemCard";
import AddOrEditItemDialog from "../components/AddOrEditItemDialog";
import EmptyState from "../components/EmptyState";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Page() {
  const [items, setItems] = useLocalStorage<Item[]>("shopping-items", []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "open" | "done">("all");

  const filtered = useMemo(() => {
    const base = items
      .filter((i) =>
        i.productTitle.toLowerCase().includes(q.toLowerCase().trim())
      )
      .sort((a, b) =>
        a.status === b.status
          ? a.productTitle.localeCompare(b.productTitle)
          : Number(a.status) - Number(b.status)
      );
    if (tab === "open") return base.filter((i) => !i.status);
    if (tab === "done") return base.filter((i) => i.status);
    return base;
  }, [items, q, tab]);

  function handleSubmit(payload: Omit<Item, "id">, editingId?: string) {
    if (editingId) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingId ? { ...i, ...payload } : i))
      );
      setEditing(null);
      return;
    }
    const newItem: Item = { id: uid(), ...payload };
    setItems((prev) => [newItem, ...prev]);
  }

  function toggleStatus(id: string, next: boolean) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: next } : i))
    );
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearDone() {
    setItems((prev) => prev.filter((i) => !i.status));
  }

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Einkaufsliste</h1>
        <div className="ml-auto flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Suchen…"
            className="w-48 md:w-64 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={openAdd}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2"
          >
            Neuer Eintrag
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-4 inline-flex rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        <TabButton active={tab === "all"} onClick={() => setTab("all")}>
          Alle
        </TabButton>
        <TabButton active={tab === "open"} onClick={() => setTab("open")}>
          Offen
        </TabButton>
        <TabButton active={tab === "done"} onClick={() => setTab("done")}>
          Gekauft
        </TabButton>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onToggle={toggleStatus}
              onDelete={remove}
              onEdit={(id) => {
                const it = items.find((x) => x.id === id) || null;
                setEditing(it);
                setDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-zinc-500">
          {items.filter((i) => !i.status).length} offen ·{" "}
          {items.filter((i) => i.status).length} gekauft
        </span>
        <button
          onClick={clearDone}
          disabled={!items.some((i) => i.status)}
          className="rounded-lg px-3 py-2 text-sm border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          Gekaufte entfernen
        </button>
      </div>

      {/* Dialog */}
      <AddOrEditItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        editing={editing}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center">
      <div className="h-10 w-10 mb-3 flex items-center justify-center text-2xl">
        🛒
      </div>
      <h3 className="text-xl font-semibold">Noch keine Einträge</h3>
      <p className="text-sm text-zinc-500 mb-4">
        Füge dein erstes Produkt hinzu – Titel, Datum, optional ein Bild.
      </p>
      <button
        onClick={onAdd}
        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2"
      >
        Eintrag hinzufügen
      </button>
    </div>
  );
}

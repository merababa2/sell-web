"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import type { TableDTO } from "@/lib/types";
import QrCard from "@/components/admin/qr-card";

export default function TablesTab({
  initialTables,
  token,
}: {
  initialTables: TableDTO[];
  token: string;
}) {
  const [tables, setTables] = useState<TableDTO[]>(initialTables);
  const [name, setName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth: HeadersInit = { Authorization: `Bearer ${token}` };

  async function addTable() {
    if (adding || !name.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setTables((t) => [...t, data.table]);
      setName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add table.");
    } finally {
      setAdding(false);
    }
  }

  async function patch(id: string, body: object) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/tables/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) setTables((t) => t.map((x) => (x.id === id ? data.table : x)));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/tables/${id}`, { method: "DELETE", headers: auth });
      if (res.ok) setTables((t) => t.filter((x) => x.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-md">
          <h2 className="font-display text-3xl">Tables &amp; QR codes</h2>
          <p className="mt-2 text-sm leading-relaxed text-fog">
            Every table gets its own QR. Guests scan to see the live menu and send
            orders to the pass.
          </p>
        </div>
        <div className="flex w-full max-w-sm gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTable()}
            placeholder="Table 9"
            className="flex-1 rounded-full border border-line bg-coal px-5 py-3 text-sm placeholder:text-fog/50 focus:border-ember/60"
          />
          <button
            onClick={addTable}
            disabled={adding || !name.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-ember-soft disabled:opacity-40"
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-300">
          {error}
        </p>
      )}

      {tables.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line py-16 text-center text-sm text-fog">
          No tables yet — add your first one above.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((t) => (
            <QrCard
              key={t.id}
              title={t.name}
              subtitle="Dine-in ordering"
              token={t.token}
              active={t.active}
              busy={busyId === t.id}
              onToggle={(active) => patch(t.id, { active })}
              onRegenerate={() => patch(t.id, { regenerate: true })}
              onDelete={() => remove(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

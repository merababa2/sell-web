"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Flame,
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { MenuItemDTO } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { filsToKwd } from "@/lib/format";

type EditorState = { mode: "new" } | { mode: "edit"; item: MenuItemDTO } | null;

const EMPTY_FORM = {
  name: "",
  nameAr: "",
  category: CATEGORIES[0] as string,
  priceKwd: "",
  description: "",
  imageUrl: "",
  available: true,
  popular: false,
};

export default function MenuTab({
  initialMenu,
  token,
}: {
  initialMenu: MenuItemDTO[];
  token: string;
}) {
  const [items, setItems] = useState<MenuItemDTO[]>(initialMenu);
  const [editor, setEditor] = useState<EditorState>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const auth: HeadersInit = { Authorization: `Bearer ${token}` };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.nameAr ?? "").includes(query.trim()) ||
        i.category.toLowerCase().includes(q),
    );
  }, [items, query]);

  const groups = useMemo(() => {
    const cats = [
      ...CATEGORIES.filter((c) => filtered.some((i) => i.category === c)),
      ...[...new Set(filtered.map((i) => i.category))].filter(
        (c) => !(CATEGORIES as readonly string[]).includes(c),
      ),
    ];
    return cats.map((cat) => ({
      cat,
      items: filtered.filter((i) => i.category === cat),
    }));
  }, [filtered]);

  function openNew() {
    setForm({ ...EMPTY_FORM });
    setError(null);
    setEditor({ mode: "new" });
  }

  function openEdit(item: MenuItemDTO) {
    setForm({
      name: item.name,
      nameAr: item.nameAr ?? "",
      category: item.category,
      priceKwd: filsToKwd(item.priceFils),
      description: item.description,
      imageUrl: item.imageUrl ?? "",
      available: item.available,
      popular: item.popular,
    });
    setError(null);
    setEditor({ mode: "edit", item });
  }

  async function save() {
    if (busy || !editor) return;
    setBusy(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      nameAr: form.nameAr.trim(),
      description: form.description.trim(),
      category: form.category,
      priceKwd: form.priceKwd,
      imageUrl: form.imageUrl.trim(),
      available: form.available,
      popular: form.popular,
    };
    try {
      const res =
        editor.mode === "new"
          ? await fetch("/api/admin/menu", {
              method: "POST",
              headers: { "Content-Type": "application/json", ...auth },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/menu/${editor.item.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json", ...auth },
              body: JSON.stringify(payload),
            });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setItems((list) =>
        editor.mode === "new"
          ? [...list, data.item]
          : list.map((i) => (i.id === data.item.id ? data.item : i)),
      );
      setEditor(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, body: object) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) setItems((l) => l.map((i) => (i.id === id ? data.item : i)));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE", headers: auth });
      if (res.ok) setItems((l) => l.filter((i) => i.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  const field =
    "w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm placeholder:text-fog/50 focus:border-ember/60";

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-md">
          <h2 className="font-display text-3xl">Menu manager</h2>
          <p className="mt-2 text-sm leading-relaxed text-fog">
            Add dishes, edit prices, and 86 items with the eye toggle.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes…"
              className="w-56 rounded-full border border-line bg-coal py-3 pl-11 pr-4 text-sm placeholder:text-fog/50 focus:border-ember/60"
            />
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-ember-soft"
          >
            <Plus className="h-4 w-4" />
            New dish
          </button>
        </div>
      </div>

      {groups.length === 0 && (
        <p className="rounded-3xl border border-dashed border-line py-16 text-center text-sm text-fog">
          Nothing matches your search.
        </p>
      )}

      {groups.map((g) => (
        <section key={g.cat}>
          <h3 className="mb-3.5 flex items-baseline gap-3 font-display text-2xl">
            {g.cat}
            <span className="text-sm italic text-fog">({g.items.length})</span>
          </h3>
          <div className="grid gap-3 lg:grid-cols-2">
            {g.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 rounded-3xl border bg-coal p-3.5 transition ${
                  item.available ? "border-line" : "border-line opacity-60"
                }`}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-panel">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      loading="lazy"
                      className={`h-full w-full object-cover ${item.available ? "" : "grayscale"}`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Flame className="h-4 w-4 text-fog" />
                    </div>
                  )}
                  {item.popular && (
                    <Star className="absolute right-1 top-1 h-3.5 w-3.5 fill-gold text-gold" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  {item.nameAr && (
                    <p dir="rtl" className="truncate font-arabic text-xs text-sand">
                      {item.nameAr}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-ember">{filsToKwd(item.priceFils)} KWD</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => patch(item.id, { popular: !item.popular })}
                    disabled={busyId === item.id}
                    title="Toggle popular"
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border transition ${
                      item.popular ? "border-gold/50 text-gold" : "border-line text-fog hover:text-gold"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${item.popular ? "fill-gold" : ""}`} />
                  </button>
                  <button
                    onClick={() => patch(item.id, { available: !item.available })}
                    disabled={busyId === item.id}
                    title={item.available ? "86 this dish" : "Back in stock"}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border transition ${
                      item.available ? "border-line text-fog hover:text-ember" : "border-emerald-400/40 text-emerald-300"
                    }`}
                  >
                    {item.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    title="Edit"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-line text-fog transition hover:text-cream"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${item.name}" permanently?`)) remove(item.id);
                    }}
                    disabled={busyId === item.id}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-line text-fog transition hover:border-red-400/50 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Editor slide-over */}
      <AnimatePresence>
        {editor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !busy && setEditor(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-coal"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <h3 className="font-display text-2xl">
                  {editor.mode === "new" ? "New dish" : "Edit dish"}
                </h3>
                <button
                  onClick={() => setEditor(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fog transition hover:text-cream"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-fog">
                    Name (English) *
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Truffle Pizza"
                    className={field}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-fog">
                    Name (Arabic)
                  </span>
                  <input
                    dir="rtl"
                    value={form.nameAr}
                    onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    placeholder="بيتزا الترافل"
                    className={`${field} font-arabic`}
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-fog">
                      Category *
                    </span>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={field}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-fog">
                      Price (KWD) *
                    </span>
                    <input
                      value={form.priceKwd}
                      onChange={(e) => setForm({ ...form, priceKwd: e.target.value })}
                      placeholder="6.750"
                      inputMode="decimal"
                      className={field}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-fog">
                    Description
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    placeholder="Short, appetising, honest…"
                    className={`${field} resize-none`}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-fog">
                    Image URL
                  </span>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://…"
                    className={field}
                  />
                </label>
                {form.imageUrl && (
                  <div className="overflow-hidden rounded-2xl border border-line">
                    <img src={form.imageUrl} alt="Preview" className="h-36 w-full object-cover" />
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setForm({ ...form, available: !form.available })}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                      form.available
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-line text-fog"
                    }`}
                  >
                    {form.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {form.available ? "Available" : "86'd"}
                  </button>
                  <button
                    onClick={() => setForm({ ...form, popular: !form.popular })}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                      form.popular ? "border-gold/40 bg-gold/10 text-gold" : "border-line text-fog"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${form.popular ? "fill-gold" : ""}`} />
                    Signature
                  </button>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-300">
                    {error}
                  </p>
                )}
              </div>

              <div className="border-t border-line px-6 py-5">
                <button
                  onClick={save}
                  disabled={busy || form.name.trim().length < 2 || !form.priceKwd}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-ember py-4 text-sm font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editor.mode === "new" ? "Add to menu" : "Save changes"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

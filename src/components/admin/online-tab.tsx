"use client";

import { useState } from "react";
import { Globe, Loader2, Plus } from "lucide-react";
import type { AccessLinkDTO } from "@/lib/types";
import QrCard from "@/components/admin/qr-card";

export default function OnlineTab({
  initialLinks,
  token,
}: {
  initialLinks: AccessLinkDTO[];
  token: string;
}) {
  const [links, setLinks] = useState<AccessLinkDTO[]>(initialLinks);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const auth: HeadersInit = { Authorization: `Bearer ${token}` };

  async function createLink() {
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) setLinks((l) => [...l, data.link]);
    } finally {
      setCreating(false);
    }
  }

  async function patch(id: string, body: object) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/access/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) setLinks((l) => l.map((x) => (x.id === id ? data.link : x)));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/access/${id}`, { method: "DELETE", headers: auth });
      if (res.ok) setLinks((l) => l.filter((x) => x.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-md">
          <h2 className="font-display text-3xl">Online ordering link</h2>
          <p className="mt-2 text-sm leading-relaxed text-fog">
            Share this link on Instagram, WhatsApp or Google — it opens the live menu
            for pickup &amp; delivery orders.
          </p>
        </div>
        <button
          onClick={createLink}
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-ember-soft disabled:opacity-40"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {links.length === 0 ? "Generate link" : "Generate another"}
        </button>
      </div>

      {links.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-line py-20 text-center">
          <Globe className="h-8 w-8 text-fog" />
          <p className="mt-4 font-display text-2xl">No online link yet.</p>
          <p className="mt-2 max-w-xs text-sm text-fog">
            Generate one and share it anywhere — customers can then order for pickup or delivery.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <QrCard
              key={l.id}
              title={l.label}
              subtitle="Pickup & delivery"
              token={l.token}
              active={l.active}
              busy={busyId === l.id}
              onToggle={(active) => patch(l.id, { active })}
              onRegenerate={() => patch(l.id, { regenerate: true })}
              onDelete={() => remove(l.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

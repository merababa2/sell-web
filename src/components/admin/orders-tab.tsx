"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bike,
  CalendarClock,
  ChefHat,
  Inbox,
  Phone,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import type { OrderDTO, OrderStatus } from "@/lib/types";
import { ORDER_STATUSES, STATUS_META } from "@/lib/types";
import { computeOrderStats, kwd, timeAgo } from "@/lib/format";

const NEXT: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  pending: { to: "preparing", label: "Start preparing" },
  preparing: { to: "ready", label: "Mark ready" },
  ready: { to: "completed", label: "Complete" },
};

export default function OrdersTab({
  orders,
  onChanged,
  token,
}: {
  orders: OrderDTO[];
  onChanged: () => Promise<void> | void;
  token: string;
}) {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const stats = useMemo(() => computeOrderStats(orders), [orders]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const s of ORDER_STATUSES) c[s] = orders.filter((o) => o.status === s).length;
    return c;
  }, [orders]);

  const visible = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  async function setStatus(id: string, status: OrderStatus) {
    if (busyId) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) await onChanged();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-7">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          { label: "Orders today", value: String(stats.today), icon: CalendarClock },
          { label: "Revenue today", value: kwd(stats.todayRevenueFils), icon: ChefHat },
          { label: "Pending", value: String(stats.pending), icon: Inbox },
          { label: "Preparing", value: String(stats.preparing), icon: UtensilsCrossed },
        ].map(({ label, value, icon: Icon }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-line bg-coal p-5"
          >
            <Icon className="h-4 w-4 text-ember" />
            <p className="mt-3 font-display text-2xl sm:text-3xl">{value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-fog">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition ${
              filter === s
                ? "border-ember bg-ember text-cream"
                : "border-line bg-coal text-fog hover:text-cream"
            }`}
          >
            {s} · {counts[s] ?? 0}
          </button>
        ))}
      </div>

      {/* Orders */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-line py-20 text-center">
          <Inbox className="h-8 w-8 text-fog" />
          <p className="mt-4 font-display text-2xl">No orders here yet.</p>
          <p className="mt-2 max-w-xs text-sm text-fog">
            Orders from table QR codes and the online link appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              busy={busyId === o.id}
              onStatus={(s) => setStatus(o.id, s)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order: o,
  busy,
  onStatus,
}: {
  order: OrderDTO;
  busy: boolean;
  onStatus: (s: OrderStatus) => void;
}) {
  const meta = STATUS_META[o.status];
  const next = NEXT[o.status];
  const TypeIcon =
    o.orderType === "delivery" ? Bike : o.orderType === "pickup" ? Store : UtensilsCrossed;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-3xl border bg-coal p-5 ${
        o.status === "pending" ? "border-ember/50" : "border-line"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <p className="font-display text-2xl font-semibold">{o.orderNumber}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-sand">
          <TypeIcon className="h-3 w-3 text-ember" />
          {o.orderType === "dine_in" ? o.tableName ?? "Dine-in" : o.orderType}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${meta.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
        <span className="ml-auto text-[11px] text-fog">{timeAgo(o.createdAt)}</span>
      </div>

      {(o.customerName || o.customerPhone) && (
        <p className="mt-3 flex items-center gap-2 text-sm text-sand">
          {o.customerName}
          {o.customerPhone && (
            <a
              href={`tel:${o.customerPhone}`}
              className="inline-flex items-center gap-1 text-fog transition hover:text-ember"
            >
              <Phone className="h-3 w-3" />
              {o.customerPhone}
            </a>
          )}
        </p>
      )}

      <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
        {o.items.map((it, i) => (
          <li key={i} className="flex justify-between gap-3">
            <span className="min-w-0 truncate text-cream/90">
              <span className="font-semibold text-ember">{it.qty}×</span> {it.name}
            </span>
            <span className="text-fog">{kwd(it.priceFils * it.qty)}</span>
          </li>
        ))}
      </ul>

      {o.notes && (
        <p className="mt-3 rounded-xl border border-gold/25 bg-gold/10 px-3.5 py-2.5 text-xs leading-relaxed text-gold">
          {o.notes}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-line pt-4">
        <p className="font-display text-xl text-ember">{kwd(o.totalFils)}</p>
        <div className="ml-auto flex items-center gap-2">
          {o.status !== "completed" && o.status !== "cancelled" && (
            <select
              value={o.status}
              disabled={busy}
              onChange={(e) => onStatus(e.target.value as OrderStatus)}
              className="rounded-full border border-line bg-ink px-3.5 py-2.5 text-[10px] uppercase tracking-[0.12em] text-sand"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
          )}
          {next && (
            <button
              onClick={() => onStatus(next.to)}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full bg-ember px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cream transition hover:bg-ember-soft disabled:opacity-50"
            >
              {next.label}
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

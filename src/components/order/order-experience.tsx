"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bike,
  CheckCircle2,
  Flame,
  Loader2,
  Minus,
  Plus,
  QrCode,
  ShoppingBag,
  Store,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import type { MenuItemDTO } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { filsToKwd, kwd, slugify } from "@/lib/format";

type Props = {
  token: string;
  mode: "table" | "online";
  contextName: string;
  items: MenuItemDTO[];
  openNow: boolean;
};

type Cart = Record<string, number>;

const CART_KEY = (token: string) => `otro-cart:${token}`;

export default function OrderExperience({
  token,
  mode,
  contextName,
  items,
  openNow,
}: Props) {
  const [cart, setCart] = useState<Cart>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ orderNumber: string; totalFils: number } | null>(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  /* Persist the tray per access token. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY(token));
      if (raw) setCart(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY(token), JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, token]);

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  const groups = useMemo(() => {
    const order: string[] = [
      ...CATEGORIES.filter((c) => items.some((i) => i.category === c)),
      ...[...new Set(items.map((i) => i.category))].filter(
        (c) => !(CATEGORIES as readonly string[]).includes(c),
      ),
    ];
    return order.map((cat) => ({
      cat,
      items: items.filter((i) => i.category === cat),
    }));
  }, [items]);

  const entries = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ item: byId.get(id), qty }))
        .filter((e): e is { item: MenuItemDTO; qty: number } => !!e.item && e.qty > 0),
    [cart, byId],
  );

  const count = entries.reduce((s, e) => s + e.qty, 0);
  const totalFils = entries.reduce((s, e) => s + e.qty * e.item.priceFils, 0);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      const q = (next[id] ?? 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });

  /* Lightweight scroll-spy for the category bar. */
  useEffect(() => {
    const onScroll = () => {
      let current: string | null = null;
      for (const g of groups) {
        const el = document.getElementById(`cat-${slugify(g.cat)}`);
        if (el && el.getBoundingClientRect().top <= 160) current = g.cat;
      }
      if (current) setActiveCat(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [groups]);

  const onlineInvalid =
    mode === "online" &&
    (name.trim().length < 2 ||
      phone.replace(/\D/g, "").length < 7 ||
      (orderType === "delivery" && address.trim().length < 5));

  async function submit() {
    if (busy || count === 0) return;
    if (onlineInvalid) {
      setError("Please complete your details below.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          orderType: mode === "table" ? "dine_in" : orderType,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          notes: [
            orderType === "delivery" && mode === "online"
              ? `Delivery to: ${address.trim()}`
              : "",
            notes.trim(),
          ]
            .filter(Boolean)
            .join(" · "),
          items: entries.map((e) => ({ id: e.item.id, qty: e.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setPlaced({ orderNumber: data.orderNumber, totalFils: data.totalFils });
      setCart({});
    } catch {
      setError("Network hiccup — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink pb-36 text-cream">
      {/* ── Header ── */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
            OTRO<span className="text-ember">.</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-coal px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-sand">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  openNow ? "bg-emerald-400 animate-pulse-dot" : "bg-red-400"
                }`}
              />
              {openNow ? "Open" : "Closed"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-ember px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-cream">
              {mode === "table" ? (
                <>
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  {contextName}
                </>
              ) : (
                <>
                  <QrCode className="h-3.5 w-3.5" />
                  Online
                </>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* ── Menu hero ── */}
      <div className="mx-auto max-w-3xl px-4 pt-28 sm:px-6">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-ember">
          <Flame className="h-3.5 w-3.5" />
          {mode === "table" ? `Ordering for ${contextName}` : "Pickup & delivery"}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4">
          <h1 className="font-display text-5xl font-semibold">The Menu</h1>
          <span dir="rtl" className="font-arabic text-2xl text-sand">
            القائمة
          </span>
        </div>
        {!openNow && (
          <p className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 px-4 py-3 text-xs leading-relaxed text-gold">
            The kitchen opens at 9:00 AM — orders placed now will be queued as
            pre-orders.
          </p>
        )}
      </div>

      {/* ── Category bar ── */}
      <nav className="sticky top-[60px] z-30 mt-8 border-y border-white/5 bg-ink/90 backdrop-blur-xl">
        <div className="no-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {groups.map((g) => (
            <a
              key={g.cat}
              href={`#cat-${slugify(g.cat)}`}
              onClick={() => setActiveCat(g.cat)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] transition ${
                (activeCat ?? groups[0]?.cat) === g.cat
                  ? "border-ember bg-ember text-cream"
                  : "border-line bg-coal text-fog hover:text-cream"
              }`}
            >
              {g.cat}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Items ── */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6">
        {groups.map((g) => (
          <section key={g.cat} id={`cat-${slugify(g.cat)}`} className="scroll-mt-32 pt-10">
            <h2 className="mb-5 flex items-baseline gap-3 font-display text-3xl">
              {g.cat}
              <span className="text-sm italic text-fog">({g.items.length})</span>
            </h2>
            <div className="space-y-3.5">
              {g.items.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  qty={cart[item.id] ?? 0}
                  onAdd={() => add(item.id)}
                  onDec={() => dec(item.id)}
                />
              ))}
            </div>
          </section>
        ))}

        <p className="mt-14 border-t border-line pt-6 text-center text-xs uppercase tracking-[0.25em] text-fog">
          OTRO · Sulaiyel, Al Jahra · Prices in KWD
        </p>
      </main>

      {/* ── Floating tray bar ── */}
      <AnimatePresence>
        {count > 0 && !sheetOpen && (
          <motion.button
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={() => setSheetOpen(true)}
            className="fixed inset-x-4 bottom-5 z-40 mx-auto flex max-w-md items-center justify-between rounded-full bg-ember px-6 py-4 text-cream shadow-2xl shadow-ember/30 transition-colors hover:bg-ember-soft"
          >
            <span className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.12em]">
              <ShoppingBag className="h-4.5 w-4.5" />
              View tray · {count}
            </span>
            <span className="font-display text-lg">{kwd(totalFils)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Checkout sheet ── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !busy && setSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90svh] w-full max-w-lg flex-col rounded-t-[2rem] border border-line border-b-0 bg-coal"
            >
              {placed ? (
                <SuccessPanel
                  placed={placed}
                  mode={mode}
                  contextName={contextName}
                  orderType={orderType}
                  phone={phone}
                  onMore={() => {
                    setPlaced(null);
                    setSheetOpen(false);
                  }}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-line px-6 py-5">
                    <h3 className="font-display text-2xl">Your tray</h3>
                    <button
                      onClick={() => setSheetOpen(false)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fog transition hover:text-cream"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                    {entries.length === 0 && (
                      <p className="py-10 text-center text-sm text-fog">
                        Your tray is empty — add something delicious.
                      </p>
                    )}
                    {entries.map(({ item, qty }) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-line bg-ink p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-fog">{kwd(item.priceFils)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dec(item.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-sand transition hover:border-ember hover:text-ember"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                          <button
                            onClick={() => add(item.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-ember text-cream transition hover:bg-ember-soft"
                            aria-label="Increase"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="w-20 text-right font-display text-sm">
                          {filsToKwd(item.priceFils * qty)}
                        </p>
                        <button
                          onClick={() => setCart((c) => {
                            const n = { ...c };
                            delete n[item.id];
                            return n;
                          })}
                          className="text-fog transition hover:text-red-400"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {entries.length > 0 && (
                      <>
                        {mode === "online" && (
                          <>
                            <div className="flex gap-2.5 pt-2">
                              {(
                                [
                                  { t: "pickup" as const, label: "Pickup", icon: Store },
                                  { t: "delivery" as const, label: "Delivery", icon: Bike },
                                ] as const
                              ).map(({ t, label, icon: Icon }) => (
                                <button
                                  key={t}
                                  onClick={() => setOrderType(t)}
                                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3.5 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                                    orderType === t
                                      ? "border-ember bg-ember text-cream"
                                      : "border-line bg-ink text-fog hover:text-cream"
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                  {label}
                                </button>
                              ))}
                            </div>
                            <input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name *"
                              className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-sm placeholder:text-fog/60 focus:border-ember/60"
                            />
                            <input
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Phone (e.g. 965 5000 0000) *"
                              inputMode="tel"
                              className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-sm placeholder:text-fog/60 focus:border-ember/60"
                            />
                            {orderType === "delivery" && (
                              <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Delivery address — block, street, area *"
                                className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-sm placeholder:text-fog/60 focus:border-ember/60"
                              />
                            )}
                          </>
                        )}
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={
                            mode === "table"
                              ? "Notes for the kitchen (allergies, spice level…)"
                              : "Any notes? (optional)"
                          }
                          rows={2}
                          className="w-full resize-none rounded-xl border border-line bg-ink px-4 py-3.5 text-sm placeholder:text-fog/60 focus:border-ember/60"
                        />
                        {error && (
                          <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-300">
                            {error}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {entries.length > 0 && (
                    <div className="border-t border-line px-6 py-5">
                      <div className="mb-4 flex items-center justify-between text-sm">
                        <span className="uppercase tracking-[0.2em] text-fog">Total</span>
                        <span className="font-display text-2xl text-ember">
                          {kwd(totalFils)}
                        </span>
                      </div>
                      <button
                        onClick={submit}
                        disabled={busy || onlineInvalid}
                        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-ember py-4 text-sm font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {busy ? (
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        ) : mode === "table" ? (
                          <UtensilsCrossed className="h-4.5 w-4.5" />
                        ) : (
                          <ShoppingBag className="h-4.5 w-4.5" />
                        )}
                        {mode === "table" ? "Send to kitchen" : "Place order"}
                      </button>
                      {onlineInvalid && (
                        <p className="mt-2.5 text-center text-[11px] text-fog">
                          Add your name, phone{orderType === "delivery" ? " and address" : ""} to
                          continue.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Single menu card ──────────────────────────────────────── */
function MenuCard({
  item,
  qty,
  onAdd,
  onDec,
}: {
  item: MenuItemDTO;
  qty: number;
  onAdd: () => void;
  onDec: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-4 rounded-3xl border border-line bg-coal p-3.5 ${
        item.available ? "" : "opacity-55"
      }`}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className={`h-full w-full object-cover ${item.available ? "" : "grayscale"}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-panel">
            <Flame className="h-5 w-5 text-fog" />
          </div>
        )}
        {item.popular && item.available && (
          <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ember backdrop-blur">
            <Flame className="h-2.5 w-2.5" />
            Popular
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 font-display text-lg leading-snug">{item.name}</h3>
          {item.nameAr && (
            <span dir="rtl" className="shrink-0 font-arabic text-sm text-sand">
              {item.nameAr}
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-fog">
          {item.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <span className="font-display text-base text-ember">
            {filsToKwd(item.priceFils)}
            <span className="ml-1 text-[10px] uppercase tracking-[0.15em] text-fog">KWD</span>
          </span>
          {item.available ? (
            qty === 0 ? (
              <button
                onClick={onAdd}
                className="flex items-center gap-1.5 rounded-full bg-ember px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cream transition hover:bg-ember-soft"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onDec}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sand transition hover:border-ember hover:text-ember"
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={onAdd}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-ember text-cream transition hover:bg-ember-soft"
                  aria-label="Increase"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          ) : (
            <span className="rounded-full border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-fog">
              Sold out
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ── Success state ─────────────────────────────────────────── */
function SuccessPanel({
  placed,
  mode,
  contextName,
  orderType,
  phone,
  onMore,
}: {
  placed: { orderNumber: string; totalFils: number };
  mode: "table" | "online";
  contextName: string;
  orderType: "pickup" | "delivery";
  phone: string;
  onMore: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 220, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-ember/15 text-ember"
      >
        <CheckCircle2 className="h-9 w-9" />
      </motion.span>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        <h3 className="mt-6 font-display text-3xl">Order received.</h3>
        <p className="mt-2 font-display text-5xl font-semibold tracking-tight text-ember">
          {placed.orderNumber}
        </p>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">
          {mode === "table" ? (
            <>
              It&apos;s on its way to the kitchen — we&apos;ll bring everything to{" "}
              <span className="text-cream">{contextName}</span>. Usually 15–25 minutes.
            </>
          ) : orderType === "pickup" ? (
            <>
              We&apos;re on it — show{" "}
              <span className="text-cream">{placed.orderNumber}</span> at the counter
              when you arrive. Usually ready in 20 minutes.
            </>
          ) : (
            <>
              We&apos;re on it — the rider will call you at{" "}
              <span className="text-cream">{phone}</span> when they&apos;re close.
            </>
          )}
        </p>
        <button
          onClick={onMore}
          className="mt-8 w-full rounded-full bg-ember py-4 text-sm font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-ember-soft"
        >
          Back to the menu
        </button>
      </motion.div>
    </div>
  );
}

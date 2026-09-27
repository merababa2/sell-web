"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpenText,
  ClipboardList,
  Flame,
  Globe,
  LogOut,
  QrCode,
} from "lucide-react";
import type {
  AccessLinkDTO,
  MenuItemDTO,
  OrderDTO,
  TableDTO,
} from "@/lib/types";
import OrdersTab from "@/components/admin/orders-tab";
import TablesTab from "@/components/admin/tables-tab";
import OnlineTab from "@/components/admin/online-tab";
import MenuTab from "@/components/admin/menu-tab";

type Tab = "orders" | "tables" | "online" | "menu";

type Props = {
  token: string;
  initialOrders: OrderDTO[];
  initialTables: TableDTO[];
  initialLinks: AccessLinkDTO[];
  initialMenu: MenuItemDTO[];
  onLogout?: () => void;
};

export default function AdminDashboard({
  token,
  initialOrders,
  initialTables,
  initialLinks,
  initialMenu,
  onLogout,
}: Props) {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<OrderDTO[]>(initialOrders);
  const [liveError, setLiveError] = useState(false);
  const pendingRef = useRef(initialOrders.filter((o) => o.status === "pending").length);

  // Use refs to break the useCallback/useEffect dependency loop
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const onLogoutRef = useRef(onLogout);
  onLogoutRef.current = onLogout;

  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${tokenRef.current}` },
        credentials: "include",
      });
      if (res.status === 401) {
        // Server-side logout: clear cookie and redirect
        await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
        window.location.href = "/admin";
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders);
      setLiveError(false);
    } catch {
      setLiveError(true);
    }
  }, []); // No dependencies — uses refs

  /* Live order feed. */
  useEffect(() => {
    refreshOrders();
    const t = setInterval(() => {
      if (!document.hidden) refreshOrders();
    }, 8000);
    return () => clearInterval(t);
  }, [refreshOrders]);

  const pending = orders.filter((o) => o.status === "pending").length;
  const newArrival = pending > pendingRef.current;
  useEffect(() => {
    pendingRef.current = pending;
  });

  const tabs: { id: Tab; label: string; icon: typeof ClipboardList; badge?: number }[] = [
    { id: "orders", label: "Orders", icon: ClipboardList, badge: pending || undefined },
    { id: "tables", label: "Tables & QR", icon: QrCode },
    { id: "online", label: "Online link", icon: Globe },
    { id: "menu", label: "Menu", icon: BookOpenText },
  ];

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl font-semibold">
              OTRO<span className="text-ember">.</span>
            </span>
            <span className="hidden rounded-full border border-line bg-coal px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-fog sm:inline-flex">
              Kitchen OS
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="hidden rounded-full border border-line px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-fog transition hover:text-cream sm:block"
            >
              View site
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
                window.location.href = "/admin";
              }}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-fog transition hover:border-red-400/50 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 pb-3 sm:px-6">
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 whitespace-nowrap rounded-full border px-4.5 py-2.5 text-xs uppercase tracking-[0.15em] transition ${
                tab === id
                  ? "border-ember bg-ember text-cream"
                  : "border-line bg-coal text-fog hover:text-cream"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {badge && tab !== "orders" ? (
                <span className="ml-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-bold text-cream">
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
          <span className="ml-auto hidden items-center gap-2 self-center text-[10px] uppercase tracking-[0.2em] text-fog md:flex">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                liveError ? "bg-red-400" : "bg-emerald-400 animate-pulse-dot"
              }`}
            />
            {liveError ? "Feed paused" : "Live"}
          </span>
        </nav>
      </header>

      {/* New order flash */}
      {newArrival && pending > 0 && (
        <div className="border-b border-ember/30 bg-ember/10 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ember">
          <Flame className="mr-2 inline h-3.5 w-3.5" />
          New order just landed
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {tab === "orders" && <OrdersTab orders={orders} onChanged={refreshOrders} token={token} />}
        {tab === "tables" && <TablesTab initialTables={initialTables} token={token} />}
        {tab === "online" && <OnlineTab initialLinks={initialLinks} token={token} />}
        {tab === "menu" && <MenuTab initialMenu={initialMenu} token={token} />}
      </main>
    </div>
  );
}

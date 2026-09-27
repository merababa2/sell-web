"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AccessLinkDTO,
  MenuItemDTO,
  OrderDTO,
  TableDTO,
} from "@/lib/types";
import AdminDashboard from "@/components/admin/dashboard";

export default function AdminShell({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [tables, setTables] = useState<TableDTO[]>([]);
  const [links, setLinks] = useState<AccessLinkDTO[]>([]);
  const [menu, setMenu] = useState<MenuItemDTO[]>([]);

  const tokenRef = useRef(token);
  tokenRef.current = token;
  const onLogoutRef = useRef(onLogout);
  onLogoutRef.current = onLogout;

  const loadAll = useCallback(async () => {
    const h: HeadersInit = { Authorization: `Bearer ${tokenRef.current}` };
    try {
      setLoading(true);
      const [ordersRes, tablesRes, linksRes, menuRes] = await Promise.all([
        fetch("/api/admin/orders", { headers: h }),
        fetch("/api/admin/tables", { headers: h }),
        fetch("/api/admin/access", { headers: h }),
        fetch("/api/admin/menu", { headers: h }),
      ]);

      if (
        ordersRes.status === 401 ||
        tablesRes.status === 401 ||
        linksRes.status === 401 ||
        menuRes.status === 401
      ) {
        onLogoutRef.current();
        return;
      }

      if (!ordersRes.ok || !tablesRes.ok || !linksRes.ok || !menuRes.ok) {
        throw new Error("Server is busy — tap Retry.");
      }

      const [ordersData, tablesData, linksData, menuData] = await Promise.all([
        ordersRes.json(),
        tablesRes.json(),
        linksRes.json(),
        menuRes.json(),
      ]);

      setOrders(ordersData.orders);
      setTables(tablesData.tables);
      setLinks(linksData.links);
      setMenu(menuData.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-cream">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-ember border-t-transparent" />
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-fog">
            Loading Kitchen OS...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-cream">
        <div className="text-center">
          <p className="text-2xl font-display text-ember">⚠</p>
          <p className="mt-4 text-sm text-fog">{error}</p>
          <button
            onClick={() => loadAll()}
            className="mt-4 rounded-full bg-ember px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      token={token}
      initialOrders={orders}
      initialTables={tables}
      initialLinks={links}
      initialMenu={menu}
      onLogout={onLogout}
    />
  );
}

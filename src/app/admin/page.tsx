"use client";

import { useEffect, useState } from "react";
import LoginPage from "@/components/admin/login-page";
import AdminShell from "@/components/admin/admin-shell";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // Try to pick up session from memory/storage on initial mount ONLY
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem("otro_admin_session");
      if (stored) {
        setToken(stored);
      }
    } catch {
      // Storage blocked (Iframe/Incognito)
    }
    setChecking(false);
  }, []);

  const handleLogin = (newToken: string) => {
    try {
      window.sessionStorage.setItem("otro_admin_session", newToken);
    } catch {
      // Storage blocked, that's fine. React state handles it.
    }
    setToken(newToken);
  };

  const handleLogout = () => {
    try {
      window.sessionStorage.removeItem("otro_admin_session");
    } catch {}
    
    // Call server to invalidate
    if (token) {
      fetch("/api/admin/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    
    setToken(null);
  };

  if (checking) return null;

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <AdminShell token={token} onLogout={handleLogout} />;
}

"use client";

import { useState, type FormEvent } from "react";
import { Flame, Loader2, Lock, User } from "lucide-react";

export default function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        setBusy(false);
        return;
      }

      // No page reload! Just pass the token to parent via React state.
      onLogin(data.token);

    } catch {
      setError("Network error — please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5 text-cream">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-ember/10 blur-[130px]"
        aria-hidden
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-5xl font-semibold tracking-tight">
            OTRO<span className="text-ember">.</span>
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-fog">
            Owner access only
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl border border-line bg-coal p-8 shadow-2xl shadow-black/60"
        >
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-ember/15 text-ember mx-auto">
            <Flame className="h-6 w-6" />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-fog">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="owner"
                required
                className="w-full rounded-xl border border-line bg-ink py-3.5 pl-11 pr-4 text-sm text-cream placeholder:text-fog/40 focus:border-ember/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-fog">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-line bg-ink py-3.5 pl-11 pr-4 text-sm text-cream placeholder:text-fog/40 focus:border-ember/60 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !username.trim() || !password}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-ember py-4 text-sm font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Flame className="h-4 w-4" />
            )}
            {busy ? "Logging in..." : "Enter Kitchen"}
          </button>

          <p className="mt-5 text-center text-[10px] leading-relaxed text-fog/60">
            Default: <span className="text-fog">owner</span> / <span className="text-fog">otro-owner-2025</span>
          </p>
        </form>
      </div>
    </div>
  );
}

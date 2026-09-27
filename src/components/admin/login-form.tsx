"use client";

import { useState, type FormEvent } from "react";
import { Flame, Loader2, Lock, User } from "lucide-react";

export default function LoginForm({
  onLogin,
}: {
  onLogin: (token: string) => void;
}) {
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
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        setBusy(false);
        return;
      }
      onLogin(data.token);
    } catch {
      setError("Network error — try again.");
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
          <p className="font-display text-4xl font-semibold">
            OTRO<span className="text-ember">.</span>
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-fog">
            Owner access only
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-[2rem] border border-line bg-coal p-7 shadow-2xl shadow-black/50"
        >
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-ember/15 text-ember">
            <Flame className="h-6 w-6" />
          </span>

          <label className="mb-4 block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-fog">
              Username
            </span>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="owner"
                className="w-full rounded-xl border border-line bg-ink py-3.5 pl-11 pr-4 text-sm placeholder:text-fog/50 focus:border-ember/60"
              />
            </div>
          </label>

          <label className="mb-5 block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-fog">
              Password
            </span>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-ink py-3.5 pl-11 pr-4 text-sm placeholder:text-fog/50 focus:border-ember/60"
              />
            </div>
          </label>

          {error && (
            <p className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !username || !password}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ember py-4 text-sm font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Enter kitchen
          </button>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-fog">
            Username: <span className="text-sand">owner</span> · Password:{" "}
            <span className="text-sand">otro-owner-2025</span>
          </p>
        </form>
      </div>
    </div>
  );
}

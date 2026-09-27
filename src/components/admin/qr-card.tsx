"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Power, Printer, RefreshCw, Trash2 } from "lucide-react";

export default function QrCard({
  title,
  subtitle,
  token,
  active,
  busy,
  onToggle,
  onRegenerate,
  onDelete,
}: {
  title: string;
  subtitle?: string;
  token: string;
  active: boolean;
  busy: boolean;
  onToggle: (active: boolean) => void;
  onRegenerate: () => void;
  onDelete: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const full = `${window.location.origin}/order/${token}`;
    setUrl(full);
    let cancelled = false;
    import("qrcode")
      .then((QRCode) =>
        QRCode.toDataURL(full, {
          margin: 1,
          width: 320,
          color: { dark: "#0b0a08", light: "#f2eadd" },
        }),
      )
      .then((data) => {
        if (!cancelled) setQr(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function printCard() {
    if (!url) return;
    try {
      const QRCode = await import("qrcode");
      const qrPrint = await QRCode.toDataURL(url, { margin: 1, width: 600 });
      const win = window.open("", "_blank", "width=440,height=680");
      if (!win) return;
      win.document.write(`<!doctype html><html><head><title>OTRO — ${title}</title>
        <style>
          body{font-family:Georgia,serif;text-align:center;padding:48px 32px;color:#111}
          h1{font-size:44px;margin:0}
          h1 span{color:#e4572e}
          h2{font-size:26px;font-weight:normal;margin:10px 0 26px}
          img{width:320px;height:320px;border:1px solid #ddd;border-radius:16px;padding:10px}
          p{font-family:Helvetica,Arial,sans-serif;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#666}
          .url{font-size:10px;letter-spacing:0;word-break:break-all;text-transform:none;color:#999;margin-top:14px}
        </style></head><body>
        <h1>OTRO<span>.</span></h1>
        <h2>${title}</h2>
        <img src="${qrPrint}" alt="QR code"/>
        <p>Scan to view the menu &amp; order</p>
        <p class="url">${url}</p>
        <script>window.onload=function(){setTimeout(function(){window.print()},250)}</script>
        </body></html>`);
      win.document.close();
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-coal p-5 transition ${
        active ? "border-line" : "border-line opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-2xl">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-fog">{subtitle}</p>}
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${
            active
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-red-400/30 bg-red-400/10 text-red-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-red-400"}`}
          />
          {active ? "Live" : "Off"}
        </span>
      </div>

      <div className="relative mx-auto mt-5 w-fit rounded-2xl bg-cream p-2.5">
        {qr ? (
          <img src={qr} alt={`QR for ${title}`} className="h-44 w-44 rounded-xl" />
        ) : (
          <div className="h-44 w-44 animate-pulse rounded-xl bg-sand/40" />
        )}
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ink/70">
            <span className="rounded-full border border-cream/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream">
              Disabled
            </span>
          </div>
        )}
      </div>

      <p className="mt-4 truncate text-center text-[11px] text-fog">{url ?? "…"}</p>

      <div className="mt-4 grid grid-cols-5 gap-1.5">
        <button
          onClick={copy}
          title="Copy link"
          className="flex items-center justify-center rounded-xl border border-line py-2.5 text-fog transition hover:border-ember hover:text-ember"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
        <button
          onClick={printCard}
          title="Print table card"
          className="flex items-center justify-center rounded-xl border border-line py-2.5 text-fog transition hover:border-ember hover:text-ember"
        >
          <Printer className="h-4 w-4" />
        </button>
        <button
          onClick={() => onToggle(!active)}
          disabled={busy}
          title={active ? "Disable" : "Enable"}
          className={`flex items-center justify-center rounded-xl border py-2.5 transition disabled:opacity-50 ${
            active
              ? "border-line text-fog hover:border-red-400/60 hover:text-red-300"
              : "border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
          }`}
        >
          <Power className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Rotate the QR for “${title}”? The old code stops working immediately.`))
              onRegenerate();
          }}
          disabled={busy}
          title="Rotate QR code"
          className="flex items-center justify-center rounded-xl border border-line py-2.5 text-fog transition hover:border-gold/60 hover:text-gold disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Delete “${title}” permanently?`)) onDelete();
          }}
          disabled={busy}
          title="Delete"
          className="flex items-center justify-center rounded-xl border border-line py-2.5 text-fog transition hover:border-red-400/60 hover:text-red-300 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

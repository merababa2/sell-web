/** Kuwaiti dinar has 3 decimal places — we store prices in fils (1 KWD = 1000 fils). */
export function filsToKwd(fils: number): string {
  const sign = fils < 0 ? "-" : "";
  const abs = Math.abs(Math.round(fils));
  const k = Math.floor(abs / 1000);
  const f = String(abs % 1000).padStart(3, "0");
  return `${sign}${k}.${f}`;
}

export function kwd(fils: number): string {
  return `KWD ${filsToKwd(fils)}`;
}

/** Restaurant hours: daily 9:00 – 23:00 Asia/Kuwait (UTC+3). */
export function isOpenNowKuwait(date = new Date()): boolean {
  const h = (date.getUTCHours() + 3) % 24;
  return h >= 9 && h < 23;
}

export function kuwaitTodayKey(date = new Date()): string {
  const shifted = new Date(date.getTime() + 3 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Dashboard counters for the admin panel. */
export function computeOrderStats(
  orders: { totalFils: number; status: string; createdAt: string }[],
): { today: number; todayRevenueFils: number; pending: number; preparing: number } {
  const key = kuwaitTodayKey();
  let today = 0;
  let todayRevenueFils = 0;
  let pending = 0;
  let preparing = 0;
  for (const o of orders) {
    if (kuwaitTodayKey(new Date(o.createdAt)) === key) {
      today += 1;
      if (o.status !== "cancelled") todayRevenueFils += o.totalFils;
    }
    if (o.status === "pending") pending += 1;
    if (o.status === "preparing") preparing += 1;
  }
  return { today, todayRevenueFils, pending, preparing };
}

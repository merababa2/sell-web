import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "@/db";
import { adminSessions } from "@/db/schema";

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const ADMIN_COOKIE = "otro_sid";

export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? "owner";
  const p = process.env.ADMIN_PASSWORD ?? "otro-owner-2025";
  return username.trim() === u && password === p;
}

export async function createSession(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await db.insert(adminSessions).values({
    token,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });
  return token;
}

export async function getSessionFromCookie(): Promise<string | null> {
  try {
    const store = await cookies();
    return store.get(ADMIN_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const rows = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.token, token))
      .limit(1);
    const s = rows[0];
    if (!s) return false;
    if (s.expiresAt.getTime() < Date.now()) {
      await db.delete(adminSessions).where(eq(adminSessions.token, token));
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  // Only check headers, no cookies!
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const auth = h.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      return validateToken(auth.slice(7).trim());
    }
    const xtoken = h.get("x-admin-token");
    if (xtoken) return validateToken(xtoken.trim());
  } catch {
    // headers() not available in this context
  }

  return false;
}

export async function destroySession(token: string): Promise<void> {
  await db.delete(adminSessions).where(eq(adminSessions.token, token)).catch(() => undefined);
}

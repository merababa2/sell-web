import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    // Bootstrap schema + seed data on first boot
    await ensureSeed();
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Health check failed:", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}

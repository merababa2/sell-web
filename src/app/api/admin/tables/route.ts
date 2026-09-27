import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { restaurantTables } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { tableToDTO } from "@/lib/serializers";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSeed();
  const rows = await db
    .select()
    .from(restaurantTables)
    .orderBy(asc(restaurantTables.createdAt));
  return NextResponse.json({ tables: rows.map(tableToDTO) });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (name.length < 1 || name.length > 60) {
    return NextResponse.json({ error: "Enter a table name." }, { status: 400 });
  }
  const inserted = await db
    .insert(restaurantTables)
    .values({ name, token: randomUUID() })
    .returning();
  return NextResponse.json({ ok: true, table: tableToDTO(inserted[0]) });
}

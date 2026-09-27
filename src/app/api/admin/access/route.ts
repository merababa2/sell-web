import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { accessLinks } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { linkToDTO } from "@/lib/serializers";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSeed();
  const rows = await db
    .select()
    .from(accessLinks)
    .orderBy(asc(accessLinks.createdAt));
  return NextResponse.json({ links: rows.map(linkToDTO) });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const label =
    typeof body?.label === "string" && body.label.trim()
      ? body.label.trim().slice(0, 80)
      : "Online Ordering — Pickup & Delivery";
  const inserted = await db
    .insert(accessLinks)
    .values({ label, token: randomUUID() })
    .returning();
  return NextResponse.json({ ok: true, link: linkToDTO(inserted[0]) });
}

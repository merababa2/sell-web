import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { menuItemToDTO } from "@/lib/serializers";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSeed();
  const rows = await db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.sortOrder), asc(menuItems.createdAt));
  return NextResponse.json({ items: rows.map(menuItemToDTO) });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const category = typeof body?.category === "string" ? body.category.trim() : "";
  const price = Number(body?.priceKwd);
  if (name.length < 2) {
    return NextResponse.json({ error: "Dish name is required." }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ error: "Pick a category." }, { status: 400 });
  }
  if (!Number.isFinite(price) || price < 0 || price > 999) {
    return NextResponse.json({ error: "Invalid price." }, { status: 400 });
  }
  const inserted = await db
    .insert(menuItems)
    .values({
      name,
      nameAr: typeof body?.nameAr === "string" ? body.nameAr.trim() || null : null,
      description: typeof body?.description === "string" ? body.description.trim() : "",
      category,
      priceFils: Math.round(price * 1000),
      imageUrl: typeof body?.imageUrl === "string" ? body.imageUrl.trim() || null : null,
      available: body?.available !== false,
      popular: body?.popular === true,
      sortOrder: 500,
    })
    .returning();
  return NextResponse.json({ ok: true, item: menuItemToDTO(inserted[0]) });
}

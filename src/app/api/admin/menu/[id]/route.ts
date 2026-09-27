import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { menuItemToDTO } from "@/lib/serializers";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  const patch: Partial<{
    name: string;
    nameAr: string | null;
    description: string;
    category: string;
    priceFils: number;
    imageUrl: string | null;
    available: boolean;
    popular: boolean;
    sortOrder: number;
  }> = {};

  if (typeof body?.name === "string" && body.name.trim().length >= 2) {
    patch.name = body.name.trim();
  }
  if (typeof body?.nameAr === "string") patch.nameAr = body.nameAr.trim() || null;
  if (typeof body?.description === "string") patch.description = body.description.trim();
  if (typeof body?.category === "string" && body.category.trim()) {
    patch.category = body.category.trim();
  }
  if (body?.priceKwd !== undefined) {
    const price = Number(body.priceKwd);
    if (!Number.isFinite(price) || price < 0 || price > 999) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }
    patch.priceFils = Math.round(price * 1000);
  }
  if (typeof body?.imageUrl === "string") patch.imageUrl = body.imageUrl.trim() || null;
  if (typeof body?.available === "boolean") patch.available = body.available;
  if (typeof body?.popular === "boolean") patch.popular = body.popular;
  if (typeof body?.sortOrder === "number") patch.sortOrder = Math.round(body.sortOrder);

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  const updated = await db
    .update(menuItems)
    .set(patch)
    .where(eq(menuItems.id, id))
    .returning();
  if (!updated[0]) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, item: menuItemToDTO(updated[0]) });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.delete(menuItems).where(eq(menuItems.id, id));
  return NextResponse.json({ ok: true });
}

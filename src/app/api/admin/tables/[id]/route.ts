import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { restaurantTables } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { tableToDTO } from "@/lib/serializers";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const patch: { name?: string; active?: boolean; token?: string } = {};
  if (typeof body?.name === "string" && body.name.trim()) {
    patch.name = body.name.trim().slice(0, 60);
  }
  if (typeof body?.active === "boolean") patch.active = body.active;
  if (body?.regenerate === true) patch.token = randomUUID();
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  const updated = await db
    .update(restaurantTables)
    .set(patch)
    .where(eq(restaurantTables.id, id))
    .returning();
  if (!updated[0]) {
    return NextResponse.json({ error: "Table not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, table: tableToDTO(updated[0]) });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.delete(restaurantTables).where(eq(restaurantTables.id, id));
  return NextResponse.json({ ok: true });
}

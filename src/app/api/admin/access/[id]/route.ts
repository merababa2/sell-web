import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { accessLinks } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { linkToDTO } from "@/lib/serializers";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const patch: { label?: string; active?: boolean; token?: string } = {};
  if (typeof body?.label === "string" && body.label.trim()) {
    patch.label = body.label.trim().slice(0, 80);
  }
  if (typeof body?.active === "boolean") patch.active = body.active;
  if (body?.regenerate === true) patch.token = randomUUID();
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  const updated = await db
    .update(accessLinks)
    .set(patch)
    .where(eq(accessLinks.id, id))
    .returning();
  if (!updated[0]) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, link: linkToDTO(updated[0]) });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.delete(accessLinks).where(eq(accessLinks.id, id));
  return NextResponse.json({ ok: true });
}

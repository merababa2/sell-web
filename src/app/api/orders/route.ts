import { NextResponse } from "next/server";
import { count, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  accessLinks,
  menuItems,
  orders,
  restaurantTables,
  type StoredOrderItem,
} from "@/db/schema";
import { ensureSeed } from "@/lib/seed";

type IncomingLine = { id?: unknown; qty?: unknown };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const orderType = typeof body.orderType === "string" ? body.orderType : "";
  const lines: IncomingLine[] = Array.isArray(body.items) ? body.items : [];
  const customerName =
    typeof body.customerName === "string" ? body.customerName.trim() : "";
  const customerPhone =
    typeof body.customerPhone === "string" ? body.customerPhone.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 500) : "";

  if (!token) {
    return NextResponse.json({ error: "Missing access token." }, { status: 400 });
  }
  if (lines.length === 0) {
    return NextResponse.json({ error: "Your order is empty." }, { status: 400 });
  }
  if (lines.length > 40) {
    return NextResponse.json({ error: "Too many line items." }, { status: 400 });
  }

  await ensureSeed();

  // --- Resolve the access token: table QR or online link -------------------
  let source: "dine_in" | "online";
  let tableName: string | null = null;
  let finalType: "dine_in" | "pickup" | "delivery";

  const tableRows = await db
    .select()
    .from(restaurantTables)
    .where(eq(restaurantTables.token, token))
    .limit(1);

  if (tableRows[0] && tableRows[0].active) {
    source = "dine_in";
    tableName = tableRows[0].name;
    finalType = "dine_in";
  } else {
    const linkRows = await db
      .select()
      .from(accessLinks)
      .where(eq(accessLinks.token, token))
      .limit(1);
    if (linkRows[0] && linkRows[0].active) {
      source = "online";
      if (orderType !== "pickup" && orderType !== "delivery") {
        return NextResponse.json(
          { error: "Choose pickup or delivery." },
          { status: 400 },
        );
      }
      if (customerName.length < 2) {
        return NextResponse.json(
          { error: "Please tell us your name." },
          { status: 400 },
        );
      }
      if (customerPhone.replace(/\D/g, "").length < 7) {
        return NextResponse.json(
          { error: "Please provide a valid phone number." },
          { status: 400 },
        );
      }
      finalType = orderType;
    } else {
      return NextResponse.json(
        { error: "This ordering link is no longer active." },
        { status: 403 },
      );
    }
  }

  // --- Build the order from server-side prices -----------------------------
  const ids = [...new Set(lines.map((l) => String(l.id ?? "")))].filter(Boolean);
  const rows = await db
    .select()
    .from(menuItems)
    .where(inArray(menuItems.id, ids));
  const byId = new Map(rows.map((r) => [r.id, r]));

  const items: StoredOrderItem[] = [];
  let totalFils = 0;
  for (const line of lines) {
    const id = String(line.id ?? "");
    const row = byId.get(id);
    if (!row || !row.available) {
      return NextResponse.json(
        { error: `“${row?.name ?? "An item"}” is currently unavailable.` },
        { status: 400 },
      );
    }
    const qty = Math.min(30, Math.max(1, Math.floor(Number(line.qty) || 0)));
    items.push({
      id: row.id,
      name: row.name,
      nameAr: row.nameAr,
      qty,
      priceFils: row.priceFils,
    });
    totalFils += row.priceFils * qty;
  }

  // --- Sequential, human-friendly order number ------------------------------
  const total = await db.select({ value: count() }).from(orders);
  const seq = total[0].value + 1;
  const orderNumber = `OT-${String(seq).padStart(4, "0")}`;

  const inserted = await db
    .insert(orders)
    .values({
      orderNumber,
      source,
      orderType: finalType,
      tableName,
      customerName: customerName || null,
      customerPhone: customerPhone || null,
      notes: notes || null,
      items,
      totalFils,
      status: "pending",
    })
    .returning({ id: orders.id });

  return NextResponse.json({
    ok: true,
    orderId: inserted[0]?.id,
    orderNumber,
    totalFils,
  });
}

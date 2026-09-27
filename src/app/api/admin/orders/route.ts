import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { kuwaitTodayKey } from "@/lib/format";
import { orderToDTO } from "@/lib/serializers";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSeed();
  const rows = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(150);

  const todayKey = kuwaitTodayKey();
  let today = 0;
  let todayRevenueFils = 0;
  let pending = 0;
  let preparing = 0;
  for (const row of rows) {
    const key = kuwaitTodayKey(row.createdAt);
    if (key === todayKey) {
      today += 1;
      if (row.status !== "cancelled") todayRevenueFils += row.totalFils;
    }
    if (row.status === "pending") pending += 1;
    if (row.status === "preparing") preparing += 1;
  }

  return NextResponse.json({
    orders: rows.map(orderToDTO),
    stats: { today, todayRevenueFils, pending, preparing },
  });
}

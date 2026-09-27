import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { accessLinks, menuItems, restaurantTables } from "@/db/schema";
import { ensureSeed } from "@/lib/seed";
import { isOpenNowKuwait } from "@/lib/format";
import { menuItemToDTO } from "@/lib/serializers";
import OrderExperience from "@/components/order/order-experience";
import LockedOrder from "@/components/order/locked";

export const dynamic = "force-dynamic";

type AccessContext =
  | { mode: "table"; name: string }
  | { mode: "online"; name: string }
  | null;

async function resolveAccess(token: string): Promise<AccessContext> {
  const table = await db
    .select()
    .from(restaurantTables)
    .where(eq(restaurantTables.token, token))
    .limit(1);
  if (table[0]) {
    return table[0].active ? { mode: "table", name: table[0].name } : null;
  }
  const link = await db
    .select()
    .from(accessLinks)
    .where(eq(accessLinks.token, token))
    .limit(1);
  if (link[0]) {
    return link[0].active ? { mode: "online", name: link[0].label } : null;
  }
  return null;
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  await ensureSeed();

  const access = await resolveAccess(token);
  if (!access) return <LockedOrder />;

  const rows = await db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.sortOrder), asc(menuItems.createdAt));

  return (
    <OrderExperience
      token={token}
      mode={access.mode}
      contextName={access.name}
      items={rows.map(menuItemToDTO)}
      openNow={isOpenNowKuwait()}
    />
  );
}

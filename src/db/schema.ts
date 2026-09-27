import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export type StoredOrderItem = {
  id: string;
  name: string;
  nameAr: string | null;
  qty: number;
  priceFils: number;
};

/** Menu items managed by the owner from the admin panel. */
export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("Mains"),
  priceFils: integer("price_fils").notNull().default(0),
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true),
  popular: boolean("popular").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Physical restaurant tables. Each table owns a QR token. */
export const restaurantTables = pgTable("restaurant_tables", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  token: text("token").notNull().unique(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Shareable online ordering links (pickup / delivery). */
export const accessLinks = pgTable("access_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull().default("Online Ordering"),
  token: text("token").notNull().unique(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Customer orders placed through table QR or online links. */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  source: text("source").notNull().default("dine_in"), // dine_in | online
  orderType: text("order_type").notNull().default("dine_in"), // dine_in | pickup | delivery
  tableName: text("table_name"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  notes: text("notes"),
  items: jsonb("items").$type<StoredOrderItem[]>().notNull(),
  totalFils: integer("total_fils").notNull().default(0),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Owner sessions for the admin panel. */
export const adminSessions = pgTable("admin_sessions", {
  token: text("token").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type MenuItemRow = typeof menuItems.$inferSelect;
export type TableRow = typeof restaurantTables.$inferSelect;
export type AccessLinkRow = typeof accessLinks.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;

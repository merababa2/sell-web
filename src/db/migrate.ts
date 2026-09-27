/**
 * Runs raw CREATE TABLE IF NOT EXISTS for every table so the app
 * never crashes due to a missing schema even in a fresh deployment.
 */
import { pool } from "@/db";

const globalForMigrate = globalThis as unknown as { __ranMigration?: boolean };

export async function ensureSchema(): Promise<void> {
  if (globalForMigrate.__ranMigration) return;
  globalForMigrate.__ranMigration = true;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        TEXT NOT NULL,
        name_ar     TEXT,
        description TEXT NOT NULL DEFAULT '',
        category    TEXT NOT NULL DEFAULT 'Mains',
        price_fils  INTEGER NOT NULL DEFAULT 0,
        image_url   TEXT,
        available   BOOLEAN NOT NULL DEFAULT TRUE,
        popular     BOOLEAN NOT NULL DEFAULT FALSE,
        sort_order  INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS restaurant_tables (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name       TEXT NOT NULL,
        token      TEXT NOT NULL UNIQUE,
        active     BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS access_links (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        label      TEXT NOT NULL DEFAULT 'Online Ordering',
        token      TEXT NOT NULL UNIQUE,
        active     BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_number    TEXT NOT NULL UNIQUE,
        source          TEXT NOT NULL DEFAULT 'dine_in',
        order_type      TEXT NOT NULL DEFAULT 'dine_in',
        table_name      TEXT,
        customer_name   TEXT,
        customer_phone  TEXT,
        notes           TEXT,
        items           JSONB NOT NULL DEFAULT '[]',
        total_fils      INTEGER NOT NULL DEFAULT 0,
        status          TEXT NOT NULL DEFAULT 'pending',
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS admin_sessions (
        token      TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ NOT NULL
      );
    `);
  } finally {
    client.release();
  }
}

/**
 * Unified data layer entry point
 *
 * Exports two interfaces:
 *
 * 1. `db` (sync) — direct in-memory store access. Used by existing routes
 *    that haven't been migrated to async Supabase-ready pattern yet.
 *
 * 2. `dal` (async) — dual-mode Data Access Layer. When Supabase is
 *    enabled and credentials are configured, reads/writes go to Supabase
 *    Cloud. Otherwise falls back to the in-memory store.
 *
 * Migration path for API routes:
 *   OLD:  import { db } from "@/lib/db/store"     // sync, in-memory only
 *   NEW:  import { dal } from "@/lib/db"           // async, Supabase-ready
 *         const staff = await dal.staff.findAll()
 */

// Sync in-memory store (legacy — gradually replace with `dal`)
export { db } from "./store";

// Async dual-mode DAL (Supabase-ready)
export { dal, genericTable } from "./dal";

/**
 * Returns the home_id string for in-memory store operations.
 * In production, resolved from the authenticated session.
 * During in-memory mode, returns the seed home_id.
 */
export function getHomeId(): string {
  return process.env.SEED_HOME_ID ?? "home_oak";
}

/**
 * Returns the home UUID for Supabase queries.
 * This is the fixed UUID used in migration 004.
 */
export function getSupabaseHomeId(): string {
  return process.env.SUPABASE_HOME_ID ?? "a0000000-0000-0000-0000-000000000001";
}

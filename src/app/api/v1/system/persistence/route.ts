// ══════════════════════════════════════════════════════════════════════════════
// CARA — PERSISTENCE STATUS API  (GET /api/v1/system/persistence)
//
// Reports the data-durability mode honestly: env presence as booleans only
// (never values), a live table probe when Supabase is enabled, and the
// write-through coverage manifest.
// ══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { isSupabaseEnabled, createServerClient } from "@/lib/supabase/server";
import { PERSISTENCE_MANIFEST, persistenceSummary } from "@/lib/persistence-manifest";

export const dynamic = "force-dynamic";

const PROBE_TABLES = ["daily_logs", "tasks", "cara_studio_outputs", "audit_logs"] as const;

export async function GET() {
  const enabled = isSupabaseEnabled();
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("YOUR_"),
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("YOUR_"),
    NEXT_PUBLIC_SUPABASE_ENABLED: process.env.NEXT_PUBLIC_SUPABASE_ENABLED === "true",
  };

  let probe: { table: string; ok: boolean; rows: number | null; error: string | null }[] = [];
  if (enabled) {
    const c = createServerClient();
    if (c) {
      probe = await Promise.all(
        PROBE_TABLES.map(async (table) => {
          try {
            const { count, error } = await c.from(table).select("*", { count: "exact", head: true });
            return { table, ok: !error, rows: count ?? 0, error: error?.message?.slice(0, 80) ?? null };
          } catch (e) {
            return { table, ok: false, rows: null, error: e instanceof Error ? e.message.slice(0, 80) : "probe failed" };
          }
        }),
      );
    }
  }

  return NextResponse.json({
    data: {
      mode: enabled ? "durable" : "demo",
      enabled,
      env,
      probe,
      summary: persistenceSummary(),
      manifest: PERSISTENCE_MANIFEST,
      demo_note: enabled
        ? null
        : "Demo mode: records live in a seeded in-memory store and reset on redeploy or instance recycle. Set the Supabase environment variables and run the migrations to make changes durable — see the runbook on this page.",
    },
  });
}

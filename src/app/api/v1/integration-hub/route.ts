// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — INTEGRATION HUB API ROUTE
// GET /api/v1/integration-hub
//
// Returns the integration adapter registry: status of each typed adapter (rota,
// payroll, HR/training, calendar, notifications, document storage, external forms,
// LA reporting) plus the framework guarantees (secure credentials, retry handling,
// error logging, idempotency keys, sync status, audit trail, manual override).
//
// NO real external calls are made — this is the adapter framework SCAFFOLD. The
// demo store has no live integrations registry, so we map any optional
// `store.integrations` defensively and otherwise compute the static default
// registry via computeIntegrationHub({}).
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeIntegrationHub,
  type IntegrationAdapter,
  type AdapterKind,
  type AdapterStatus,
} from "@/lib/integration-hub/integration-hub-engine";

const d = (v: unknown): string | null => (v == null ? null : v.toString());

export async function GET() {
  const store = getStore() as any;

  const integrations = (store.integrations ?? []) as any[];

  // No live registry in the demo store → fall back to the static default scaffold
  // by calling the engine with no adapters supplied.
  if (integrations.length === 0) {
    const result = computeIntegrationHub({});
    return NextResponse.json({ data: result });
  }

  const adapters: IntegrationAdapter[] = integrations.map((x: any) => ({
    id: x.id,
    name: x.name ?? x.id,
    kind: (x.kind ?? "external_forms") as AdapterKind,
    status: (x.status ?? "not_configured") as AdapterStatus,
    last_sync: d(x.last_sync),
    supports_idempotency: x.supports_idempotency ?? true,
    retry: {
      max_attempts: Number(x.retry?.max_attempts ?? 3),
      backoff_seconds: Number(x.retry?.backoff_seconds ?? 30),
    },
    error_log: ((x.error_log ?? []) as any[]).map((e: any) => ({
      at: d(e.at) ?? "",
      message: e.message ?? "",
    })),
    sync_status: x.sync_status ?? "Not configured",
    manual_override: x.manual_override ?? false,
  }));

  const result = computeIntegrationHub({ adapters });

  return NextResponse.json({ data: result });
}

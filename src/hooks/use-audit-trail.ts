"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — audit trail (change history) hook
//
// Reads the field-level before→after trail captured by the audit recorder.
// Manager-gated server-side (VIEW_CARA_AUDIT_TRAIL).
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import type { AuditTrailEntry } from "@/lib/audit/audit-recorder";

export interface AuditTrailData {
  entries: AuditTrailEntry[];
  count: number;
  durable_persistence: boolean;
}

export interface AuditTrailFilters {
  entityType?: string;
  entityId?: string;
  limit?: number;
}

export function useAuditTrail(filters: AuditTrailFilters = {}) {
  const params = new URLSearchParams();
  if (filters.entityType) params.set("entityType", filters.entityType);
  if (filters.entityId) params.set("entityId", filters.entityId);
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["audit-trail", filters],
    queryFn: async () => {
      const res = await fetch(`/api/v1/audit-trail${qs ? `?${qs}` : ""}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
      return json.data as AuditTrailData;
    },
  });
}

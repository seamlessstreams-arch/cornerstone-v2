"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — COMPLAINTS ↔ INCIDENT CORRELATION HOOK
// React Query wrapper for /api/v1/complaints-incident-correlation
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { ComplaintsIncidentCorrelationResult } from "@/lib/complaints-incident-correlation/complaints-incident-correlation-engine";

interface ComplaintsIncidentCorrelationResponse {
  data: ComplaintsIncidentCorrelationResult;
}

export function useComplaintsIncidentCorrelation() {
  return useQuery({
    queryKey: ["complaints-incident-correlation"],
    queryFn: () =>
      api.get<ComplaintsIncidentCorrelationResponse>("/complaints-incident-correlation"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

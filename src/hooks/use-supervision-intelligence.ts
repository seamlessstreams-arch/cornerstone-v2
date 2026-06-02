"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SUPERVISION INTELLIGENCE HOOK
// React Query wrapper for /api/v1/supervision-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { SupervisionIntelligenceResult } from "@/lib/engines/supervision-intelligence-engine";

interface SupervisionIntelligenceResponse {
  data: SupervisionIntelligenceResult;
}

export function useSupervisionIntelligence() {
  return useQuery({
    queryKey: ["supervision-intelligence"],
    queryFn: () => api.get<SupervisionIntelligenceResponse>("/supervision-intelligence"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

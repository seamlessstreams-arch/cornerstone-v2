"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MULTI-AGENCY WORKING INTELLIGENCE HOOK
// React Query wrapper for /api/v1/multi-agency-intelligence
// ═════════════���════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { MultiAgencyIntelligenceResult } from "@/lib/engines/multi-agency-intelligence-engine";

interface MultiAgencyIntelligenceResponse {
  data: MultiAgencyIntelligenceResult;
}

export function useMultiAgencyIntelligence() {
  return useQuery({
    queryKey: ["multi-agency-intelligence"],
    queryFn: () => api.get<MultiAgencyIntelligenceResponse>("/multi-agency-intelligence"),
    refetchInterval: 60_000,
  });
}

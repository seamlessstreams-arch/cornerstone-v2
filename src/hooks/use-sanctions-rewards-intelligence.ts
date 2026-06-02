"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SANCTIONS & REWARDS INTELLIGENCE HOOK
// React Query wrapper for /api/v1/sanctions-rewards-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { SanctionsRewardsIntelligenceResult } from "@/lib/engines/sanctions-rewards-intelligence-engine";

interface SanctionsRewardsIntelligenceResponse {
  data: SanctionsRewardsIntelligenceResult;
}

export function useSanctionsRewardsIntelligence() {
  return useQuery({
    queryKey: ["sanctions-rewards-intelligence"],
    queryFn: () => api.get<SanctionsRewardsIntelligenceResponse>("/sanctions-rewards-intelligence"),
    refetchInterval: 60_000,
  });
}

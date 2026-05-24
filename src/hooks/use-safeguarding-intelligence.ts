"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SAFEGUARDING INTELLIGENCE HOOK
// React Query wrapper for /api/v1/safeguarding-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { SafeguardingIntelligenceResult } from "@/lib/engines/safeguarding-intelligence-engine";

interface SafeguardingIntelligenceResponse {
  data: SafeguardingIntelligenceResult;
}

export function useSafeguardingIntelligence() {
  return useQuery({
    queryKey: ["safeguarding-intelligence"],
    queryFn: () => api.get<SafeguardingIntelligenceResponse>("/safeguarding-intelligence"),
    refetchInterval: 30_000, // 30 second refresh (safeguarding data is critical)
  });
}

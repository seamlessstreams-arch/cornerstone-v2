"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — CONTEXTUAL SAFEGUARDING INTELLIGENCE HOOK
// React Query wrapper for /api/v1/contextual-safeguarding-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { ContextualSafeguardingIntelligenceResult } from "@/lib/engines/contextual-safeguarding-intelligence-engine";

interface ContextualSafeguardingIntelligenceResponse {
  data: ContextualSafeguardingIntelligenceResult;
}

export function useContextualSafeguardingIntelligence() {
  return useQuery({
    queryKey: ["contextual-safeguarding-intelligence"],
    queryFn: () => api.get<ContextualSafeguardingIntelligenceResponse>("/contextual-safeguarding-intelligence"),
    refetchInterval: 60_000,
  });
}

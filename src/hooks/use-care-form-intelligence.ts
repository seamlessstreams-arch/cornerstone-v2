"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CARE FORM INTELLIGENCE HOOK
// React Query wrapper for /api/v1/care-form-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { CareFormIntelligenceResult } from "@/lib/engines/care-form-intelligence-engine";

interface CareFormIntelligenceResponse {
  data: CareFormIntelligenceResult;
}

export function useCareFormIntelligence() {
  return useQuery({
    queryKey: ["care-form-intelligence"],
    queryFn: () => api.get<CareFormIntelligenceResponse>("/care-form-intelligence"),
    refetchInterval: 60_000,
  });
}

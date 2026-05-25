"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — APPRAISAL INTELLIGENCE HOOK
// React Query wrapper for /api/v1/appraisal-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { AppraisalIntelligenceResult } from "@/lib/engines/appraisal-intelligence-engine";

interface AppraisalIntelligenceResponse {
  data: AppraisalIntelligenceResult;
}

export function useAppraisalIntelligence() {
  return useQuery({
    queryKey: ["appraisal-intelligence"],
    queryFn: () => api.get<AppraisalIntelligenceResponse>("/appraisal-intelligence"),
    refetchInterval: 60_000,
  });
}

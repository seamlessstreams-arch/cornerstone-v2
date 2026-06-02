"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EDUCATION INTELLIGENCE HOOK
// React Query wrapper for /api/v1/education-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { EducationIntelligenceResult } from "@/lib/engines/education-intelligence-engine";

interface EducationIntelligenceResponse {
  data: EducationIntelligenceResult;
}

export function useEducationIntelligence() {
  return useQuery({
    queryKey: ["education-intelligence"],
    queryFn: () => api.get<EducationIntelligenceResponse>("/education-intelligence"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

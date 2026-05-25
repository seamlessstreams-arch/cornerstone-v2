"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MEDICATION INTELLIGENCE HOOK
// React Query wrapper for /api/v1/medication-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { MedicationIntelligenceResult } from "@/lib/engines/medication-intelligence-engine";

interface MedicationIntelligenceResponse {
  data: MedicationIntelligenceResult;
}

export function useMedicationIntelligence() {
  return useQuery({
    queryKey: ["medication-intelligence"],
    queryFn: () => api.get<MedicationIntelligenceResponse>("/medication-intelligence"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

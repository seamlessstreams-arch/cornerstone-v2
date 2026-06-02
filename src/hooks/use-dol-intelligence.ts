"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — DEPRIVATION OF LIBERTY INTELLIGENCE HOOK
// React Query wrapper for /api/v1/dol-intelligence
// Reg 20 — restraint and deprivation of liberty
// Reg 21 — privacy and access
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { DoLIntelligenceResult } from "@/lib/engines/dol-intelligence-engine";

interface DoLIntelligenceResponse {
  data: DoLIntelligenceResult;
}

export function useDoLIntelligence() {
  return useQuery({
    queryKey: ["dol-intelligence"],
    queryFn: () => api.get<DoLIntelligenceResponse>("/dol-intelligence"),
    refetchInterval: 60_000,
  });
}

"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — REG 44 INTELLIGENCE HOOK
// React Query wrapper for /api/v1/reg44-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { Reg44IntelligenceResult } from "@/lib/engines/reg44-intelligence-engine";

interface Reg44IntelligenceResponse {
  data: Reg44IntelligenceResult;
}

export function useReg44Intelligence() {
  return useQuery({
    queryKey: ["reg44-intelligence"],
    queryFn: () => api.get<Reg44IntelligenceResponse>("/reg44-intelligence"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

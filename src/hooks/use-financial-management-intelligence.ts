"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — FINANCIAL MANAGEMENT INTELLIGENCE HOOK
// React Query wrapper for /api/v1/financial-management-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { FinancialManagementIntelligenceResult } from "@/lib/engines/financial-management-intelligence-engine";

interface FinancialManagementIntelligenceResponse {
  data: FinancialManagementIntelligenceResult;
}

export function useFinancialManagementIntelligence() {
  return useQuery({
    queryKey: ["financial-management-intelligence"],
    queryFn: () => api.get<FinancialManagementIntelligenceResponse>("/financial-management-intelligence"),
    refetchInterval: 60_000,
  });
}

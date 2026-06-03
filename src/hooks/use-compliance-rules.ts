"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — COMPLIANCE RULES HOOK
// React Query wrapper for /api/v1/compliance-rules — the FIXED regulatory
// rule engine (separate from ARIA).
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { ComplianceRulesResult } from "@/lib/compliance-rules/compliance-rules-engine";

interface ComplianceRulesResponse {
  data: ComplianceRulesResult;
}

export function useComplianceRules() {
  return useQuery({
    queryKey: ["compliance-rules"],
    queryFn: () => api.get<ComplianceRulesResponse>("/compliance-rules"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

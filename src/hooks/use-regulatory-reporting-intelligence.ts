"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — REGULATORY REPORTING INTELLIGENCE HOOK
// React Query wrapper for /api/v1/regulatory-reporting-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { RegulatoryReportingIntelligenceResult } from "@/lib/engines/regulatory-reporting-intelligence-engine";

interface RegulatoryReportingIntelligenceResponse {
  data: RegulatoryReportingIntelligenceResult;
}

export function useRegulatoryReportingIntelligence() {
  return useQuery({
    queryKey: ["regulatory-reporting-intelligence"],
    queryFn: () => api.get<RegulatoryReportingIntelligenceResponse>("/regulatory-reporting-intelligence"),
    refetchInterval: 60_000,
  });
}

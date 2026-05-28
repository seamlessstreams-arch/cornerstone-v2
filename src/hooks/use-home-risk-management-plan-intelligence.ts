"use client";

import { useQuery } from "@tanstack/react-query";
import type { RiskManagementPlanResult } from "@/lib/engines/home-risk-management-plan-intelligence-engine";

export function useHomeRiskManagementPlanIntelligence() {
  return useQuery<RiskManagementPlanResult>({
    queryKey: ["home-risk-management-plan-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-risk-management-plan-intelligence");
      if (!res.ok) throw new Error("Failed to fetch risk management plan intelligence");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 60_000,
  });
}

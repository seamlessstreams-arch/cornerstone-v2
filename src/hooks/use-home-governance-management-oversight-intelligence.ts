"use client";

import { useQuery } from "@tanstack/react-query";
import type { GovernanceOversightResult } from "@/lib/engines/home-governance-management-oversight-intelligence-engine";

interface GovernanceOversightResponse { data: GovernanceOversightResult; }

export function useHomeGovernanceManagementOversightIntelligence() {
  return useQuery<GovernanceOversightResponse>({
    queryKey: ["home-governance-management-oversight-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-governance-management-oversight-intelligence");
      if (!res.ok) throw new Error("Failed to fetch governance & management oversight intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

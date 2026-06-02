"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeDataGovernanceResult } from "@/lib/engines/home-data-governance-intelligence-engine";

interface HomeDataGovernanceResponse {
  data: HomeDataGovernanceResult;
}

export function useHomeDataGovernanceIntelligence() {
  return useQuery<HomeDataGovernanceResponse>({
    queryKey: ["home-data-governance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-data-governance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home data governance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

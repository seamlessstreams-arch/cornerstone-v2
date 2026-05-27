"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeOnCallGovernanceResult } from "@/lib/engines/home-on-call-governance-intelligence-engine";

interface HomeOnCallGovernanceResponse {
  data: HomeOnCallGovernanceResult;
}

export function useHomeOnCallGovernanceIntelligence() {
  return useQuery<HomeOnCallGovernanceResponse>({
    queryKey: ["home-on-call-governance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-on-call-governance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home on-call governance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

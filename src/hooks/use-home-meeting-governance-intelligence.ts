"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeMeetingGovernanceResult } from "@/lib/engines/home-meeting-governance-intelligence-engine";

interface HomeMeetingGovernanceResponse {
  data: HomeMeetingGovernanceResult;
}

export function useHomeMeetingGovernanceIntelligence() {
  return useQuery<HomeMeetingGovernanceResponse>({
    queryKey: ["home-meeting-governance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-meeting-governance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home meeting governance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

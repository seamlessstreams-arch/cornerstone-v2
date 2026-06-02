"use client";

import { useQuery } from "@tanstack/react-query";
import type { HouseMeetingGovernanceResult } from "@/lib/engines/home-house-meeting-governance-intelligence-engine";

interface HouseMeetingGovernanceResponse { data: HouseMeetingGovernanceResult; }

export function useHomeHouseMeetingGovernanceIntelligence() {
  return useQuery<HouseMeetingGovernanceResponse>({
    queryKey: ["home-house-meeting-governance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-house-meeting-governance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch house meeting governance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

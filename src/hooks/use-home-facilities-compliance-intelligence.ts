"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeFacilitiesComplianceResult } from "@/lib/engines/home-facilities-compliance-intelligence-engine";

interface HomeFacilitiesComplianceResponse {
  data: HomeFacilitiesComplianceResult;
}

export function useHomeFacilitiesComplianceIntelligence() {
  return useQuery<HomeFacilitiesComplianceResponse>({
    queryKey: ["home-facilities-compliance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-facilities-compliance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home facilities compliance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

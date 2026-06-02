"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeSafeguardingPreventionResult } from "@/lib/engines/home-safeguarding-prevention-intelligence-engine";

interface HomeSafeguardingPreventionResponse {
  data: HomeSafeguardingPreventionResult;
}

export function useHomeSafeguardingPreventionIntelligence() {
  return useQuery<HomeSafeguardingPreventionResponse>({
    queryKey: ["home-safeguarding-prevention-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-safeguarding-prevention-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home safeguarding prevention intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomePlacementStabilityResult } from "@/lib/engines/home-placement-stability-intelligence-engine";

interface HomePlacementStabilityResponse {
  data: HomePlacementStabilityResult;
}

export function useHomePlacementStabilityIntelligence() {
  return useQuery<HomePlacementStabilityResponse>({
    queryKey: ["home-placement-stability-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-placement-stability-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home placement stability intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

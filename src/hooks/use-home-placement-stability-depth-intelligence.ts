"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomePlacementStabilityDepthResult } from "@/lib/engines/home-placement-stability-depth-intelligence-engine";

interface HomePlacementStabilityDepthResponse {
  data: HomePlacementStabilityDepthResult;
}

export function useHomePlacementStabilityDepthIntelligence() {
  return useQuery<HomePlacementStabilityDepthResponse>({
    queryKey: ["home-placement-stability-depth-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-placement-stability-depth-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home placement stability depth intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

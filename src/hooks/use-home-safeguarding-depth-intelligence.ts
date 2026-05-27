"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeSafeguardingDepthResult } from "@/lib/engines/home-safeguarding-depth-intelligence-engine";

interface HomeSafeguardingDepthResponse {
  data: HomeSafeguardingDepthResult;
}

export function useHomeSafeguardingDepthIntelligence() {
  return useQuery<HomeSafeguardingDepthResponse>({
    queryKey: ["home-safeguarding-depth-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-safeguarding-depth-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home safeguarding depth intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

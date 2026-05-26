"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeRiskLandscapeResult } from "@/lib/engines/home-risk-landscape-intelligence-engine";

interface HomeRiskLandscapeResponse {
  data: HomeRiskLandscapeResult;
}

export function useHomeRiskLandscapeIntelligence() {
  return useQuery<HomeRiskLandscapeResponse>({
    queryKey: ["home-risk-landscape-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-risk-landscape-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home risk landscape intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeNightSafetyResult } from "@/lib/engines/home-night-safety-intelligence-engine";

interface HomeNightSafetyResponse {
  data: HomeNightSafetyResult;
}

export function useHomeNightSafetyIntelligence() {
  return useQuery<HomeNightSafetyResponse>({
    queryKey: ["home-night-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-night-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home night safety intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

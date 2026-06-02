"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeOutcomesProgressResult } from "@/lib/engines/home-outcomes-progress-intelligence-engine";

interface HomeOutcomesProgressResponse {
  data: HomeOutcomesProgressResult;
}

export function useHomeOutcomesProgressIntelligence() {
  return useQuery<HomeOutcomesProgressResponse>({
    queryKey: ["home-outcomes-progress-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-outcomes-progress-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home outcomes progress intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

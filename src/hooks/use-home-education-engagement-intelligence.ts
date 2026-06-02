"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeEducationEngagementResult } from "@/lib/engines/home-education-engagement-intelligence-engine";

interface HomeEducationEngagementResponse {
  data: HomeEducationEngagementResult;
}

export function useHomeEducationEngagementIntelligence() {
  return useQuery<HomeEducationEngagementResponse>({
    queryKey: ["home-education-engagement-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-education-engagement-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home education engagement intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

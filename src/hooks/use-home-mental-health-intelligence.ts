"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeMentalHealthResult } from "@/lib/engines/home-mental-health-intelligence-engine";

interface HomeMentalHealthResponse {
  data: HomeMentalHealthResult;
}

export function useHomeMentalHealthIntelligence() {
  return useQuery<HomeMentalHealthResponse>({
    queryKey: ["home-mental-health-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-mental-health-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home mental health intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

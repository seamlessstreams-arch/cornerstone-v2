"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeParticipationResult } from "@/lib/engines/home-participation-intelligence-engine";

interface HomeParticipationResponse {
  data: HomeParticipationResult;
}

export function useHomeParticipationIntelligence() {
  return useQuery<HomeParticipationResponse>({
    queryKey: ["home-participation-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-participation-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home participation intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

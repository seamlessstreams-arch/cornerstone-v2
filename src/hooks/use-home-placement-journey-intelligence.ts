"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomePlacementJourneyResult } from "@/lib/engines/home-placement-journey-intelligence-engine";

interface HomePlacementJourneyResponse { data: HomePlacementJourneyResult; }

export function useHomePlacementJourneyIntelligence() {
  return useQuery<HomePlacementJourneyResponse>({
    queryKey: ["home-placement-journey-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-placement-journey-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home placement journey intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

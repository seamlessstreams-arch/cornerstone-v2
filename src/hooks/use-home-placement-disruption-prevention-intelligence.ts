"use client";

import { useQuery } from "@tanstack/react-query";
import type { DisruptionPreventionResult } from "@/lib/engines/home-placement-disruption-prevention-intelligence-engine";

interface DisruptionPreventionResponse { data: DisruptionPreventionResult; }

export function useHomePlacementDisruptionPreventionIntelligence() {
  return useQuery<DisruptionPreventionResponse>({
    queryKey: ["home-placement-disruption-prevention-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-placement-disruption-prevention-intelligence");
      if (!res.ok) throw new Error("Failed to fetch placement disruption prevention intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

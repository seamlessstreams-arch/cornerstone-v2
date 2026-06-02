"use client";

import { useQuery } from "@tanstack/react-query";
import type { PlacementImpactResult } from "@/lib/engines/home-placement-impact-assessment-intelligence-engine";

export function useHomePlacementImpactAssessmentIntelligence() {
  return useQuery<{ data: PlacementImpactResult }>({
    queryKey: ["home-placement-impact-assessment-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-placement-impact-assessment-intelligence");
      if (!res.ok) throw new Error("Failed to fetch placement impact assessment intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

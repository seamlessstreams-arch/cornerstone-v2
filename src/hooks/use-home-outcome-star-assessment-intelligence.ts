"use client";

import { useQuery } from "@tanstack/react-query";
import type { OutcomeStarResult } from "@/lib/engines/home-outcome-star-assessment-intelligence-engine";

export function useHomeOutcomeStarAssessmentIntelligence() {
  return useQuery<OutcomeStarResult>({
    queryKey: ["home-outcome-star-assessment-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-outcome-star-assessment-intelligence");
      if (!res.ok) throw new Error("Failed to fetch Outcome Star intelligence");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 60_000,
  });
}

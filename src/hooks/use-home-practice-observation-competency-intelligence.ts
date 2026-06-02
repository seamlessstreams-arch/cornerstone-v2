"use client";

import { useQuery } from "@tanstack/react-query";
import type { PracticeObservationResult } from "@/lib/engines/home-practice-observation-competency-intelligence-engine";

interface PracticeObservationResponse { data: PracticeObservationResult; }

export function useHomePracticeObservationCompetencyIntelligence() {
  return useQuery<PracticeObservationResponse>({
    queryKey: ["home-practice-observation-competency-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-practice-observation-competency-intelligence");
      if (!res.ok) throw new Error("Failed to fetch practice observation competency intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeNeighbourhoodSafetyRiskAssessmentIntelligence() {
  return useQuery({
    queryKey: ["home-neighbourhood-safety-risk-assessment-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-neighbourhood-safety-risk-assessment-intelligence");
      if (!res.ok) throw new Error("Failed to fetch neighbourhood safety risk assessment intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

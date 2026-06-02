"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeRiskAssessmentResult } from "@/lib/engines/home-risk-assessment-intelligence-engine";

interface HomeRiskAssessmentResponse {
  data: HomeRiskAssessmentResult;
}

export function useHomeRiskAssessmentIntelligence() {
  return useQuery<HomeRiskAssessmentResponse>({
    queryKey: ["home-risk-assessment-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-risk-assessment-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home risk assessment intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

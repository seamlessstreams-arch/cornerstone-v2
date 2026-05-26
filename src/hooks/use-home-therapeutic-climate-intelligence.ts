"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeTherapeuticClimateResult } from "@/lib/engines/home-therapeutic-climate-intelligence-engine";

interface HomeTherapeuticClimateResponse {
  data: HomeTherapeuticClimateResult;
}

export function useHomeTherapeuticClimateIntelligence() {
  return useQuery<HomeTherapeuticClimateResponse>({
    queryKey: ["home-therapeutic-climate-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-therapeutic-climate-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home therapeutic climate intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

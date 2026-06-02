"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeQAResult } from "@/lib/engines/home-quality-assurance-intelligence-engine";

interface HomeQAResponse {
  data: HomeQAResult;
}

export function useHomeQualityAssuranceIntelligence() {
  return useQuery<HomeQAResponse>({
    queryKey: ["home-quality-assurance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-quality-assurance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home quality assurance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

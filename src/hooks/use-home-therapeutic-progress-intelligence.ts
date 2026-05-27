"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeTherapeuticProgressResult } from "@/lib/engines/home-therapeutic-progress-intelligence-engine";

interface HomeTherapeuticProgressResponse {
  data: HomeTherapeuticProgressResult;
}

export function useHomeTherapeuticProgressIntelligence() {
  return useQuery<HomeTherapeuticProgressResponse>({
    queryKey: ["home-therapeutic-progress-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-therapeutic-progress-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home therapeutic progress intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

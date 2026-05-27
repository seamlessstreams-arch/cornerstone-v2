"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeSpecializedHealthPlansResult } from "@/lib/engines/home-specialized-health-plans-intelligence-engine";

interface HomeSpecializedHealthPlansResponse {
  data: HomeSpecializedHealthPlansResult;
}

export function useHomeSpecializedHealthPlansIntelligence() {
  return useQuery<HomeSpecializedHealthPlansResponse>({
    queryKey: ["home-specialized-health-plans-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-specialized-health-plans-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home specialized health plans intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

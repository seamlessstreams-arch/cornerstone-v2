"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeWorkforcePlanningResult } from "@/lib/engines/home-workforce-planning-intelligence-engine";

interface HomeWorkforcePlanningResponse {
  data: HomeWorkforcePlanningResult;
}

export function useHomeWorkforcePlanningIntelligence() {
  return useQuery<HomeWorkforcePlanningResponse>({
    queryKey: ["home-workforce-planning-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-workforce-planning-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home workforce planning intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

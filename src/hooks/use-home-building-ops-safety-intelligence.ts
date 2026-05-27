"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeBuildingOpsSafetyResult } from "@/lib/engines/home-building-ops-safety-intelligence-engine";

interface HomeBuildingOpsSafetyResponse { data: HomeBuildingOpsSafetyResult; }

export function useHomeBuildingOpsSafetyIntelligence() {
  return useQuery<HomeBuildingOpsSafetyResponse>({
    queryKey: ["home-building-ops-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-building-ops-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home building ops safety intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

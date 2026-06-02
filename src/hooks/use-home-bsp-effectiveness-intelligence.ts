"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeBSPEffectivenessResult } from "@/lib/engines/home-bsp-effectiveness-intelligence-engine";

interface HomeBSPEffectivenessResponse {
  data: HomeBSPEffectivenessResult;
}

export function useHomeBSPEffectivenessIntelligence() {
  return useQuery<HomeBSPEffectivenessResponse>({
    queryKey: ["home-bsp-effectiveness-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-bsp-effectiveness-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home BSP effectiveness intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

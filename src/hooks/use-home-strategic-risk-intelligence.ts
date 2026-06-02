"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeStrategicRiskResult } from "@/lib/engines/home-strategic-risk-intelligence-engine";

interface HomeStrategicRiskResponse { data: HomeStrategicRiskResult; }

export function useHomeStrategicRiskIntelligence() {
  return useQuery<HomeStrategicRiskResponse>({
    queryKey: ["home-strategic-risk-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-strategic-risk-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home strategic risk intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

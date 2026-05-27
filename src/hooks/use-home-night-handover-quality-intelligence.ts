"use client";

import { useQuery } from "@tanstack/react-query";
import type { NightHandoverQualityResult } from "@/lib/engines/home-night-handover-quality-intelligence-engine";

interface NightHandoverQualityResponse { data: NightHandoverQualityResult; }

export function useHomeNightHandoverQualityIntelligence() {
  return useQuery<NightHandoverQualityResponse>({
    queryKey: ["home-night-handover-quality-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-night-handover-quality-intelligence");
      if (!res.ok) throw new Error("Failed to fetch night handover quality intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeWellbeingResult } from "@/lib/engines/home-wellbeing-intelligence-engine";

interface HomeWellbeingResponse {
  data: HomeWellbeingResult;
}

export function useHomeWellbeingIntelligence() {
  return useQuery<HomeWellbeingResponse>({
    queryKey: ["home-wellbeing-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-wellbeing-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home wellbeing intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

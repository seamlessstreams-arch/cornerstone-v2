"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeFinancialResult } from "@/lib/engines/home-financial-wellbeing-intelligence-engine";

interface HomeFinancialResponse {
  data: HomeFinancialResult;
}

export function useHomeFinancialWellbeingIntelligence() {
  return useQuery<HomeFinancialResponse>({
    queryKey: ["home-financial-wellbeing-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-financial-wellbeing-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home financial wellbeing intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

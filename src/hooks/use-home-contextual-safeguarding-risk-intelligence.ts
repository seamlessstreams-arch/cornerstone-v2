"use client";

import { useQuery } from "@tanstack/react-query";
import type { ContextualSafeguardingResult } from "@/lib/engines/home-contextual-safeguarding-risk-intelligence-engine";

export function useHomeContextualSafeguardingRiskIntelligence() {
  return useQuery<ContextualSafeguardingResult>({
    queryKey: ["home-contextual-safeguarding-risk-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-contextual-safeguarding-risk-intelligence");
      if (!res.ok) throw new Error("Failed to fetch contextual safeguarding intelligence");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { ContextualSafeguardingResult } from "@/lib/engines/home-contextual-safeguarding-intelligence-engine";

interface ContextualSafeguardingResponse { data: ContextualSafeguardingResult; }

export function useHomeContextualSafeguardingIntelligence() {
  return useQuery<ContextualSafeguardingResponse>({
    queryKey: ["home-contextual-safeguarding-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-contextual-safeguarding-intelligence");
      if (!res.ok) throw new Error("Failed to fetch contextual safeguarding intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

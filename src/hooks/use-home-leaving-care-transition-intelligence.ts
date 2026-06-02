"use client";

import { useQuery } from "@tanstack/react-query";
import type { LeavingCareResult } from "@/lib/engines/home-leaving-care-transition-intelligence-engine";

interface LeavingCareResponse { data: LeavingCareResult; }

export function useHomeLeavingCareTransitionIntelligence() {
  return useQuery<LeavingCareResponse>({
    queryKey: ["home-leaving-care-transition-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-leaving-care-transition-intelligence");
      if (!res.ok) throw new Error("Failed to fetch leaving care & transition intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

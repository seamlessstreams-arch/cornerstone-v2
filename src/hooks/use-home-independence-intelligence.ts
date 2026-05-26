"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeIndependenceResult } from "@/lib/engines/home-independence-intelligence-engine";

interface HomeIndependenceResponse {
  data: HomeIndependenceResult;
}

export function useHomeIndependenceIntelligence() {
  return useQuery<HomeIndependenceResponse>({
    queryKey: ["home-independence-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-independence-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home independence intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

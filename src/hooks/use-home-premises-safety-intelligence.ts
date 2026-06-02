"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomePremisesResult } from "@/lib/engines/home-premises-safety-intelligence-engine";

interface HomePremisesResponse {
  data: HomePremisesResult;
}

export function useHomePremisesSafetyIntelligence() {
  return useQuery<HomePremisesResponse>({
    queryKey: ["home-premises-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-premises-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home premises safety intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

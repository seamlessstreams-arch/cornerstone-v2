"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomePeerDynamicsResult } from "@/lib/engines/home-peer-dynamics-intelligence-engine";

interface HomePeerDynamicsResponse {
  data: HomePeerDynamicsResult;
}

export function useHomePeerDynamicsIntelligence() {
  return useQuery<HomePeerDynamicsResponse>({
    queryKey: ["home-peer-dynamics-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-peer-dynamics-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home peer dynamics intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

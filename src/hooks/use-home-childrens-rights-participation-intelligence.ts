"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeChildrensRightsResult } from "@/lib/engines/home-childrens-rights-participation-intelligence-engine";

interface HomeChildrensRightsResponse {
  data: HomeChildrensRightsResult;
}

export function useHomeChildrensRightsParticipationIntelligence() {
  return useQuery<HomeChildrensRightsResponse>({
    queryKey: ["home-childrens-rights-participation-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-childrens-rights-participation-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home childrens rights participation intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

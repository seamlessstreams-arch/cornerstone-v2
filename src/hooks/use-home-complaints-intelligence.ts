"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeComplaintsResult } from "@/lib/engines/home-complaints-intelligence-engine";

interface HomeComplaintsResponse {
  data: HomeComplaintsResult;
}

export function useHomeComplaintsIntelligence() {
  return useQuery<HomeComplaintsResponse>({
    queryKey: ["home-complaints-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-complaints-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home complaints intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

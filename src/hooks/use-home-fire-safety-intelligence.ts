"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeFireSafetyResult } from "@/lib/engines/home-fire-safety-intelligence-engine";

interface HomeFireSafetyResponse {
  data: HomeFireSafetyResult;
}

export function useHomeFireSafetyIntelligence() {
  return useQuery<HomeFireSafetyResponse>({
    queryKey: ["home-fire-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-fire-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home fire safety intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

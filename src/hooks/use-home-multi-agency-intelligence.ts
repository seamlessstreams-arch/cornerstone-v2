"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeMultiAgencyResult } from "@/lib/engines/home-multi-agency-intelligence-engine";

interface HomeMultiAgencyResponse {
  data: HomeMultiAgencyResult;
}

export function useHomeMultiAgencyIntelligence() {
  return useQuery<HomeMultiAgencyResponse>({
    queryKey: ["home-multi-agency-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-multi-agency-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home multi-agency intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

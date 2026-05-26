"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeKeyworkerResult } from "@/lib/engines/home-keyworker-intelligence-engine";

interface HomeKeyworkerResponse {
  data: HomeKeyworkerResult;
}

export function useHomeKeyworkerIntelligence() {
  return useQuery<HomeKeyworkerResponse>({
    queryKey: ["home-keyworker-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-keyworker-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home keyworker intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

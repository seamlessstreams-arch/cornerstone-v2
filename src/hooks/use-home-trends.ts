"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeTrendsResult } from "@/lib/engines/home-trends-engine";

export function useHomeTrends() {
  return useQuery<HomeTrendsResult>({
    queryKey: ["home-trends"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-trends");
      if (!res.ok) throw new Error("Failed to fetch home trends");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 120_000,
  });
}

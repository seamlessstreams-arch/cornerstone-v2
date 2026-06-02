"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeWaterSafetyHydrationIntelligence() {
  return useQuery({
    queryKey: ["home-water-safety-hydration-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-water-safety-hydration-intelligence");
      if (!res.ok) throw new Error("Failed to fetch water safety hydration intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

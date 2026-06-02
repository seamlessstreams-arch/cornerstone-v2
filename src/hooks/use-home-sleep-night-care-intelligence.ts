"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeSleepNightCareIntelligence() {
  return useQuery({
    queryKey: ["home-sleep-night-care-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-sleep-night-care-intelligence");
      if (!res.ok) throw new Error("Failed to fetch sleep night care intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

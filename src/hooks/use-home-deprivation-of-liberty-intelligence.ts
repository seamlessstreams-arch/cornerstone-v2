"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeDeprivationOfLibertyIntelligence() {
  return useQuery({
    queryKey: ["home-deprivation-of-liberty-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-deprivation-of-liberty-intelligence");
      if (!res.ok) throw new Error("Failed to fetch deprivation of liberty intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeSubstanceMisusePreventionIntelligence() {
  return useQuery({
    queryKey: ["home-substance-misuse-prevention-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-substance-misuse-prevention-intelligence");
      if (!res.ok) throw new Error("Failed to fetch substance misuse prevention intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

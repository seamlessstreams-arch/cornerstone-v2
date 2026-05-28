"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeInformationFlowQualityIntelligence() {
  return useQuery({
    queryKey: ["home-information-flow-quality-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-information-flow-quality-intelligence");
      if (!res.ok) throw new Error("Failed to fetch information flow quality intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

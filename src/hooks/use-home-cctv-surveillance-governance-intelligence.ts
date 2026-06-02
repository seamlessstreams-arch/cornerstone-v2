"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeCctvSurveillanceGovernanceIntelligence() {
  return useQuery({
    queryKey: ["home-cctv-surveillance-governance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-cctv-surveillance-governance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch CCTV surveillance governance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

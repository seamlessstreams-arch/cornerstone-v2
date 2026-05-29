"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeBedwettingEnuresisSupportIntelligence() {
  return useQuery({
    queryKey: ["home-bedwetting-enuresis-support-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-bedwetting-enuresis-support-intelligence");
      if (!res.ok) throw new Error("Failed to fetch bedwetting enuresis support intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

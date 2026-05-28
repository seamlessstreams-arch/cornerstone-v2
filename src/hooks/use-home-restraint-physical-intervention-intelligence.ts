"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeRestraintPhysicalInterventionIntelligence() {
  return useQuery({
    queryKey: ["home-restraint-physical-intervention-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-restraint-physical-intervention-intelligence");
      if (!res.ok) throw new Error("Failed to fetch restraint physical intervention intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeBathroomShowerFacilitiesIntelligence() {
  return useQuery({
    queryKey: ["home-bathroom-shower-facilities-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-bathroom-shower-facilities-intelligence");
      if (!res.ok) throw new Error("Failed to fetch bathroom shower facilities intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

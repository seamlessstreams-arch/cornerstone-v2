"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeBathroomAccessibilityAdaptationsIntelligence() {
  return useQuery({
    queryKey: ["home-bathroom-accessibility-adaptations-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-bathroom-accessibility-adaptations-intelligence");
      if (!res.ok) throw new Error("Failed to fetch bathroom accessibility adaptations intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

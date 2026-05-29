"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeCookingKitchenSkillsIntelligence() {
  return useQuery({
    queryKey: ["home-cooking-kitchen-skills-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-cooking-kitchen-skills-intelligence");
      if (!res.ok) throw new Error("Failed to fetch cooking kitchen skills intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

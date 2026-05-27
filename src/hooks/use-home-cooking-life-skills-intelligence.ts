"use client";

import { useQuery } from "@tanstack/react-query";
import type { CookingLifeSkillsResult } from "@/lib/engines/home-cooking-life-skills-intelligence-engine";

interface CookingLifeSkillsResponse { data: CookingLifeSkillsResult; }

export function useHomeCookingLifeSkillsIntelligence() {
  return useQuery<CookingLifeSkillsResponse>({
    queryKey: ["home-cooking-life-skills-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-cooking-life-skills-intelligence");
      if (!res.ok) throw new Error("Failed to fetch cooking life skills intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

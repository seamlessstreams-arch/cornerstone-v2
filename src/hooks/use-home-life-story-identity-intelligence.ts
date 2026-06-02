"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeLifeStoryIdentityResult } from "@/lib/engines/home-life-story-identity-intelligence-engine";

interface HomeLifeStoryIdentityResponse { data: HomeLifeStoryIdentityResult; }

export function useHomeLifeStoryIdentityIntelligence() {
  return useQuery<HomeLifeStoryIdentityResponse>({
    queryKey: ["home-life-story-identity-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-life-story-identity-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home life story identity intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

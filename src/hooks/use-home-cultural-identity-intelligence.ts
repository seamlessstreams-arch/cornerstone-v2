"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeCulturalIdentityResult } from "@/lib/engines/home-cultural-identity-intelligence-engine";

interface HomeCulturalIdentityResponse {
  data: HomeCulturalIdentityResult;
}

export function useHomeCulturalIdentityIntelligence() {
  return useQuery<HomeCulturalIdentityResponse>({
    queryKey: ["home-cultural-identity-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-cultural-identity-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home cultural identity intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

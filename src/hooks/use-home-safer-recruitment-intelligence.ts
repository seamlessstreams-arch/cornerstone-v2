"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeSaferRecruitmentResult } from "@/lib/engines/home-safer-recruitment-intelligence-engine";

interface HomeSaferRecruitmentResponse {
  data: HomeSaferRecruitmentResult;
}

export function useHomeSaferRecruitmentIntelligence() {
  return useQuery<HomeSaferRecruitmentResponse>({
    queryKey: ["home-safer-recruitment-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-safer-recruitment-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home safer recruitment intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChildRiskProfileResult } from "@/lib/engines/child-risk-profile-intelligence-engine";

interface ChildRiskProfileResponse {
  data: ChildRiskProfileResult;
}

export function useChildRiskProfileIntelligence(childId: string) {
  return useQuery<ChildRiskProfileResponse>({
    queryKey: ["child-risk-profile-intelligence", childId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/child-risk-profile-intelligence?childId=${childId}`);
      if (!res.ok) throw new Error("Failed to fetch child risk profile intelligence");
      return res.json();
    },
    enabled: !!childId,
    refetchInterval: 60_000,
  });
}

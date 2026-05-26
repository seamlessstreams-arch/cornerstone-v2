"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChildRestrictivePracticeResult } from "@/lib/engines/child-restrictive-practice-intelligence-engine";

interface ChildRestrictivePracticeResponse {
  data: ChildRestrictivePracticeResult;
}

export function useChildRestrictivePracticeIntelligence(childId: string) {
  return useQuery<ChildRestrictivePracticeResponse>({
    queryKey: ["child-restrictive-practice-intelligence", childId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/child-restrictive-practice-intelligence?childId=${childId}`);
      if (!res.ok) throw new Error("Failed to fetch child restrictive practice intelligence");
      return res.json();
    },
    enabled: !!childId,
    refetchInterval: 60_000,
  });
}

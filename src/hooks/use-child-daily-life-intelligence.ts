"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChildDailyLifeResult } from "@/lib/engines/child-daily-life-intelligence-engine";

interface ChildDailyLifeResponse {
  data: ChildDailyLifeResult;
}

export function useChildDailyLifeIntelligence(childId: string) {
  return useQuery<ChildDailyLifeResponse>({
    queryKey: ["child-daily-life-intelligence", childId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/child-daily-life-intelligence?childId=${childId}`);
      if (!res.ok) throw new Error("Failed to fetch child daily life intelligence");
      return res.json();
    },
    enabled: !!childId,
    refetchInterval: 60_000,
  });
}

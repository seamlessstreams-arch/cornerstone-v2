"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChildEmotionalWellbeingResult } from "@/lib/engines/child-emotional-wellbeing-intelligence-engine";

interface ChildEmotionalWellbeingResponse {
  data: ChildEmotionalWellbeingResult;
}

export function useChildEmotionalWellbeingIntelligence(childId: string) {
  return useQuery<ChildEmotionalWellbeingResponse>({
    queryKey: ["child-emotional-wellbeing-intelligence", childId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/child-emotional-wellbeing-intelligence?childId=${childId}`);
      if (!res.ok) throw new Error("Failed to fetch child emotional wellbeing intelligence");
      return res.json();
    },
    enabled: !!childId,
    refetchInterval: 60_000,
  });
}

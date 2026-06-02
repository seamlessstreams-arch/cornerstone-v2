"use client";

import { useQuery } from "@tanstack/react-query";
import type { LessonsLearnedResult } from "@/lib/engines/home-lessons-learned-improvement-intelligence-engine";

interface LessonsLearnedResponse { data: LessonsLearnedResult; }

export function useHomeLessonsLearnedImprovementIntelligence() {
  return useQuery<LessonsLearnedResponse>({
    queryKey: ["home-lessons-learned-improvement-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-lessons-learned-improvement-intelligence");
      if (!res.ok) throw new Error("Failed to fetch lessons learned & improvement intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

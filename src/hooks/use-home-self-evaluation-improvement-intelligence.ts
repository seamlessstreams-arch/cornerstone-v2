"use client";

import { useQuery } from "@tanstack/react-query";
import type { SelfEvaluationResult } from "@/lib/engines/home-self-evaluation-improvement-intelligence-engine";

interface SelfEvaluationResponse { data: SelfEvaluationResult; }

export function useHomeSelfEvaluationImprovementIntelligence() {
  return useQuery<SelfEvaluationResponse>({
    queryKey: ["home-self-evaluation-improvement-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-self-evaluation-improvement-intelligence");
      if (!res.ok) throw new Error("Failed to fetch self-evaluation improvement intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

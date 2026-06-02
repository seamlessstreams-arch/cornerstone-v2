"use client";

import { useQuery } from "@tanstack/react-query";
import type { BehaviourSupportPlanResult } from "@/lib/engines/home-behaviour-support-plan-intelligence-engine";

export function useHomeBehaviourSupportPlanIntelligence() {
  return useQuery<BehaviourSupportPlanResult>({
    queryKey: ["home-behaviour-support-plan-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-behaviour-support-plan-intelligence");
      if (!res.ok) throw new Error("Failed to fetch behaviour support plan intelligence");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { WorkforceResilienceResult } from "@/lib/engines/home-workforce-resilience-composite-engine";

interface WorkforceResilienceCompositeResponse { data: WorkforceResilienceResult; }

export function useHomeWorkforceResilienceComposite() {
  return useQuery<WorkforceResilienceCompositeResponse>({
    queryKey: ["home-workforce-resilience-composite"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-workforce-resilience-composite");
      if (!res.ok) throw new Error("Failed to fetch workforce resilience composite");
      return res.json();
    },
    refetchInterval: 120_000,
  });
}

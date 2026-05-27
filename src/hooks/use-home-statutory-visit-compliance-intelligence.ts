"use client";

import { useQuery } from "@tanstack/react-query";
import type { StatutoryVisitResult } from "@/lib/engines/home-statutory-visit-compliance-intelligence-engine";

interface StatutoryVisitResponse { data: StatutoryVisitResult; }

export function useHomeStatutoryVisitComplianceIntelligence() {
  return useQuery<StatutoryVisitResponse>({
    queryKey: ["home-statutory-visit-compliance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-statutory-visit-compliance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch statutory visit compliance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

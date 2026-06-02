"use client";

import { useQuery } from "@tanstack/react-query";
import type { RegulatoryComplianceResult } from "@/lib/engines/home-regulatory-compliance-composite-engine";

interface RegulatoryComplianceCompositeResponse { data: RegulatoryComplianceResult; }

export function useHomeRegulatoryComplianceComposite() {
  return useQuery<RegulatoryComplianceCompositeResponse>({
    queryKey: ["home-regulatory-compliance-composite"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-regulatory-compliance-composite");
      if (!res.ok) throw new Error("Failed to fetch regulatory compliance composite");
      return res.json();
    },
    refetchInterval: 120_000,
  });
}

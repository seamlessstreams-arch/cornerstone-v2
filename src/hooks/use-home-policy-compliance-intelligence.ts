"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomePolicyResult } from "@/lib/engines/home-policy-compliance-intelligence-engine";

interface HomePolicyResponse {
  data: HomePolicyResult;
}

export function useHomePolicyComplianceIntelligence() {
  return useQuery<HomePolicyResponse>({
    queryKey: ["home-policy-compliance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-policy-compliance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home policy compliance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

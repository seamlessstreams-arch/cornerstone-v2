"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeExpenseGovernanceResult } from "@/lib/engines/home-expense-governance-intelligence-engine";

interface HomeExpenseGovernanceResponse {
  data: HomeExpenseGovernanceResult;
}

export function useHomeExpenseGovernanceIntelligence() {
  return useQuery<HomeExpenseGovernanceResponse>({
    queryKey: ["home-expense-governance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-expense-governance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home expense governance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

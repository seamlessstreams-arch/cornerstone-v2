"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeWelfareCheckComplianceIntelligence() {
  return useQuery({
    queryKey: ["home-welfare-check-compliance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-welfare-check-compliance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch welfare check compliance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomePocketMoneyDistributionEquityIntelligence() {
  return useQuery({
    queryKey: ["home-pocket-money-distribution-equity-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-pocket-money-distribution-equity-intelligence");
      if (!res.ok) throw new Error("Failed to fetch pocket money distribution equity intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

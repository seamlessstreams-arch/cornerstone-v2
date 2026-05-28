"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeSanctionRewardBalanceIntelligence() {
  return useQuery({
    queryKey: ["home-sanction-reward-balance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-sanction-reward-balance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch sanction reward balance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

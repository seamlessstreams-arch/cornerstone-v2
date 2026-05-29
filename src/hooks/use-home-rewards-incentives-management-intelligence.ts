"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeRewardsIncentivesManagementIntelligence() {
  return useQuery({
    queryKey: ["home-rewards-incentives-management-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-rewards-incentives-management-intelligence");
      if (!res.ok) throw new Error("Failed to fetch rewards incentives management intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

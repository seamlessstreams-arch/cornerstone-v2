"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeUtilityBillsCostManagementIntelligence() {
  return useQuery({
    queryKey: ["home-utility-bills-cost-management-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-utility-bills-cost-management-intelligence");
      if (!res.ok) throw new Error("Failed to fetch utility bills cost management intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

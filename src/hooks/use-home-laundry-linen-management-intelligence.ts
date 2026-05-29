"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeLaundryLinenManagementIntelligence() {
  return useQuery({
    queryKey: ["home-laundry-linen-management-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-laundry-linen-management-intelligence");
      if (!res.ok) throw new Error("Failed to fetch laundry linen management intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

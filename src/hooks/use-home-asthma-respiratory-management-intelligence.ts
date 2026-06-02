"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeAsthmaRespiratoryManagementIntelligence() {
  return useQuery({
    queryKey: ["home-asthma-respiratory-management-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-asthma-respiratory-management-intelligence");
      if (!res.ok) throw new Error("Failed to fetch asthma respiratory management intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeWeightManagementHealthyEatingIntelligence() {
  return useQuery({
    queryKey: ["home-weight-management-healthy-eating-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-weight-management-healthy-eating-intelligence");
      if (!res.ok) throw new Error("Failed to fetch weight management healthy eating intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

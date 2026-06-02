"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeElectricityGasSafetyIntelligence() {
  return useQuery({
    queryKey: ["home-electricity-gas-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-electricity-gas-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch electricity gas safety intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

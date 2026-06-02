"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeDentalOralHealthIntelligence() {
  return useQuery({
    queryKey: ["home-dental-oral-health-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-dental-oral-health-intelligence");
      if (!res.ok) throw new Error("Failed to fetch dental oral health intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeHolisticChildProgressIntelligence() {
  return useQuery({
    queryKey: ["home-holistic-child-progress-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-holistic-child-progress-intelligence");
      if (!res.ok) throw new Error("Failed to fetch holistic child progress intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

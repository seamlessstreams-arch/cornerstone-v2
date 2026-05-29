"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeAdvocacyIndependentVisitorIntelligence() {
  return useQuery({
    queryKey: ["home-advocacy-independent-visitor-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-advocacy-independent-visitor-intelligence");
      if (!res.ok) throw new Error("Failed to fetch advocacy independent visitor intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

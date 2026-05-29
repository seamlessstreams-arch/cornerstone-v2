"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeYouthJusticeOffendingIntelligence() {
  return useQuery({
    queryKey: ["home-youth-justice-offending-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-youth-justice-offending-intelligence");
      if (!res.ok) throw new Error("Failed to fetch youth justice offending intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

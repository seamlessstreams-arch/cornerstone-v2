"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeWhistleblowingSafeguardingCultureIntelligence() {
  return useQuery({
    queryKey: ["home-whistleblowing-safeguarding-culture-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-whistleblowing-safeguarding-culture-intelligence");
      if (!res.ok) throw new Error("Failed to fetch whistleblowing safeguarding culture intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

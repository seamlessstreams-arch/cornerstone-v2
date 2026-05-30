"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomePestControlHygieneComplianceIntelligence() {
  return useQuery({
    queryKey: ["home-pest-control-hygiene-compliance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-pest-control-hygiene-compliance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch pest control hygiene compliance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

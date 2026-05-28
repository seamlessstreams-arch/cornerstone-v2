"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeRegulatoryEvidenceCompletenessIntelligence() {
  return useQuery({
    queryKey: ["home-regulatory-evidence-completeness-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-regulatory-evidence-completeness-intelligence");
      if (!res.ok) throw new Error("Failed to fetch regulatory evidence completeness intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

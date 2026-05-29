"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeTechnologyDigitalInclusionIntelligence() {
  return useQuery({
    queryKey: ["home-technology-digital-inclusion-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-technology-digital-inclusion-intelligence");
      if (!res.ok) throw new Error("Failed to fetch technology digital inclusion intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

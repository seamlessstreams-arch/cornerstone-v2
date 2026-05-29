"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeSiblingContactRelationshipsIntelligence() {
  return useQuery({
    queryKey: ["home-sibling-contact-relationships-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-sibling-contact-relationships-intelligence");
      if (!res.ok) throw new Error("Failed to fetch sibling contact relationships intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

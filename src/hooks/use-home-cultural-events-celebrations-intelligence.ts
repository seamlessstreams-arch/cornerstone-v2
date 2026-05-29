"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeCulturalEventsCelebrationsIntelligence() {
  return useQuery({
    queryKey: ["home-cultural-events-celebrations-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-cultural-events-celebrations-intelligence");
      if (!res.ok) throw new Error("Failed to fetch cultural events and celebrations intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

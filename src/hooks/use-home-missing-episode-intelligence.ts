"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeMissingEpisodeIntelligence() {
  return useQuery({
    queryKey: ["home-missing-episode-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-missing-episode-intelligence");
      if (!res.ok) throw new Error("Failed to fetch missing episode intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

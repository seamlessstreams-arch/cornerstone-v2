"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeNoiseSoundManagementIntelligence() {
  return useQuery({
    queryKey: ["home-noise-sound-management-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-noise-sound-management-intelligence");
      if (!res.ok) throw new Error("Failed to fetch noise and sound management intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

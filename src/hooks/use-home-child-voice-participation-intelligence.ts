"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeChildVoiceParticipationIntelligence() {
  return useQuery({
    queryKey: ["home-child-voice-participation-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-child-voice-participation-intelligence");
      if (!res.ok) throw new Error("Failed to fetch child voice participation intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

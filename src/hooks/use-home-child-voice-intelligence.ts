"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeChildVoiceResult } from "@/lib/engines/home-child-voice-intelligence-engine";

interface HomeChildVoiceResponse {
  data: HomeChildVoiceResult;
}

export function useHomeChildVoiceIntelligence() {
  return useQuery<HomeChildVoiceResponse>({
    queryKey: ["home-child-voice-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-child-voice-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home child voice intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

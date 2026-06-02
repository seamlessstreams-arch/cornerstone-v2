"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeNotifiableEventsResult } from "@/lib/engines/home-notifiable-events-intelligence-engine";

interface HomeNotifiableEventsResponse {
  data: HomeNotifiableEventsResult;
}

export function useHomeNotifiableEventsIntelligence() {
  return useQuery<HomeNotifiableEventsResponse>({
    queryKey: ["home-notifiable-events-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-notifiable-events-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home notifiable events intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

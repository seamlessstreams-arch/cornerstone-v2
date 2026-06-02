"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeDailyLogResult } from "@/lib/engines/home-daily-log-intelligence-engine";

interface HomeDailyLogResponse {
  data: HomeDailyLogResult;
}

export function useHomeDailyLogIntelligence() {
  return useQuery<HomeDailyLogResponse>({
    queryKey: ["home-daily-log-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-daily-log-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home daily log intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

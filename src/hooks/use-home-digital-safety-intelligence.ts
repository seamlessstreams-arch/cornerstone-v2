"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeDigitalSafetyResult } from "@/lib/engines/home-digital-safety-intelligence-engine";

interface HomeDigitalSafetyResponse {
  data: HomeDigitalSafetyResult;
}

export function useHomeDigitalSafetyIntelligence() {
  return useQuery<HomeDigitalSafetyResponse>({
    queryKey: ["home-digital-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-digital-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home digital safety intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

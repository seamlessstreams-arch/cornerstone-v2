"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeStaffSafetyResult } from "@/lib/engines/home-staff-safety-intelligence-engine";

interface HomeStaffSafetyResponse {
  data: HomeStaffSafetyResult;
}

export function useHomeStaffSafetyIntelligence() {
  return useQuery<HomeStaffSafetyResponse>({
    queryKey: ["home-staff-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-staff-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home staff safety intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

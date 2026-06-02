"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeStaffLifecycleResult } from "@/lib/engines/home-staff-lifecycle-intelligence-engine";

interface HomeStaffLifecycleResponse {
  data: HomeStaffLifecycleResult;
}

export function useHomeStaffLifecycleIntelligence() {
  return useQuery<HomeStaffLifecycleResponse>({
    queryKey: ["home-staff-lifecycle-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-staff-lifecycle-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home staff lifecycle intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

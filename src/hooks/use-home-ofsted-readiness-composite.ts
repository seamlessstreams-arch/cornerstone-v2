"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeOfstedReadinessResult } from "@/lib/engines/home-ofsted-readiness-composite-engine";

interface HomeOfstedReadinessResponse { data: HomeOfstedReadinessResult; }

export function useHomeOfstedReadinessComposite() {
  return useQuery<HomeOfstedReadinessResponse>({
    queryKey: ["home-ofsted-readiness-composite"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-ofsted-readiness-composite");
      if (!res.ok) throw new Error("Failed to fetch Ofsted readiness composite");
      return res.json();
    },
    refetchInterval: 120_000, // 2 minutes — composite is heavier
  });
}

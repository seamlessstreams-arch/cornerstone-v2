"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeLACReviewResult } from "@/lib/engines/home-lac-review-intelligence-engine";

interface HomeLACReviewResponse {
  data: HomeLACReviewResult;
}

export function useHomeLACReviewIntelligence() {
  return useQuery<HomeLACReviewResponse>({
    queryKey: ["home-lac-review-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-lac-review-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home LAC review intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

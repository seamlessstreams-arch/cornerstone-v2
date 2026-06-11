"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — LAC REVIEW INTELLIGENCE HOOK
// React Query wrapper for /api/v1/lac-review-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { LACReviewResult } from "@/lib/engines/lac-review-engine";

interface LACReviewIntelligenceResponse {
  data: LACReviewResult;
}

export function useLACReviewIntelligence() {
  return useQuery({
    queryKey: ["lac-review-intelligence"],
    queryFn: () => api.get<LACReviewIntelligenceResponse>("/lac-review-intelligence"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

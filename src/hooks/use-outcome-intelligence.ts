"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { OutcomeIntelligence } from "@/lib/outcome-intelligence/outcome-intelligence-engine";

/**
 * Fetch a child's Outcome Intelligence — per-domain (safety, education,
 * wellbeing, relationships, voice) status and direction measuring whether the
 * child's life outcomes are getting measurably better, projected from existing
 * records.
 */
export function useOutcomeIntelligence(childId: string | undefined) {
  return useQuery({
    queryKey: ["outcome-intelligence", childId],
    enabled: !!childId,
    queryFn: async () =>
      (
        await api.get<{ data: OutcomeIntelligence }>(
          `/outcome-intelligence?child_id=${encodeURIComponent(childId!)}`,
        )
      ).data,
  });
}

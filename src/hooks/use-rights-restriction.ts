"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./use-api";
import type {
  RestrictionOverview,
  RestrictionAnalysis,
} from "@/lib/rights-restriction/rights-restriction-engine";
import type { RestrictionReview } from "@/lib/rights-restriction/types";

/** Whole-home Rights, Liberty & Restriction overview + dashboard alerts. */
export function useRightsRestrictionOverview() {
  return useQuery({
    queryKey: ["rights-restriction", "overview"],
    queryFn: async () => (await api.get<{ data: RestrictionOverview }>(`/rights-restriction`)).data,
  });
}

export interface ChildRestrictions {
  childId: string;
  childName: string;
  reviews: { review: RestrictionReview; analysis: RestrictionAnalysis }[];
}

/** A single child's restriction reviews with per-review analysis. */
export function useChildRestrictions(childId: string | undefined) {
  return useQuery({
    queryKey: ["rights-restriction", "child", childId],
    enabled: !!childId,
    queryFn: async () =>
      (await api.get<{ data: ChildRestrictions }>(`/rights-restriction?child_id=${encodeURIComponent(childId!)}`)).data,
  });
}

/** Record a restriction review through the structured pathway. */
export function useCreateRestrictionReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<RestrictionReview>) =>
      (await api.post<{ data: { review: RestrictionReview; analysis: RestrictionAnalysis } }>(`/rights-restriction`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rights-restriction"] });
    },
  });
}

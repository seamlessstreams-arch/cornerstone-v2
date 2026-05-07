"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "./use-api";
import type { SanctionRewardEntry } from "@/types/extended";

type ListResponse = { data: SanctionRewardEntry[]; meta: { total: number } };
type SingleResponse = { data: SanctionRewardEntry };

export function useSanctionRewards(params?: { childId?: string; direction?: string }) {
  const qs = new URLSearchParams();
  if (params?.childId) qs.set("child_id", params.childId);
  if (params?.direction) qs.set("direction", params.direction);
  return useQuery({
    queryKey: ["sanction-rewards", params],
    queryFn: () => api.get<ListResponse>(`/sanction-rewards?${qs.toString()}`),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateSanctionReward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SanctionRewardEntry>) =>
      api.post<SingleResponse>("/sanction-rewards", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sanction-rewards"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateSanctionReward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<SanctionRewardEntry>) =>
      api.patch<SingleResponse>(`/sanction-rewards/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sanction-rewards"] });
    },
  });
}

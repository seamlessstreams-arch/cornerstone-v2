"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "./use-api";
import type { KeyWorkingSession } from "@/types/extended";

type ListResponse = { data: KeyWorkingSession[]; meta: { total: number; this_week: number } };
type SingleResponse = { data: KeyWorkingSession };

export function useKeyWorkingSessions(params?: { childId?: string; staffId?: string }) {
  const qs = new URLSearchParams();
  if (params?.childId) qs.set("child_id", params.childId);
  if (params?.staffId) qs.set("staff_id", params.staffId);
  return useQuery({
    queryKey: ["key-working-sessions", params],
    queryFn: () => api.get<ListResponse>(`/key-working?${qs.toString()}`),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateKeyWorkingSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<KeyWorkingSession>) =>
      api.post<SingleResponse>("/key-working", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["key-working-sessions"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateKeyWorkingSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<KeyWorkingSession>) =>
      api.patch<SingleResponse>("/key-working", { id, ...data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["key-working-sessions"] });
    },
  });
}

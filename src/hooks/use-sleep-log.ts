"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "./use-api";
import type { SleepLogEntry } from "@/types/extended";

type ListResponse = { data: SleepLogEntry[]; meta: { total: number } };
type SingleResponse = { data: SleepLogEntry };

export function useSleepLog() {
  return useQuery({
    queryKey: ["sleep-log"],
    queryFn: () => api.get<ListResponse>("/sleep-log"),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateSleepLogEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SleepLogEntry>) =>
      api.post<SingleResponse>("/sleep-log", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sleep-log"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateSleepLogEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<SleepLogEntry>) =>
      api.patch<SingleResponse>(`/sleep-log/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sleep-log"] });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "./use-api";
import type { Compliment } from "@/types/extended";

type ListResponse = { data: Compliment[]; meta: { total: number } };
type SingleResponse = { data: Compliment };

export function useCompliments() {
  return useQuery({
    queryKey: ["compliments"],
    queryFn: () => api.get<ListResponse>("/compliments"),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateCompliment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Compliment>) =>
      api.post<SingleResponse>("/compliments", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["compliments"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateCompliment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Compliment>) =>
      api.patch<SingleResponse>(`/compliments/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["compliments"] });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "./use-api";
import type { DelegatedAuthority } from "@/types/extended";

type ListResponse = { data: DelegatedAuthority[]; meta: { total: number } };
type SingleResponse = { data: DelegatedAuthority };

export function useDelegatedAuthority(params?: { childId?: string }) {
  const qs = new URLSearchParams();
  if (params?.childId) qs.set("child_id", params.childId);
  return useQuery({
    queryKey: ["delegated-authority", params],
    queryFn: () => api.get<ListResponse>(`/delegated-authority?${qs.toString()}`),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateDelegatedAuthority() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DelegatedAuthority>) =>
      api.post<SingleResponse>("/delegated-authority", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delegated-authority"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateDelegatedAuthority() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<DelegatedAuthority>) =>
      api.patch<SingleResponse>(`/delegated-authority/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delegated-authority"] });
    },
  });
}

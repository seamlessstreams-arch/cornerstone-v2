"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "./use-api";
import type { YPFeedbackEntry } from "@/types/extended";

type ListResponse = { data: YPFeedbackEntry[]; meta: { total: number } };
type SingleResponse = { data: YPFeedbackEntry };

export function useYPFeedback(params?: { childId?: string }) {
  const qs = new URLSearchParams();
  if (params?.childId) qs.set("child_id", params.childId);
  return useQuery({
    queryKey: ["yp-feedback", params],
    queryFn: () => api.get<ListResponse>(`/yp-feedback?${qs.toString()}`),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateYPFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<YPFeedbackEntry>) =>
      api.post<SingleResponse>("/yp-feedback", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["yp-feedback"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateYPFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<YPFeedbackEntry>) =>
      api.patch<SingleResponse>(`/yp-feedback/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["yp-feedback"] });
    },
  });
}

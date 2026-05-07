"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "./use-api";
import type { HouseMeeting } from "@/types/extended";

type ListResponse = { data: HouseMeeting[]; meta: { total: number } };
type SingleResponse = { data: HouseMeeting };

export function useHouseMeetings() {
  return useQuery({
    queryKey: ["house-meetings"],
    queryFn: () => api.get<ListResponse>("/house-meetings"),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateHouseMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<HouseMeeting>) =>
      api.post<SingleResponse>("/house-meetings", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["house-meetings"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateHouseMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<HouseMeeting>) =>
      api.patch<SingleResponse>(`/house-meetings/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["house-meetings"] });
    },
  });
}

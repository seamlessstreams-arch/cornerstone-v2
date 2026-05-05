"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./use-api";
import type { ShiftSwapRequest } from "@/types/extended";

export function useShiftSwaps() {
  return useQuery({
    queryKey: ["shift-swaps"],
    queryFn: () => api.get<{ data: ShiftSwapRequest[] }>("/rota/swaps"),
  });
}

export interface CreateSwapInput {
  requester_id: string;
  target_staff_id: string;
  requester_shift_id: string;
  target_shift_id?: string | null;
  reason: string;
}

export function useCreateSwapRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSwapInput) =>
      api.post<{ data: ShiftSwapRequest }>("/rota/swaps", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shift-swaps"] });
    },
  });
}

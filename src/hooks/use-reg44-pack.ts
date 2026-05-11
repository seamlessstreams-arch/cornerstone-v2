"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/hooks/use-api";
import type { Reg44Pack } from "@/lib/care-events/reg44-pack";

interface Resp { data: Reg44Pack }

export function useGenerateReg44Pack(homeId: string) {
  return useMutation({
    mutationFn: (days: number) =>
      api.get<Resp>(
        `/api/v1/care-events/reg44-pack?home_id=${encodeURIComponent(homeId)}&days=${days}`,
      ),
  });
}

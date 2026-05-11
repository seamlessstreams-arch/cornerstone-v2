"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/hooks/use-api";
import type { InspectionSnapshot } from "@/lib/care-events/inspection-snapshot";

interface Response { data: InspectionSnapshot }

export function useGenerateInspectionSnapshot(homeId: string) {
  return useMutation({
    mutationFn: () =>
      api.get<Response>(
        `/api/v1/care-events/inspection-snapshot?home_id=${encodeURIComponent(homeId)}`,
      ),
  });
}

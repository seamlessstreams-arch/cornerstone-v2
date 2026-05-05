"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { StaffHandoverContext } from "@/app/api/v1/handover/staff-context/route";

export type { StaffHandoverContext };

export function useHandoverContext(staffIds: string[]) {
  const idsParam = staffIds.join(",");

  return useQuery({
    queryKey: ["handover-context", idsParam],
    queryFn: () =>
      api.get<{ data: StaffHandoverContext[] }>(
        `/handover/staff-context?staff_ids=${idsParam}`
      ),
    enabled: staffIds.length > 0,
    staleTime: 60_000,
  });
}

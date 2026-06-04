"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/hooks/use-api";
import type { ShiftAccessOverview } from "@/lib/permissions/shift-enforcement";

export type { ShiftAccessOverview } from "@/lib/permissions/shift-enforcement";

/**
 * The acting user's shift-based access overview. `preview` asks the server to show
 * what access WOULD be off shift if enforcement were enabled (display-only).
 */
export function useShiftAccess(preview = false) {
  return useQuery({
    queryKey: ["access", "shift-status", preview],
    queryFn: async () =>
      (await api.get<{ data: ShiftAccessOverview }>(`/access/shift-status${preview ? "?preview=1" : ""}`)).data,
    staleTime: 10_000,
  });
}

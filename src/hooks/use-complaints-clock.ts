"use client";

import { useQuery } from "@tanstack/react-query";
import type { ComplaintsClockResult } from "@/lib/engines/complaints-clock-engine";

export function useComplaintsClock() {
  return useQuery<ComplaintsClockResult>({
    queryKey: ["complaints-clock"],
    queryFn: async () => {
      const res = await fetch("/api/v1/complaints-clock");
      if (!res.ok) throw new Error("Failed to fetch complaints clock");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 120_000,
  });
}

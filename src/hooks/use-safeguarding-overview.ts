"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/hooks/use-api";
import type { SafeguardingOverviewResult } from "@/lib/engines/safeguarding-overview-engine";

export function useSafeguardingOverview() {
  return useQuery({
    queryKey: ["safeguarding-overview"],
    queryFn: () => api.get<{ data: SafeguardingOverviewResult }>("/safeguarding-overview"),
    staleTime: 30_000,
  });
}

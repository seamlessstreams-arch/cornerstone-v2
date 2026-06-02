"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — NIGHT MONITORING INTELLIGENCE HOOK
// React Query wrapper for /api/v1/night-monitoring
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { NightMonitoringResult } from "@/lib/engines/night-monitoring-engine";

interface NightMonitoringResponse {
  data: NightMonitoringResult;
}

export function useNightMonitoring() {
  return useQuery({
    queryKey: ["night-monitoring"],
    queryFn: () => api.get<NightMonitoringResponse>("/night-monitoring"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

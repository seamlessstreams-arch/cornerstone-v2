"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EVENT INTELLIGENCE HOOK
// React Query wrapper for /api/v1/event-intelligence
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { EventIntelligenceResult } from "@/lib/event-intelligence/event-intelligence-engine";

interface EventIntelligenceResponse {
  data: EventIntelligenceResult;
}

export function useEventIntelligence() {
  return useQuery({
    queryKey: ["event-intelligence"],
    queryFn: () => api.get<EventIntelligenceResponse>("/event-intelligence"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

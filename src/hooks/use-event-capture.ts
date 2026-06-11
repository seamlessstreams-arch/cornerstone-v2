"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — EVENT CAPTURE (write-path) HOOK
// React Query wrapper for /api/v1/event-capture
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { EventCaptureResult } from "@/lib/event-capture/event-capture-engine";

interface EventCaptureResponse {
  data: EventCaptureResult;
}

export function useEventCapture() {
  return useQuery({
    queryKey: ["event-capture"],
    queryFn: () => api.get<EventCaptureResponse>("/event-capture"),
    refetchInterval: 60_000,
  });
}

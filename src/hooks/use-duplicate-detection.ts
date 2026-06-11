"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — DUPLICATE DETECTION HOOK
// React Query wrapper for /api/v1/duplicate-detection
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { DuplicateDetectionResult } from "@/lib/duplicate-detection/duplicate-detection-engine";

interface DuplicateDetectionResponse {
  data: DuplicateDetectionResult;
}

export function useDuplicateDetection() {
  return useQuery({
    queryKey: ["duplicate-detection"],
    queryFn: () => api.get<DuplicateDetectionResponse>("/duplicate-detection"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

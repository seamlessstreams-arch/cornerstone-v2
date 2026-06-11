"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — INTEGRATION HUB HOOK
// React Query wrapper for /api/v1/integration-hub
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { IntegrationHubResult } from "@/lib/integration-hub/integration-hub-engine";

interface IntegrationHubResponse {
  data: IntegrationHubResult;
}

export function useIntegrationHub() {
  return useQuery({
    queryKey: ["integration-hub"],
    queryFn: () => api.get<IntegrationHubResponse>("/integration-hub"),
    refetchInterval: 60_000, // 60 second refresh
  });
}

"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — MANAGER ACTION INBOX HOOK
// React Query wrapper for /api/v1/manager-inbox
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { ManagerInboxResult } from "@/lib/manager-inbox/manager-inbox-engine";

interface ManagerInboxResponse {
  data: ManagerInboxResult;
}

export function useManagerInbox() {
  return useQuery({
    queryKey: ["manager-inbox"],
    queryFn: () => api.get<ManagerInboxResponse>("/manager-inbox"),
    refetchInterval: 60_000,
  });
}

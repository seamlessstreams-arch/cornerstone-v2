"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — EVIDENCE BANK HOOK
// React Query wrapper for /api/v1/evidence-bank
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { EvidenceBankResult } from "@/lib/evidence-bank/evidence-bank-engine";

interface EvidenceBankResponse {
  data: EvidenceBankResult;
}

export function useEvidenceBank() {
  return useQuery({
    queryKey: ["evidence-bank"],
    queryFn: () => api.get<EvidenceBankResponse>("/evidence-bank"),
    refetchInterval: 60_000,
  });
}

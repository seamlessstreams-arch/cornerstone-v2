"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomePocketMoneyAuditReconciliationIntelligence() {
  return useQuery({
    queryKey: ["home-pocket-money-audit-reconciliation-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-pocket-money-audit-reconciliation-intelligence");
      if (!res.ok) throw new Error("Failed to fetch pocket money audit reconciliation intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

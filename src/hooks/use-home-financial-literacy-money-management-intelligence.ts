"use client";

import { useQuery } from "@tanstack/react-query";
import type { FinancialLiteracyResult } from "@/lib/engines/home-financial-literacy-money-management-intelligence-engine";

interface FinancialLiteracyResponse { data: FinancialLiteracyResult; }

export function useHomeFinancialLiteracyMoneyManagementIntelligence() {
  return useQuery<FinancialLiteracyResponse>({
    queryKey: ["home-financial-literacy-money-management-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-financial-literacy-money-management-intelligence");
      if (!res.ok) throw new Error("Failed to fetch financial literacy & money management intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

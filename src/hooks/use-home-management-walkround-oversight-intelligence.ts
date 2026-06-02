"use client";

import { useQuery } from "@tanstack/react-query";
import type { ManagementWalkroundResult } from "@/lib/engines/home-management-walkround-oversight-intelligence-engine";

interface ManagementWalkroundResponse { data: ManagementWalkroundResult; }

export function useHomeManagementWalkroundOversightIntelligence() {
  return useQuery<ManagementWalkroundResponse>({
    queryKey: ["home-management-walkround-oversight-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-management-walkround-oversight-intelligence");
      if (!res.ok) throw new Error("Failed to fetch management walkround oversight intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

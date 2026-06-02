"use client";

import { useQuery } from "@tanstack/react-query";
import type { LadoAllegationResult } from "@/lib/engines/home-lado-allegation-management-intelligence-engine";

interface LadoAllegationResponse { data: LadoAllegationResult; }

export function useHomeLadoAllegationManagementIntelligence() {
  return useQuery<LadoAllegationResponse>({
    queryKey: ["home-lado-allegation-management-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-lado-allegation-management-intelligence");
      if (!res.ok) throw new Error("Failed to fetch LADO & allegation management intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

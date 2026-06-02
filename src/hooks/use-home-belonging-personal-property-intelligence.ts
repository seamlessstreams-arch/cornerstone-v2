"use client";

import { useQuery } from "@tanstack/react-query";
import type { BelongingPropertyResult } from "@/lib/engines/home-belonging-personal-property-intelligence-engine";

interface BelongingPropertyResponse { data: BelongingPropertyResult; }

export function useHomeBelongingPersonalPropertyIntelligence() {
  return useQuery<BelongingPropertyResponse>({
    queryKey: ["home-belonging-personal-property-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-belonging-personal-property-intelligence");
      if (!res.ok) throw new Error("Failed to fetch belonging & personal property intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

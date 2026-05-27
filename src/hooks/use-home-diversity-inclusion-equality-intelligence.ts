"use client";

import { useQuery } from "@tanstack/react-query";
import type { DiversityInclusionResult } from "@/lib/engines/home-diversity-inclusion-equality-intelligence-engine";

interface DiversityInclusionResponse { data: DiversityInclusionResult; }

export function useHomeDiversityInclusionEqualityIntelligence() {
  return useQuery<DiversityInclusionResponse>({
    queryKey: ["home-diversity-inclusion-equality-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-diversity-inclusion-equality-intelligence");
      if (!res.ok) throw new Error("Failed to fetch diversity, inclusion & equality intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

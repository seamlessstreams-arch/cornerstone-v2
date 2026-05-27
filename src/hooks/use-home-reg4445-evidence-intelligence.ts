"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeReg4445EvidenceResult } from "@/lib/engines/home-reg4445-evidence-intelligence-engine";

interface HomeReg4445EvidenceResponse { data: HomeReg4445EvidenceResult; }

export function useHomeReg4445EvidenceIntelligence() {
  return useQuery<HomeReg4445EvidenceResponse>({
    queryKey: ["home-reg4445-evidence-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-reg4445-evidence-intelligence");
      if (!res.ok) throw new Error("Failed to fetch home reg 44/45 evidence intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

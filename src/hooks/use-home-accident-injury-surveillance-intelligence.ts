"use client";

import { useQuery } from "@tanstack/react-query";
import type { AccidentInjuryResult } from "@/lib/engines/home-accident-injury-surveillance-intelligence-engine";

interface AccidentInjuryResponse { data: AccidentInjuryResult; }

export function useHomeAccidentInjurySurveillanceIntelligence() {
  return useQuery<AccidentInjuryResponse>({
    queryKey: ["home-accident-injury-surveillance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-accident-injury-surveillance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch accident injury surveillance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

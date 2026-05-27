"use client";

import { useQuery } from "@tanstack/react-query";
import type { FormulationResult } from "@/lib/engines/home-multidisciplinary-formulation-intelligence-engine";

export function useHomeMultidisciplinaryFormulationIntelligence() {
  return useQuery<{ data: FormulationResult }>({
    queryKey: ["home-multidisciplinary-formulation-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-multidisciplinary-formulation-intelligence");
      if (!res.ok) throw new Error("Failed to fetch multidisciplinary formulation intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

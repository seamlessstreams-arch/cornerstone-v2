"use client";

import { useQuery } from "@tanstack/react-query";
import type { QualityOfCareResult } from "@/lib/engines/home-quality-of-care-composite-engine";

interface QualityOfCareCompositeResponse { data: QualityOfCareResult; }

export function useHomeQualityOfCareComposite() {
  return useQuery<QualityOfCareCompositeResponse>({
    queryKey: ["home-quality-of-care-composite"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-quality-of-care-composite");
      if (!res.ok) throw new Error("Failed to fetch quality of care composite");
      return res.json();
    },
    refetchInterval: 120_000,
  });
}

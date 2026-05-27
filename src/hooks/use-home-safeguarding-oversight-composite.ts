"use client";

import { useQuery } from "@tanstack/react-query";
import type { SafeguardingCompositeResult } from "@/lib/engines/home-safeguarding-oversight-composite-engine";

interface SafeguardingOversightCompositeResponse { data: SafeguardingCompositeResult; }

export function useHomeSafeguardingOversightComposite() {
  return useQuery<SafeguardingOversightCompositeResponse>({
    queryKey: ["home-safeguarding-oversight-composite"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-safeguarding-oversight-composite");
      if (!res.ok) throw new Error("Failed to fetch safeguarding oversight composite");
      return res.json();
    },
    refetchInterval: 120_000,
  });
}

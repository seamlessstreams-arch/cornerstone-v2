"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeChildWellbeingCompositeResult } from "@/lib/engines/home-child-wellbeing-composite-engine";

interface HomeChildWellbeingCompositeResponse { data: HomeChildWellbeingCompositeResult; }

export function useHomeChildWellbeingComposite() {
  return useQuery<HomeChildWellbeingCompositeResponse>({
    queryKey: ["home-child-wellbeing-composite"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-child-wellbeing-composite");
      if (!res.ok) throw new Error("Failed to fetch child wellbeing composite");
      return res.json();
    },
    refetchInterval: 120_000,
  });
}

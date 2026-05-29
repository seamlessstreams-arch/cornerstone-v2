"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeImmunisationVaccinationComplianceIntelligence() {
  return useQuery({
    queryKey: ["home-immunisation-vaccination-compliance-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-immunisation-vaccination-compliance-intelligence");
      if (!res.ok) throw new Error("Failed to fetch immunisation vaccination compliance intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

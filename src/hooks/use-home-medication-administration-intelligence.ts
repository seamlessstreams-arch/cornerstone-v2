"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeMedicationAdministrationIntelligence() {
  return useQuery({
    queryKey: ["home-medication-administration-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-medication-administration-intelligence");
      if (!res.ok) throw new Error("Failed to fetch medication administration intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeSexualHealthRseEducationIntelligence() {
  return useQuery({
    queryKey: ["home-sexual-health-rse-education-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-sexual-health-rse-education-intelligence");
      if (!res.ok) throw new Error("Failed to fetch sexual health RSE education intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

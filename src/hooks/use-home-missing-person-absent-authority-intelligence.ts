"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeMissingPersonAbsentAuthorityIntelligence() {
  return useQuery({
    queryKey: ["home-missing-person-absent-authority-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-missing-person-absent-authority-intelligence");
      if (!res.ok) throw new Error("Failed to fetch missing person absent authority intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

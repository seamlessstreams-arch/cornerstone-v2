"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeContinencePersonalHygieneSupportIntelligence() {
  return useQuery({
    queryKey: ["home-continence-personal-hygiene-support-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-continence-personal-hygiene-support-intelligence");
      if (!res.ok) throw new Error("Failed to fetch continence personal hygiene support intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

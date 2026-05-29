"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeBirthdaySpecialOccasionCelebrationIntelligence() {
  return useQuery({
    queryKey: ["home-birthday-special-occasion-celebration-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-birthday-special-occasion-celebration-intelligence");
      if (!res.ok) throw new Error("Failed to fetch birthday special occasion celebration intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

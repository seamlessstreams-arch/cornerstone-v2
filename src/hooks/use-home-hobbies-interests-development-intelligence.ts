"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeHobbiesInterestsDevelopmentIntelligence() {
  return useQuery({
    queryKey: ["home-hobbies-interests-development-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-hobbies-interests-development-intelligence");
      if (!res.ok) throw new Error("Failed to fetch hobbies interests development intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

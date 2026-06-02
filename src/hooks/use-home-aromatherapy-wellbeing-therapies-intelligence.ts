"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeAromatherapyWellbeingTherapiesIntelligence() {
  return useQuery({
    queryKey: ["home-aromatherapy-wellbeing-therapies-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-aromatherapy-wellbeing-therapies-intelligence");
      if (!res.ok) throw new Error("Failed to fetch aromatherapy wellbeing therapies intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

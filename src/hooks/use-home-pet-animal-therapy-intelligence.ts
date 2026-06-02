"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomePetAnimalTherapyIntelligence() {
  return useQuery({
    queryKey: ["home-pet-animal-therapy-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-pet-animal-therapy-intelligence");
      if (!res.ok) throw new Error("Failed to fetch pet and animal therapy intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

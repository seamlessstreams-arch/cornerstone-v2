"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeFurnitureRoomPersonalisationIntelligence() {
  return useQuery({
    queryKey: ["home-furniture-room-personalisation-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-furniture-room-personalisation-intelligence");
      if (!res.ok) throw new Error("Failed to fetch furniture room personalisation intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

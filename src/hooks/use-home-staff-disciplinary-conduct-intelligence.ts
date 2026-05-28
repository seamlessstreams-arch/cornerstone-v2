"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeStaffDisciplinaryConductIntelligence() {
  return useQuery({
    queryKey: ["home-staff-disciplinary-conduct-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-staff-disciplinary-conduct-intelligence");
      if (!res.ok) throw new Error("Failed to fetch staff disciplinary conduct intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeStaffRotaAdequateStaffingIntelligence() {
  return useQuery({
    queryKey: ["home-staff-rota-adequate-staffing-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-staff-rota-adequate-staffing-intelligence");
      if (!res.ok) throw new Error("Failed to fetch staff rota adequate staffing intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

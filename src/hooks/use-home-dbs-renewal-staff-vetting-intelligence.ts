"use client";

import { useQuery } from "@tanstack/react-query";

export function useHomeDbsRenewalStaffVettingIntelligence() {
  return useQuery({
    queryKey: ["home-dbs-renewal-staff-vetting-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-dbs-renewal-staff-vetting-intelligence");
      if (!res.ok) throw new Error("Failed to fetch DBS renewal & staff vetting intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

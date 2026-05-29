"use client";

import { useQuery } from "@tanstack/react-query";
import type { StaffLoneWorkingResult } from "@/lib/engines/home-staff-lone-working-safety-intelligence-engine";

interface StaffLoneWorkingSafetyResponse {
  data: StaffLoneWorkingResult;
}

export function useHomeStaffLoneWorkingSafetyIntelligence() {
  return useQuery<StaffLoneWorkingSafetyResponse>({
    queryKey: ["home-staff-lone-working-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-staff-lone-working-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch staff lone working safety intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

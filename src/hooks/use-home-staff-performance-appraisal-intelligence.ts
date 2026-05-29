"use client";

import { useQuery } from "@tanstack/react-query";
import type { StaffPerformanceResult } from "@/lib/engines/home-staff-performance-appraisal-intelligence-engine";

interface StaffPerformanceAppraisalResponse { data: StaffPerformanceResult; }

export function useHomeStaffPerformanceAppraisalIntelligence() {
  return useQuery<StaffPerformanceAppraisalResponse>({
    queryKey: ["home-staff-performance-appraisal-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-staff-performance-appraisal-intelligence");
      if (!res.ok) throw new Error("Failed to fetch staff performance appraisal intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { SaferRecruitmentResult } from "@/lib/engines/home-safer-recruitment-vetting-intelligence-engine";

interface SaferRecruitmentResponse { data: SaferRecruitmentResult; }

export function useHomeSaferRecruitmentVettingIntelligence() {
  return useQuery<SaferRecruitmentResponse>({
    queryKey: ["home-safer-recruitment-vetting-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-safer-recruitment-vetting-intelligence");
      if (!res.ok) throw new Error("Failed to fetch safer recruitment & vetting intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

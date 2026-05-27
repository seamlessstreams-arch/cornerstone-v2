"use client";

import { useQuery } from "@tanstack/react-query";
import type { CamhsSpecialistResult } from "@/lib/engines/home-camhs-specialist-referral-intelligence-engine";

interface CamhsSpecialistResponse { data: CamhsSpecialistResult; }

export function useHomeCamhsSpecialistReferralIntelligence() {
  return useQuery<CamhsSpecialistResponse>({
    queryKey: ["home-camhs-specialist-referral-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-camhs-specialist-referral-intelligence");
      if (!res.ok) throw new Error("Failed to fetch CAMHS & specialist referral intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

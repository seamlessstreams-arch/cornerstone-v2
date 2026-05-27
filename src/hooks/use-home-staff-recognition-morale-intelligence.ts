"use client";

import { useQuery } from "@tanstack/react-query";
import type { StaffRecognitionMoraleResult } from "@/lib/engines/home-staff-recognition-morale-intelligence-engine";

interface StaffRecognitionMoraleResponse { data: StaffRecognitionMoraleResult; }

export function useHomeStaffRecognitionMoraleIntelligence() {
  return useQuery<StaffRecognitionMoraleResponse>({
    queryKey: ["home-staff-recognition-morale-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-staff-recognition-morale-intelligence");
      if (!res.ok) throw new Error("Failed to fetch staff recognition & morale intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

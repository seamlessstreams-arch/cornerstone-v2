"use client";

import { useQuery } from "@tanstack/react-query";
import type { StaffDebriefingResult } from "@/lib/engines/home-staff-debriefing-critical-incident-support-intelligence-engine";

interface StaffDebriefingCriticalIncidentSupportResponse { data: StaffDebriefingResult; }

export function useHomeStaffDebriefingCriticalIncidentSupportIntelligence() {
  return useQuery<StaffDebriefingCriticalIncidentSupportResponse>({
    queryKey: ["home-staff-debriefing-critical-incident-support-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home-staff-debriefing-critical-incident-support-intelligence");
      if (!res.ok) throw new Error("Failed to fetch staff debriefing & critical incident support intelligence");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

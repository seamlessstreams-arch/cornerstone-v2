"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/hooks/use-api";
import type { StaffComplianceResult } from "@/lib/engines/staff-compliance-engine";

export function useStaffCompliance() {
  return useQuery({
    queryKey: ["staff-compliance"],
    queryFn: () => api.get<{ data: StaffComplianceResult }>("/staff-compliance"),
    staleTime: 30_000,
  });
}

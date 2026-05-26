import { useQuery } from "@tanstack/react-query";
import type { StaffWellbeingResult } from "@/lib/engines/staff-wellbeing-intelligence-engine";

export function useStaffWellbeingIntelligence() {
  return useQuery<{ data: StaffWellbeingResult }>({
    queryKey: ["staff-wellbeing-intelligence"],
    queryFn: () => fetch("/api/v1/staff-wellbeing-intelligence").then((r) => r.json()),
    refetchInterval: 60_000,
  });
}

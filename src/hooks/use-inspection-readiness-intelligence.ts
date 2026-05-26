import { useQuery } from "@tanstack/react-query";
import type { InspectionReadinessResult } from "@/lib/engines/inspection-readiness-intelligence-engine";

export function useInspectionReadinessIntelligence() {
  return useQuery<{ data: InspectionReadinessResult }>({
    queryKey: ["inspection-readiness-intelligence"],
    queryFn: () => fetch("/api/v1/inspection-readiness-intelligence").then((r) => r.json()),
    refetchInterval: 60_000,
  });
}

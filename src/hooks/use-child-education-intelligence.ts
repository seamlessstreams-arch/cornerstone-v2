import { useQuery } from "@tanstack/react-query";
import type { ChildEducationIntelligenceResult } from "@/lib/engines/child-education-intelligence-engine";

export function useChildEducationIntelligence(childId: string | null) {
  return useQuery<{ data: ChildEducationIntelligenceResult }>({
    queryKey: ["child-education-intelligence", childId],
    queryFn: () =>
      fetch(`/api/v1/child-education-intelligence?childId=${encodeURIComponent(childId!)}`).then((r) => r.json()),
    enabled: !!childId,
    refetchInterval: 60_000,
  });
}

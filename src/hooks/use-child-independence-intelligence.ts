import { useQuery } from "@tanstack/react-query";
import type { ChildIndependenceResult } from "@/lib/engines/child-independence-intelligence-engine";

export function useChildIndependenceIntelligence(childId: string | null) {
  return useQuery<{ data: ChildIndependenceResult }>({
    queryKey: ["child-independence-intelligence", childId],
    queryFn: () =>
      fetch(`/api/v1/child-independence-intelligence?childId=${encodeURIComponent(childId!)}`).then((r) => r.json()),
    enabled: !!childId,
    refetchInterval: 60_000,
  });
}

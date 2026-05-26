import { useQuery } from "@tanstack/react-query";
import type { FamilyRelationshipsResult } from "@/lib/engines/family-relationships-intelligence-engine";

export function useFamilyRelationships(childId: string | null) {
  return useQuery<{ data: FamilyRelationshipsResult }>({
    queryKey: ["family-relationships-intelligence", childId],
    queryFn: () =>
      fetch(`/api/v1/family-relationships-intelligence?childId=${encodeURIComponent(childId!)}`).then((r) => r.json()),
    enabled: !!childId,
    refetchInterval: 60_000,
  });
}

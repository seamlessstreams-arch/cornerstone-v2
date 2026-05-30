import { useQuery } from "@tanstack/react-query";
import type { ChildImpactView } from "@/lib/impact/types";

export function useChildImpact(childId: string) {
  return useQuery<{ data: ChildImpactView }>({
    queryKey: ["child-impact", childId],
    queryFn: () =>
      fetch(`/api/v1/child-impact/${childId}`).then((r) => r.json()),
    enabled: !!childId,
    refetchInterval: 60_000,
  });
}

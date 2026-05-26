import { useQuery } from "@tanstack/react-query";
import type { Child360Result } from "@/lib/engines/child-360-intelligence-engine";

export function useChild360(childId: string | null) {
  return useQuery<{ data: Child360Result }>({
    queryKey: ["child-360-intelligence", childId],
    queryFn: () => fetch(`/api/v1/child-360-intelligence?childId=${childId}`).then((r) => r.json()),
    enabled: !!childId,
    refetchInterval: 60_000,
  });
}

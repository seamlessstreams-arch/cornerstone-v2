import { useQuery } from "@tanstack/react-query";
import type { ManagerBriefingResult } from "@/lib/engines/manager-briefing-intelligence-engine";

export function useManagerBriefing() {
  return useQuery<{ data: ManagerBriefingResult }>({
    queryKey: ["manager-briefing-intelligence"],
    queryFn: () => fetch("/api/v1/manager-briefing-intelligence").then((r) => r.json()),
    refetchInterval: 60_000,
  });
}

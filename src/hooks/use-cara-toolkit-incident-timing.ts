import { useQuery } from "@tanstack/react-query";
import type { IncidentTimingAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchIncidentTiming(): Promise<IncidentTimingAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/incident-timing");
  if (!res.ok) throw new Error("Failed to fetch incident timing data");
  const json = await res.json();
  return json.data as IncidentTimingAnalysis;
}

export function useCaraToolkitIncidentTiming() {
  return useQuery({
    queryKey: ["cara-toolkit-incident-timing"],
    queryFn: fetchIncidentTiming,
    staleTime: 120_000,
  });
}

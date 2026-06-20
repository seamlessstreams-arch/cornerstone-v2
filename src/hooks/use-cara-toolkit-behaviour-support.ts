import { useQuery } from "@tanstack/react-query";
import type { BehaviourSupportAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchBehaviourSupport(): Promise<BehaviourSupportAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/behaviour-support");
  if (!res.ok) throw new Error("Failed to fetch behaviour support data");
  const json = await res.json();
  return json.data as BehaviourSupportAnalysis;
}

export function useCaraToolkitBehaviourSupport() {
  return useQuery({
    queryKey: ["cara-toolkit-behaviour-support"],
    queryFn: fetchBehaviourSupport,
    staleTime: 120_000,
  });
}

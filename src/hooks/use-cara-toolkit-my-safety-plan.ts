import { useQuery } from "@tanstack/react-query";
import type { MySafetyPlanAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchMySafetyPlan(): Promise<MySafetyPlanAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/my-safety-plan");
  if (!res.ok) throw new Error("Failed to fetch safety plan data");
  const json = await res.json();
  return json.data as MySafetyPlanAnalysis;
}

export function useCaraToolkitMySafetyPlan() {
  return useQuery({
    queryKey: ["cara-toolkit-my-safety-plan"],
    queryFn: fetchMySafetyPlan,
    staleTime: 120_000,
  });
}

import { useQuery } from "@tanstack/react-query";
import type { WorkforceRiskAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchWorkforceRisk(): Promise<WorkforceRiskAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/workforce-risk");
  if (!res.ok) throw new Error("Failed to fetch workforce risk data");
  const json = await res.json();
  return json.data as WorkforceRiskAnalysis;
}

export function useCaraToolkitWorkforceRisk() {
  return useQuery({
    queryKey: ["cara-toolkit-workforce-risk"],
    queryFn: fetchWorkforceRisk,
    staleTime: 120_000,
  });
}

import { useQuery } from "@tanstack/react-query";
import type { QualityOfCareAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchQualityEvaluation(): Promise<QualityOfCareAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/quality-evaluation");
  if (!res.ok) throw new Error("Failed to fetch quality evaluation data");
  const json = await res.json();
  return json.data as QualityOfCareAnalysis;
}

export function useCaraToolkitQualityEvaluation() {
  return useQuery({
    queryKey: ["cara-toolkit-quality-evaluation"],
    queryFn: fetchQualityEvaluation,
    staleTime: 120_000,
  });
}

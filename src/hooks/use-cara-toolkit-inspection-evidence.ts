import { useQuery } from "@tanstack/react-query";
import type { InspectionEvidenceAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchInspectionEvidence(): Promise<InspectionEvidenceAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/inspection-evidence");
  if (!res.ok) throw new Error("Failed to fetch inspection evidence data");
  const json = await res.json();
  return json.data as InspectionEvidenceAnalysis;
}

export function useCaraToolkitInspectionEvidence() {
  return useQuery({
    queryKey: ["cara-toolkit-inspection-evidence"],
    queryFn: fetchInspectionEvidence,
    staleTime: 120_000,
  });
}

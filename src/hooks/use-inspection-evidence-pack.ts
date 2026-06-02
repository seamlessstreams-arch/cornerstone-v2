import { useQuery } from "@tanstack/react-query";
import type { InspectionEvidencePack } from "@/lib/evidence/types";

export function useInspectionEvidencePack() {
  return useQuery<{ data: InspectionEvidencePack }>({
    queryKey: ["inspection-evidence-pack"],
    queryFn: () =>
      fetch("/api/v1/inspection-evidence-pack").then((r) => r.json()),
    refetchInterval: 60_000,
  });
}

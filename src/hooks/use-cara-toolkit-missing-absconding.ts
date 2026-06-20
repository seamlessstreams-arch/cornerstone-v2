import { useQuery } from "@tanstack/react-query";
import type { MissingAbscondingAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchMissingAbsconding(): Promise<MissingAbscondingAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/missing-absconding");
  if (!res.ok) throw new Error("Failed to fetch missing/absconding data");
  const json = await res.json();
  return json.data as MissingAbscondingAnalysis;
}

export function useCaraToolkitMissingAbsconding() {
  return useQuery({
    queryKey: ["cara-toolkit-missing-absconding"],
    queryFn: fetchMissingAbsconding,
    staleTime: 120_000,
  });
}

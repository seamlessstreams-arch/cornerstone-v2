import { useQuery } from "@tanstack/react-query";
import type { ShowingImpactAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchShowingImpact(): Promise<ShowingImpactAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/showing-impact");
  if (!res.ok) throw new Error("Failed to fetch showing impact data");
  const json = await res.json();
  return json.data as ShowingImpactAnalysis;
}

export function useCaraToolkitShowingImpact() {
  return useQuery({
    queryKey: ["cara-toolkit-showing-impact"],
    queryFn: fetchShowingImpact,
    staleTime: 120_000,
  });
}

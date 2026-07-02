import { useQuery } from "@tanstack/react-query";
import type { LessonsLearnedAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchLessonsLearned(): Promise<LessonsLearnedAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/lessons-learned");
  if (!res.ok) throw new Error("Failed to fetch lessons learned data");
  const json = await res.json();
  return json.data as LessonsLearnedAnalysis;
}

export function useCaraToolkitLessonsLearned() {
  return useQuery({
    queryKey: ["cara-toolkit-lessons-learned"],
    queryFn: fetchLessonsLearned,
    staleTime: 120_000,
  });
}

import { useQuery } from "@tanstack/react-query";
import type { PostIncidentReflectionAnalysis } from "@/lib/cara-visual-toolkit/types";

async function fetchPostIncidentReflection(): Promise<PostIncidentReflectionAnalysis> {
  const res = await fetch("/api/v1/cara-toolkit/post-incident-reflection");
  if (!res.ok) throw new Error("Failed to fetch post-incident reflection data");
  const json = await res.json();
  return json.data as PostIncidentReflectionAnalysis;
}

export function useCaraToolkitPostIncidentReflection() {
  return useQuery({
    queryKey: ["cara-toolkit-post-incident-reflection"],
    queryFn: fetchPostIncidentReflection,
    staleTime: 120_000,
  });
}

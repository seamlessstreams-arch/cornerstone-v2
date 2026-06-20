import { useQuery } from "@tanstack/react-query";

export type OutcomeProgressChild = {
  childId: string;
  childName: string;
  totalTargets: number;
  improvingCount: number;
  stableCount: number;
  decliningCount: number;
  overdueReviews: number;
  voiceCaptured: boolean;
  voiceCount: number;
  domains: string[];
  avgRating: number | null;
  signal: "green" | "amber" | "red" | "grey";
};

export type OutcomeDomainRow = {
  domain: string;
  label: string;
  totalTargets: number;
  improving: number;
  stable: number;
  declining: number;
  avgRating: number;
};

export type OutcomeProgressData = {
  totalTargets: number;
  improvingCount: number;
  stableCount: number;
  decliningCount: number;
  overdueReviews: number;
  childrenWithVoice: number;
  totalChildren: number;
  domainBreakdown: OutcomeDomainRow[];
  childSummaries: OutcomeProgressChild[];
  concerns: string[];
  insights: string[];
  overallSignal: "green" | "amber" | "red" | "grey";
  regulatoryNote: string;
};

async function fetchOutcomeProgress(): Promise<OutcomeProgressData> {
  const res = await fetch("/api/v1/outcome-progress");
  if (!res.ok) throw new Error("Failed to fetch outcome progress");
  const json = await res.json();
  return json.data as OutcomeProgressData;
}

export function useOutcomeProgress() {
  return useQuery({
    queryKey: ["outcome-progress"],
    queryFn: fetchOutcomeProgress,
    staleTime: 120_000,
  });
}

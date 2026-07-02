import { useQuery } from "@tanstack/react-query";

export type PathwayDomainSummary = {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  signal: "green" | "amber" | "red" | "grey";
};

export type IndependenceChildProfile = {
  childId: string;
  childName: string;
  overallReadiness: number;
  status: string;
  pathwayPlanLinked: boolean;
  reviewDate: string | null;
  daysUntilReview: number | null;
  reviewOverdue: boolean;
  domains: PathwayDomainSummary[];
  weakestDomains: string[];
  strongestDomains: string[];
  signal: "green" | "amber" | "red" | "grey";
};

export type IndependencePathwayData = {
  totalChildren: number;
  childrenWithPathway: number;
  childrenWithoutPathway: number;
  avgReadiness: number | null;
  childrenNeedingAttention: number;
  overdueReviews: number;
  unlinkedPlans: number;
  childProfiles: IndependenceChildProfile[];
  insights: string[];
  overallSignal: "green" | "amber" | "red" | "grey";
  regulatoryNote: string;
};

async function fetchIndependencePathwayIntelligence(): Promise<IndependencePathwayData> {
  const res = await fetch("/api/v1/independence-pathway-intelligence");
  if (!res.ok) throw new Error("Failed to fetch independence pathway data");
  const json = await res.json();
  return json.data as IndependencePathwayData;
}

export function useIndependencePathwayIntelligence() {
  return useQuery({
    queryKey: ["independence-pathway-intelligence"],
    queryFn: fetchIndependencePathwayIntelligence,
    staleTime: 120_000,
  });
}

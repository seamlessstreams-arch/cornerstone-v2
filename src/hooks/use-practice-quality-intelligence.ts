import { useQuery } from "@tanstack/react-query";

type PracticeSignal = "concern" | "attention" | "good";

export type DomainScore = {
  domain: string;
  label: string;
  score: number;
  signal: PracticeSignal;
};

export type PracticeAssessment = {
  id: string;
  sourceType: string;
  status: string;
  overallScore: number;
  createdBy: string;
  createdAt: string;
  summary: string;
  domainScores: DomainScore[];
  hasManagerDecision: boolean;
  managerDecision: string | null;
};

export type ChildPracticeProfile = {
  childId: string;
  childName: string;
  signal: PracticeSignal;
  assessmentCount: number;
  openCount: number;
  latestOverallScore: number | null;
  weakestDomains: DomainScore[];
  assessments: PracticeAssessment[];
};

export type PracticeQualitySummary = {
  totalAssessments: number;
  openAssessments: number;
  awaitingManagerReview: number;
  avgOverallScore: number | null;
  childrenAtConcern: number;
  childrenAtAttention: number;
  overallSignal: PracticeSignal;
};

export type PracticeQualityResponse = {
  profiles: ChildPracticeProfile[];
  summary: PracticeQualitySummary;
};

async function fetchPracticeQualityIntelligence(): Promise<PracticeQualityResponse> {
  const res = await fetch("/api/v1/practice-quality-intelligence");
  if (!res.ok)
    throw new Error("Failed to fetch practice quality intelligence");
  const json = await res.json();
  return json.data as PracticeQualityResponse;
}

export function usePracticeQualityIntelligence() {
  return useQuery({
    queryKey: ["practice-quality-intelligence"],
    queryFn: fetchPracticeQualityIntelligence,
    staleTime: 120_000,
  });
}

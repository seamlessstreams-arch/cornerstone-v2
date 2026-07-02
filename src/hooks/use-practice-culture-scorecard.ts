import { useQuery } from "@tanstack/react-query";

export type RAGStatus = "progressing" | "developing" | "needs_support";

export interface ScorecardDimension {
  id: string;
  label: string;
  description: string;
  score: number;
  status: RAGStatus;
  dataPoints: number;
  improvementPrompt: string;
}

export interface ScorecardSummary {
  priorityDimension: string;
  priorityLabel: string;
  priorityPrompt: string;
  strongestDimension: string;
  strongestLabel: string;
  totalRecordsAnalysed: number;
  frameworksEngaged: number;
  totalFrameworks: number;
}

export interface PracticeCultureScorecardResponse {
  data: {
    overallScore: number;
    overallStatus: RAGStatus;
    dimensions: ScorecardDimension[];
    summary: ScorecardSummary;
  };
}

export function usePracticeCultureScorecard() {
  return useQuery<PracticeCultureScorecardResponse>({
    queryKey: ["practice-culture-scorecard"],
    queryFn: async () => {
      const res = await fetch("/api/v1/practice-culture-scorecard");
      if (!res.ok) throw new Error("Failed to fetch practice culture scorecard");
      return res.json();
    },
    staleTime: 60_000,
  });
}

import { useQuery } from "@tanstack/react-query";

export type OverallSignal = "flourishing" | "progressing" | "developing" | "needs_attention";
export type ProgressSignal = "progressing" | "stable" | "regressing";
export type OutcomeStatus = "active" | "achieved" | "on_hold" | "revised";

export interface AspirationType {
  id: string;
  domain: string;
  aspiration: string;
  childChose: boolean;
  currentRealism: string;
  stepsTaken: number;
  stepsNext: number;
  blockers: string[];
  reviewDate: string;
  reviewOverdue: boolean;
}

export interface OutcomeTargetProfile {
  id: string;
  domain: string;
  description: string;
  status: OutcomeStatus;
  direction: string;
  progressSignal: ProgressSignal;
  hasChildVoice: boolean;
  childVoice: string | null;
  reviewDate: string;
  reviewOverdue: boolean;
}

export interface ChildGoalsProfile {
  childId: string;
  childName: string;
  aspirationCount: number;
  childChosenAspirationCount: number;
  aspirations: AspirationType[];
  activeOutcomeCount: number;
  achievedOutcomeCount: number;
  progressingOutcomes: number;
  stableOutcomes: number;
  regressingOutcomes: number;
  outcomesWithChildVoice: number;
  childVoiceRate: number;
  overdueReviewCount: number;
  aspirationsWithNoOutcome: string[];
  overallSignal: OverallSignal;
  supervisionPrompt: string;
}

export interface GoalsAspirationsHomeSummary {
  totalChildren: number;
  childrenWithAspirations: number;
  childrenWithNoAspirations: number;
  childrenWithChildChosenAspiration: number;
  totalActiveOutcomes: number;
  totalAchievedOutcomes: number;
  overallProgressingRate: number;
  overallVoiceRate: number;
  overdueReviews: number;
  ofstedNote: string;
}

export interface GoalsAspirationsResponse {
  data: {
    childProfiles: ChildGoalsProfile[];
    summary: GoalsAspirationsHomeSummary;
  };
}

export function useGoalsAspirationsIntelligence() {
  return useQuery<GoalsAspirationsResponse>({
    queryKey: ["goals-aspirations-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/goals-aspirations-intelligence");
      if (!res.ok) throw new Error("Failed to fetch goals and aspirations intelligence");
      return res.json();
    },
    staleTime: 120_000,
  });
}

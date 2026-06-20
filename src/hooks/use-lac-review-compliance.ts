import { useQuery } from "@tanstack/react-query";

export type LACReviewChildProfile = {
  childId: string;
  childName: string;
  lastReviewDate: string | null;
  nextReviewDate: string | null;
  daysUntilNextReview: number | null;
  reviewOverdue: boolean;
  totalReviews: number;
  mostRecentParticipation: string | null;
  totalActions: number;
  completedActions: number;
  overdueActions: number;
  actionCompletionRate: number | null;
  signal: "green" | "amber" | "red" | "grey";
};

export type LACReviewComplianceData = {
  totalReviews: number;
  childrenWithNoReview: number;
  overdueReviews: number;
  reviewsDueSoon: number;
  totalActions: number;
  completedActions: number;
  overdueActions: number;
  childParticipationCount: number;
  totalChildren: number;
  childProfiles: LACReviewChildProfile[];
  insights: string[];
  overallSignal: "green" | "amber" | "red" | "grey";
  regulatoryNote: string;
};

async function fetchLACReviewCompliance(): Promise<LACReviewComplianceData> {
  const res = await fetch("/api/v1/lac-review-compliance");
  if (!res.ok) throw new Error("Failed to fetch LAC review compliance data");
  const json = await res.json();
  return json.data as LACReviewComplianceData;
}

export function useLACReviewCompliance() {
  return useQuery({
    queryKey: ["lac-review-compliance"],
    queryFn: fetchLACReviewCompliance,
    staleTime: 120_000,
  });
}

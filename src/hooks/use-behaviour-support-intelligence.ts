import { useQuery } from "@tanstack/react-query";

export type BSPChildProfile = {
  childId: string;
  childName: string;
  hasBSP: boolean;
  bspStatus: string | null;
  reviewDate: string | null;
  daysUntilReview: number | null;
  reviewOverdue: boolean;
  lastReviewDate: string | null;
  highSeverityBehaviours: number;
  totalBehaviours: number;
  improvingBehaviours: number;
  triggerCount: number;
  topTriggers: string[];
  hasRestrictiveInterventions: boolean;
  diagnoses: string[];
  signal: "green" | "amber" | "red" | "grey";
};

export type BehaviourSupportData = {
  totalChildren: number;
  childrenWithBSP: number;
  childrenWithoutBSP: number;
  overdueReviews: number;
  reviewsDueSoon: number;
  highSeverityTotal: number;
  improvingTotal: number;
  restrictiveInterventionCount: number;
  childProfiles: BSPChildProfile[];
  insights: string[];
  overallSignal: "green" | "amber" | "red" | "grey";
  regulatoryNote: string;
};

async function fetchBehaviourSupportIntelligence(): Promise<BehaviourSupportData> {
  const res = await fetch("/api/v1/behaviour-support-intelligence");
  if (!res.ok) throw new Error("Failed to fetch behaviour support intelligence data");
  const json = await res.json();
  return json.data as BehaviourSupportData;
}

export function useBehaviourSupportIntelligence() {
  return useQuery({
    queryKey: ["behaviour-support-intelligence"],
    queryFn: fetchBehaviourSupportIntelligence,
    staleTime: 120_000,
  });
}

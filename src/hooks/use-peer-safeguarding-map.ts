import { useQuery } from "@tanstack/react-query";

type RiskLevel = "none" | "low" | "medium" | "high";
type PairSignal = "concern" | "attention" | "stable";
type EntryType =
  | "incident"
  | "observation"
  | "positive_interaction"
  | "mediation"
  | "review";

export type PairEntry = {
  id: string;
  date: string;
  type: EntryType;
  description: string;
  staffWitness: string;
  interventionUsed: string;
  outcome: string;
};

export type PeerPairProfile = {
  id: string;
  child1Name: string;
  child2Name: string;
  quality: string;
  riskLevel: RiskLevel;
  signal: PairSignal;
  strengths: string[];
  concerns: string[];
  strategies: string[];
  recentEntries: PairEntry[];
  incidentCount14d: number;
  reviewOverdue: boolean;
  daysSinceReview: number | null;
  nextReviewDue: string | null;
  daysUntilNextReview: number | null;
  notes: string;
};

export type GroupAssessment = {
  id: string;
  assessmentDate: string;
  assessedBy: string;
  overallAtmosphere: string;
  groupStrengths: string[];
  groupConcerns: string[];
  recommendations: string[];
};

export type PeerSafeguardingMapSummary = {
  totalPairs: number;
  pairsAtConcern: number;
  pairsAtAttention: number;
  reviewsOverdue: number;
  incidentsLast14d: number;
  overallSignal: PairSignal;
};

export type PeerSafeguardingMapResponse = {
  pairs: PeerPairProfile[];
  latestGroupAssessment: GroupAssessment | null;
  summary: PeerSafeguardingMapSummary;
};

async function fetchPeerSafeguardingMap(): Promise<PeerSafeguardingMapResponse> {
  const res = await fetch("/api/v1/peer-safeguarding-map");
  if (!res.ok) throw new Error("Failed to fetch peer safeguarding map");
  const json = await res.json();
  return json.data as PeerSafeguardingMapResponse;
}

export function usePeerSafeguardingMap() {
  return useQuery({
    queryKey: ["peer-safeguarding-map"],
    queryFn: fetchPeerSafeguardingMap,
    staleTime: 120_000,
  });
}

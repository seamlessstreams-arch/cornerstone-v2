import { useQuery } from "@tanstack/react-query";

export type WellbeingDomainScore = {
  key: string;
  label: string;
  score: number | null;
};

export type ChildWellbeingProfile = {
  childId: string;
  childName: string;
  compositeScore: number;
  signal: "green" | "amber" | "red" | "grey";
  domainScores: WellbeingDomainScore[];
  strengthArea: { label: string; score: number } | null;
  concernArea:  { label: string; score: number } | null;
  recentIncidentCount: number;
  recentMissingCount: number;
  keyWorkSessions30d: number;
  activeTargets: number;
  ninetyIncidents: number;
  keyWorkTotal: number;
};

export type ChildWellbeingIndexData = {
  totalChildren: number;
  avgCompositeScore: number;
  greenCount: number;
  amberCount: number;
  redCount: number;
  overallSignal: "green" | "amber" | "red" | "grey";
  childProfiles: ChildWellbeingProfile[];
  insights: string[];
  regulatoryNote: string;
};

async function fetchChildWellbeingIndex(): Promise<ChildWellbeingIndexData> {
  const res = await fetch("/api/v1/child-wellbeing-index");
  if (!res.ok) throw new Error("Failed to fetch child wellbeing index");
  const json = await res.json();
  return json.data as ChildWellbeingIndexData;
}

export function useChildWellbeingIndex() {
  return useQuery({
    queryKey: ["child-wellbeing-index"],
    queryFn: fetchChildWellbeingIndex,
    staleTime: 120_000,
  });
}

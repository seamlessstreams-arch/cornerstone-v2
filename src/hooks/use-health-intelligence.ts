import { useQuery } from "@tanstack/react-query";

export type HealthChildProfile = {
  childId: string;
  childName: string;
  totalRecords: number;
  openConditions: number;
  allergies: string[];
  mentalHealthRecords: number;
  camhsInvolvement: boolean;
  overdueFollowUps: number;
  upcomingFollowUps: number;
  recentRecordDate: string | null;
  signal: "green" | "amber" | "red" | "grey";
};

export type HealthRecentRecord = {
  childName: string;
  type: string;
  date: string;
  title: string;
  professional: string;
  signal: "green" | "amber" | "red" | "grey";
};

export type HealthIntelligenceData = {
  totalRecords: number;
  openConditions: number;
  allergiesCount: number;
  mentalHealthRecords: number;
  camhsInvolvementCount: number;
  overdueFollowUps: number;
  upcomingFollowUps: number;
  recentRecords: HealthRecentRecord[];
  childProfiles: HealthChildProfile[];
  insights: string[];
  overallSignal: "green" | "amber" | "red" | "grey";
  regulatoryNote: string;
};

async function fetchHealthIntelligence(): Promise<HealthIntelligenceData> {
  const res = await fetch("/api/v1/health-intelligence");
  if (!res.ok) throw new Error("Failed to fetch health intelligence data");
  const json = await res.json();
  return json.data as HealthIntelligenceData;
}

export function useHealthIntelligence() {
  return useQuery({
    queryKey: ["health-intelligence"],
    queryFn: fetchHealthIntelligence,
    staleTime: 120_000,
  });
}

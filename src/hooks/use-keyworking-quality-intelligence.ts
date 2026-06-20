import { useQuery } from "@tanstack/react-query";

export type KeyworkSignal = "concern" | "attention" | "positive" | "strong";
export type OverallSignal = "concern" | "attention" | "positive";

export interface SessionSummary {
  sessionId: string;
  sessionDate: string;
  daysAgo: number;
  type: string;
  duration: number;
  childVoice: string;
  workerObservations: string;
  moodBefore: number;
  moodAfter: number;
  moodImprovement: number;
  actionsCount: number;
  overdueFollowUp: boolean;
  followUpDate: string | null;
  followUpCompleted: boolean;
  confidential: boolean;
}

export interface ChildKeyworkProfile {
  childId: string;
  childName: string;
  sessionCount: number;
  daysSinceLastSession: number | null;
  avgMoodBefore: number;
  avgMoodAfter: number;
  avgMoodImprovement: number;
  childVoicePresent: boolean;
  overdueFollowUpCount: number;
  sessionTypes: string[];
  latestChildVoice: string | null;
  latestWorkerObservation: string | null;
  signal: KeyworkSignal;
  sessions: SessionSummary[];
}

export interface KeyworkSummary {
  totalSessions: number;
  totalChildren: number;
  avgMoodImprovement: number;
  childVoiceRate: number;
  overdueFollowUpCount: number;
  overallSignal: OverallSignal;
}

export interface KeyworkingQualityResponse {
  data: {
    profiles: ChildKeyworkProfile[];
    summary: KeyworkSummary;
  };
}

export function useKeyworkingQualityIntelligence() {
  return useQuery<KeyworkingQualityResponse>({
    queryKey: ["keyworking-quality-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/keyworking-quality-intelligence");
      if (!res.ok) throw new Error("Failed to fetch keyworking quality intelligence");
      return res.json();
    },
    staleTime: 120_000,
  });
}

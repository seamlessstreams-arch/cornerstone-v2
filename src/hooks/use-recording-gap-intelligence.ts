import { useQuery } from "@tanstack/react-query";

export type GapSeverity = "critical" | "warning" | "current";
export type RecordingDomain = "daily_log" | "key_working" | "lac_review" | "welfare_check";

export interface DomainGap {
  domain: RecordingDomain;
  domainLabel: string;
  severity: GapSeverity;
  daysSinceLastRecord: number | null;
  lastRecordDate: string | null;
  overdueMessage: string;
}

export interface ChildRecordingProfile {
  childId: string;
  childName: string;
  placementDays: number;
  gaps: DomainGap[];
  criticalGapCount: number;
  warningGapCount: number;
  overallSeverity: GapSeverity;
  supervisionPrompt: string;
}

export interface DomainSummary {
  domain: RecordingDomain;
  domainLabel: string;
  childrenWithCritical: number;
  childrenWithWarning: number;
  totalChildrenAffected: number;
}

export interface RecordingGapSummary {
  totalCurrentChildren: number;
  childrenWithCriticalGap: number;
  childrenWithAnyGap: number;
  totalCriticalGaps: number;
  totalWarningGaps: number;
  domainSummaries: DomainSummary[];
  ofstedNote: string;
}

export interface RecordingGapIntelligenceResponse {
  data: {
    childProfiles: ChildRecordingProfile[];
    summary: RecordingGapSummary;
  };
}

export function useRecordingGapIntelligence() {
  return useQuery<RecordingGapIntelligenceResponse>({
    queryKey: ["recording-gap-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/recording-gap-intelligence");
      if (!res.ok) throw new Error("Failed to fetch recording gap intelligence");
      return res.json();
    },
    staleTime: 60_000,
  });
}

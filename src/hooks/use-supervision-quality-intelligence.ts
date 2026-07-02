import { useQuery } from "@tanstack/react-query";

export type SupervisionStatus = "current" | "due_soon" | "overdue" | "never";
export type SupervisionSignal = "excellent" | "good" | "developing" | "at_risk";
export type WellbeingTrend = "improving" | "stable" | "declining";

export interface OverdueAction {
  action: string;
  due: string;
  owner: string;
}

export interface StaffSupervisionProfile {
  staffId: string;
  staffName: string;
  jobTitle: string;
  supervisionCount: number;
  daysSinceLastSupervision: number | null;
  supervisionStatus: SupervisionStatus;
  latestWellbeingScore: number | null;
  wellbeingTrend: WellbeingTrend | null;
  latestConfidenceScore: number | null;
  paceEngagementRate: number;
  overdueActions: OverdueAction[];
  overdueActionCount: number;
  trainingNeeds: string[];
  followUpOverdue: boolean;
  signal: SupervisionSignal;
  supervisionPrompt: string;
}

export interface SupervisionQualitySummary {
  totalActiveStaff: number;
  staffWithCurrentSupervision: number;
  staffDueSoon: number;
  staffOverdue: number;
  staffNeverSupervised: number;
  currentSupervisionRate: number;
  averageWellbeingScore: number | null;
  totalOverdueActions: number;
  staffAtRisk: number;
  ofstedNote: string;
}

export interface SupervisionQualityResponse {
  data: {
    staffProfiles: StaffSupervisionProfile[];
    summary: SupervisionQualitySummary;
  };
}

export function useSupervisionQualityIntelligence() {
  return useQuery<SupervisionQualityResponse>({
    queryKey: ["supervision-quality-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/supervision-quality-intelligence");
      if (!res.ok) throw new Error("Failed to fetch supervision quality intelligence");
      return res.json();
    },
    staleTime: 120_000,
  });
}

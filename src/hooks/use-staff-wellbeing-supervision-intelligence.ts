import { useQuery } from "@tanstack/react-query";

export type WellbeingSignal = "support_needed" | "attention" | "positive" | "thriving";
export type TeamSignal = "concern" | "attention" | "positive" | "thriving";

export interface SupervisionAction {
  action: string;
  owner: string;
  due: string;
  done: boolean;
  overdue: boolean;
}

export interface StaffWellbeingProfile {
  staffId: string;
  staffName: string;
  supervisorName: string;
  sessionDate: string;
  daysSinceSession: number;
  wellbeingScore: number;
  confidenceLevel: number;
  emotionalWellbeing: string;
  workloadNote: string;
  paceExamples: string;
  managerFeedback: string;
  trainingNeeds: string[];
  followUpDate: string | null;
  followUpOverdue: boolean;
  actions: SupervisionAction[];
  overdueActionsCount: number;
  signal: WellbeingSignal;
}

export interface TrainingNeedCount {
  need: string;
  count: number;
}

export interface WellbeingSummary {
  totalSupervisions: number;
  avgWellbeingScore: number;
  avgConfidenceLevel: number;
  supportNeededCount: number;
  overdueFollowUps: number;
  overdueActionsTotal: number;
  topTrainingNeeds: TrainingNeedCount[];
  teamSignal: TeamSignal;
}

export interface StaffWellbeingSupervisionResponse {
  data: {
    supervisions: StaffWellbeingProfile[];
    summary: WellbeingSummary;
  };
}

export function useStaffWellbeingSupervisionIntelligence() {
  return useQuery<StaffWellbeingSupervisionResponse>({
    queryKey: ["staff-wellbeing-supervision-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/staff-wellbeing-supervision-intelligence");
      if (!res.ok) throw new Error("Failed to fetch staff wellbeing supervision intelligence");
      return res.json();
    },
    staleTime: 120_000,
  });
}

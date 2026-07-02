import { useQuery } from "@tanstack/react-query";

export type ChildPISignal = "concerning" | "monitoring" | "stable" | "improving";
export type PITrend = "increasing" | "stable" | "decreasing";

export interface ChildPIProfile {
  childId: string;
  childName: string;
  totalRestraints: number;
  last30d: number;
  prior30d: number;
  trend: PITrend;
  avgDurationMinutes: number;
  deEscalationRate: number;
  debriefRate: number;
  staffDebriefRate: number;
  injuryCount: number;
  pendingReviewCount: number;
  recentAntecedents: string[];
  recentTypes: string[];
  signal: ChildPISignal;
  supervisionPrompt: string;
}

export interface StaffPIProfile {
  staffId: string;
  staffName: string;
  leadCount: number;
  supportCount: number;
  totalInvolvements: number;
  deEscalationDocumentedOnLeads: number;
  deEscalationRateOnLeads: number;
}

export interface AntecedentFrequency {
  antecedent: string;
  count: number;
}

export interface PhysicalInterventionSummary {
  totalRestraints: number;
  totalLast30d: number;
  totalPrior30d: number;
  homeTrend: PITrend;
  pendingReviews: number;
  childrenWithPendingDebrief: number;
  totalInjuries: number;
  avgDurationMinutes: number;
  commonAntecedents: AntecedentFrequency[];
  ofstedNote: string;
}

export interface PhysicalInterventionPatternResponse {
  data: {
    childProfiles: ChildPIProfile[];
    staffProfiles: StaffPIProfile[];
    summary: PhysicalInterventionSummary;
  };
}

export function usePhysicalInterventionPatternIntelligence() {
  return useQuery<PhysicalInterventionPatternResponse>({
    queryKey: ["physical-intervention-pattern-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/physical-intervention-pattern-intelligence");
      if (!res.ok) throw new Error("Failed to fetch physical intervention pattern intelligence");
      return res.json();
    },
    staleTime: 120_000,
  });
}

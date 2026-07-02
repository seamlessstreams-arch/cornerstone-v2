import { useQuery } from "@tanstack/react-query";

export type CumulativeSignal = "escalating" | "concerning" | "stable" | "improving";
export type SignalDirection = "worsening" | "stable" | "improving";
export type SupervisionPriority = "urgent" | "this_week" | "monitor" | "none";

export interface RiskSignal {
  id: string;
  label: string;
  direction: SignalDirection;
  recent: number;
  prior: number;
  note: string;
}

export interface ChildCumulativeProfile {
  childId: string;
  childName: string;
  signal: CumulativeSignal;
  worseningSignals: number;
  improvingSignals: number;
  signals: RiskSignal[];
  supervisionPriority: SupervisionPriority;
  supervisionPrompt: string;
  incidentsLast30d: number;
  incidentsLast90d: number;
  missingsLast30d: number;
  highSeverityLast30d: number;
  safeguardingTypeLast30d: number;
}

export interface SignalSummary {
  escalatingCount: number;
  concerningCount: number;
  stableCount: number;
  improvingCount: number;
  urgentSupervisionCount: number;
  mostCommonWorseningSignal: string;
}

export interface CumulativeRiskIntelligenceResponse {
  data: {
    childProfiles: ChildCumulativeProfile[];
    summary: SignalSummary;
  };
}

export function useCumulativeRiskIntelligence() {
  return useQuery<CumulativeRiskIntelligenceResponse>({
    queryKey: ["cumulative-risk-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/cumulative-risk-intelligence");
      if (!res.ok) throw new Error("Failed to fetch cumulative risk intelligence");
      return res.json();
    },
    staleTime: 60_000,
  });
}

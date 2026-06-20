import { useQuery } from "@tanstack/react-query";

export type ErrorSignal = "alert" | "attention" | "monitoring" | "safe";

export interface PendingAction {
  action: string;
  owner: string;
  dueDate: string;
  overdue: boolean;
}

export interface ChildErrorProfile {
  childId: string;
  childName: string;
  totalErrors: number;
  last30dErrors: number;
  severityBreakdown: Record<string, number>;
  mostCommonErrorType: string | null;
  openDoC: boolean;
  docCompletionDate: string | null;
  pendingActions: PendingAction[];
  openOrActiveErrors: number;
  recentMedications: string[];
  signal: ErrorSignal;
  supervisionPrompt: string;
}

export interface HomePattern {
  factorLabel: string;
  count: number;
}

export interface MedicationErrorSummary {
  totalErrors: number;
  last30dErrors: number;
  openErrors: number;
  moderateOrSevereCount: number;
  openDoCCount: number;
  overdueActionsCount: number;
  topContributingFactors: HomePattern[];
  recurringErrorTypes: HomePattern[];
  eveningRoundRisk: boolean;
  ofstedNote: string;
}

export interface MedicationErrorPatternResponse {
  data: {
    childProfiles: ChildErrorProfile[];
    summary: MedicationErrorSummary;
  };
}

export function useMedicationErrorPatternIntelligence() {
  return useQuery<MedicationErrorPatternResponse>({
    queryKey: ["medication-error-pattern-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/medication-error-pattern-intelligence");
      if (!res.ok) throw new Error("Failed to fetch medication error pattern intelligence");
      return res.json();
    },
    staleTime: 120_000,
  });
}

import { useQuery } from "@tanstack/react-query";

export type RiskAssessmentChildProfile = {
  childId: string;
  childName: string;
  totalAssessments: number;
  overdueAssessments: number;
  dueWithin14Days: number;
  highOrVeryHighDomains: string[];
  improvingDomains: string[];
  decliningDomains: string[];
  domainsCovered: string[];
  daysUntilEarliestReview: number | null;
  signal: "green" | "amber" | "red" | "grey";
};

export type RiskAssessmentCurrencyData = {
  totalAssessments: number;
  overdueAssessments: number;
  dueWithin14Days: number;
  highRiskCount: number;
  veryHighRiskCount: number;
  improvingCount: number;
  decliningCount: number;
  childProfiles: RiskAssessmentChildProfile[];
  insights: string[];
  overallSignal: "green" | "amber" | "red" | "grey";
  regulatoryNote: string;
};

async function fetchRiskAssessmentCurrency(): Promise<RiskAssessmentCurrencyData> {
  const res = await fetch("/api/v1/risk-assessment-currency");
  if (!res.ok) throw new Error("Failed to fetch risk assessment currency data");
  const json = await res.json();
  return json.data as RiskAssessmentCurrencyData;
}

export function useRiskAssessmentCurrency() {
  return useQuery({
    queryKey: ["risk-assessment-currency"],
    queryFn: fetchRiskAssessmentCurrency,
    staleTime: 120_000,
  });
}

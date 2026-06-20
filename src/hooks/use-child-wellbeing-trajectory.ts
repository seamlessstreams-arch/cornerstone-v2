import { useQuery } from "@tanstack/react-query";

export type DomainTrajectory = "improving" | "stable" | "declining";
export type OverallTrajectory = "thriving" | "progressing" | "holding" | "struggling" | "crisis";

export interface WellbeingDomain {
  name: string;
  trajectory: DomainTrajectory;
  detail: string;
  numerator: number;
  denominator: number;
}

export interface ChildWellbeingProfile {
  childId: string;
  childName: string;
  placementDays: number;
  domains: WellbeingDomain[];
  improvingDomains: number;
  decliningDomains: number;
  overallTrajectory: OverallTrajectory;
  narrativeSummary: string;
  supervisionPrompt: string;
}

export interface WellbeingTrajectorySummary {
  totalChildren: number;
  thriving: number;
  progressing: number;
  holding: number;
  struggling: number;
  crisis: number;
  homeTrend: "positive" | "mixed" | "concerning";
  priorityChildren: string[];
  ofstedNote: string;
}

export interface ChildWellbeingTrajectoryResponse {
  data: {
    childProfiles: ChildWellbeingProfile[];
    summary: WellbeingTrajectorySummary;
  };
}

export function useChildWellbeingTrajectory() {
  return useQuery<ChildWellbeingTrajectoryResponse>({
    queryKey: ["child-wellbeing-trajectory"],
    queryFn: async () => {
      const res = await fetch("/api/v1/child-wellbeing-trajectory");
      if (!res.ok) throw new Error("Failed to fetch child wellbeing trajectory");
      return res.json();
    },
    staleTime: 120_000,
  });
}

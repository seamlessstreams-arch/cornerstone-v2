import { useQuery } from "@tanstack/react-query";

export type ApproachType = "therapeutic" | "boundary" | "physical" | "undocumented";
export type ConsistencyLevel = "consistent" | "mixed" | "divergent";

export interface StaffApproachProfile {
  staffId: string;
  staffName: string;
  totalEntries: number;
  therapeuticCount: number;
  boundaryCount: number;
  physicalCount: number;
  undocumentedCount: number;
  therapeuticRate: number;
  dominantApproach: ApproachType;
}

export interface ChildConsistencyProfile {
  childId: string;
  childName: string;
  totalEntries: number;
  staffProfiles: StaffApproachProfile[];
  consistencyLevel: ConsistencyLevel;
  overallTherapeuticRate: number;
  therapeuticRateVariance: number;
  mostTherapeuticStaff: string | null;
  leastTherapeuticStaff: string | null;
  supervisionPrompt: string;
}

export interface ApproachSummary {
  totalChildren: number;
  consistentCount: number;
  mixedCount: number;
  divergentCount: number;
  overallTherapeuticRate: number;
  mostCommonDivergencePattern: string;
}

export interface TeamApproachConsistencyResponse {
  data: {
    childProfiles: ChildConsistencyProfile[];
    summary: ApproachSummary;
  };
}

export function useTeamApproachConsistency() {
  return useQuery<TeamApproachConsistencyResponse>({
    queryKey: ["team-approach-consistency"],
    queryFn: async () => {
      const res = await fetch("/api/v1/team-approach-consistency");
      if (!res.ok) throw new Error("Failed to fetch team approach consistency");
      return res.json();
    },
    staleTime: 120_000,
  });
}

import { useQuery } from "@tanstack/react-query";

export type RelationalStatus = "secure" | "developing" | "fragile";
export type KeyWorkFrequency = "regular" | "intermittent" | "absent";

export interface StaffSnapshot {
  id: string;
  fullName: string;
  jobTitle: string;
}

export interface ChildRelationalProfile {
  childId: string;
  childName: string;
  placementStatus: string;
  keyWorkerAssigned: boolean;
  keyWorker: StaffSnapshot | null;
  secondaryWorker: StaffSnapshot | null;
  totalKeyWorkSessions: number;
  sessionsLast30d: number;
  sessionsLast90d: number;
  lastKeyWorkDate: string | null;
  keyWorkFrequency: KeyWorkFrequency;
  keyWorkStaffIds: string[];
  hasPaceProfile: boolean;
  trustedAdultCount: number;
  trustedAdults: string[];
  incidentsLast30d: number;
  incidentsLast90d: number;
  status: RelationalStatus;
  statusReason: string;
  supervisionPrompt: string;
}

export interface RelationalSafetyMapSummary {
  totalChildren: number;
  secureCount: number;
  developingCount: number;
  fragileCount: number;
  noKeyWorkerAssigned: number;
  noKeyWorkLast30d: number;
  noPaceProfile: number;
  fragileWithElevatedIncidents: number;
  overallStatus: "positive" | "mixed" | "concern";
}

export interface RelationalSafetyMapResponse {
  data: {
    childProfiles: ChildRelationalProfile[];
    summary: RelationalSafetyMapSummary;
  };
}

export function useRelationalSafetyMap() {
  return useQuery<RelationalSafetyMapResponse>({
    queryKey: ["relational-safety-map"],
    queryFn: async () => {
      const res = await fetch("/api/v1/relational-safety-map");
      if (!res.ok) throw new Error("Failed to fetch relational safety map");
      return res.json();
    },
    staleTime: 60_000,
  });
}

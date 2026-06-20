import { useQuery } from "@tanstack/react-query";

type RelationshipSignal = "good" | "attention" | "concern";

export type StaffInteraction = {
  staffId: string;
  staffName: string;
  role: string;
  recordingCount: number;
  positiveCount: number;
  concerningCount: number;
  isKeyWorker: boolean;
  isSecondaryWorker: boolean;
};

export type ChildRelationshipProfile = {
  childId: string;
  childName: string;
  designatedKeyWorkerName: string | null;
  designatedSecondaryWorkerName: string | null;
  totalRecordings: number;
  keyWorkerRecordingPct: number | null;
  keyWorkerRank: number | null;
  staffInteractions: StaffInteraction[];
  signal: RelationshipSignal;
  insight: string;
};

export type RelationshipIndexSummary = {
  totalChildren: number;
  childrenAtGood: number;
  childrenAtAttention: number;
  childrenAtConcern: number;
  overallSignal: RelationshipSignal;
};

export type StaffChildRelationshipResponse = {
  profiles: ChildRelationshipProfile[];
  summary: RelationshipIndexSummary;
};

async function fetchStaffChildRelationshipIndex(): Promise<StaffChildRelationshipResponse> {
  const res = await fetch("/api/v1/staff-child-relationship-index");
  if (!res.ok) throw new Error("Failed to fetch staff-child relationship index");
  const json = await res.json();
  return json.data as StaffChildRelationshipResponse;
}

export function useStaffChildRelationshipIndex() {
  return useQuery({
    queryKey: ["staff-child-relationship-index"],
    queryFn: fetchStaffChildRelationshipIndex,
    staleTime: 120_000,
  });
}

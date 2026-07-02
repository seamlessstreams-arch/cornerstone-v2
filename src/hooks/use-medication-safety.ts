import { useQuery } from "@tanstack/react-query";

export type MedicationChildProfile = {
  childId: string;
  childName: string;
  activeMedications: number;
  totalDoses: number;
  givenDoses: number;
  lateDoses: number;
  refusedDoses: number;
  missedDoses: number;
  complianceRate: number | null;
  concerns: string[];
  recentConcernStatus: string | null;
  recentConcernDate: string | null;
  recentConcernNotes: string | null;
  signal: "green" | "amber" | "red" | "grey";
};

export type MedicationSafetyData = {
  totalDoses: number;
  givenDoses: number;
  lateDoses: number;
  refusedDoses: number;
  missedDoses: number;
  withheldDoses: number;
  complianceRate: number;
  administeredWithoutWitness: number;
  childProfiles: MedicationChildProfile[];
  insights: string[];
  overallSignal: "green" | "amber" | "red" | "grey";
  regulatoryNote: string;
};

async function fetchMedicationSafety(): Promise<MedicationSafetyData> {
  const res = await fetch("/api/v1/medication-safety");
  if (!res.ok) throw new Error("Failed to fetch medication safety data");
  const json = await res.json();
  return json.data as MedicationSafetyData;
}

export function useMedicationSafety() {
  return useQuery({
    queryKey: ["medication-safety"],
    queryFn: fetchMedicationSafety,
    staleTime: 120_000,
  });
}

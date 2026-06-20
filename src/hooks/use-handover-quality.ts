import { useQuery } from "@tanstack/react-query";

export type HandoverChildProfile = {
  childId: string;
  childName: string;
  alertCount: number;
  topAlerts: string[];
  avgMoodScore: number | null;
  handoverCount: number;
  signal: "green" | "amber" | "red" | "grey";
};

export type HandoverSummary = {
  id: string;
  date: string;
  time: string;
  from: string;
  to: string;
  completed: boolean;
  flagCount: number;
  signOffCount: number;
  linkedIncidents: number;
  generalNotes: string | null;
};

export type FlagEntry = {
  flag: string;
  count: number;
  formattedFlag: string;
};

export type HandoverQualityData = {
  totalHandovers: number;
  completedHandovers: number;
  completionRate: number | null;
  unsignedHandovers: number;
  handoversWithFlags: number;
  handoversWithIncidents: number;
  topFlags: FlagEntry[];
  childProfiles: HandoverChildProfile[];
  recentSummaries: HandoverSummary[];
  insights: string[];
  overallSignal: "green" | "amber" | "red" | "grey";
  regulatoryNote: string;
};

async function fetchHandoverQuality(): Promise<HandoverQualityData> {
  const res = await fetch("/api/v1/handover-quality");
  if (!res.ok) throw new Error("Failed to fetch handover quality data");
  const json = await res.json();
  return json.data as HandoverQualityData;
}

export function useHandoverQuality() {
  return useQuery({
    queryKey: ["handover-quality"],
    queryFn: fetchHandoverQuality,
    staleTime: 120_000,
  });
}

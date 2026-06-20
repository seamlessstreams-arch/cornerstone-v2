import { useQuery } from "@tanstack/react-query";

export type VoiceEntry = {
  source: "outcome_target" | "key_work";
  date: string;
  domain: string | null;
  domainLabel: string | null;
  text: string;
  targetDescription: string | null;
};

export type EnrichedVoiceEntry = VoiceEntry & {
  childName: string;
  childId: string;
};

export type ChildVoiceProfile = {
  childId: string;
  childName: string;
  totalVoices: number;
  targetVoiceCount: number;
  kwVoiceCount: number;
  hasVoice: boolean;
  allVoices: VoiceEntry[];
  mostRecentVoice: VoiceEntry | null;
  domainsMissingVoice: string[];
  coveredDomainCount: number;
  totalDomainCount: number;
};

export type GoalsAspirationsData = {
  totalChildren: number;
  childrenWithVoice: number;
  childrenWithoutVoice: number;
  totalVoices: number;
  overallSignal: "green" | "amber" | "red" | "grey";
  childVoiceProfiles: ChildVoiceProfile[];
  recentVoices: EnrichedVoiceEntry[];
  insights: string[];
  regulatoryNote: string;
};

async function fetchGoalsAspirations(): Promise<GoalsAspirationsData> {
  const res = await fetch("/api/v1/goals-aspirations");
  if (!res.ok) throw new Error("Failed to fetch goals and aspirations data");
  const json = await res.json();
  return json.data as GoalsAspirationsData;
}

export function useGoalsAspirations() {
  return useQuery({
    queryKey: ["goals-aspirations"],
    queryFn: fetchGoalsAspirations,
    staleTime: 120_000,
  });
}

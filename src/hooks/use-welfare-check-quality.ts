import { useQuery } from "@tanstack/react-query";

export type WelfareChildProfile = {
  childId: string;
  childName: string;
  totalChecks: number;
  okCount: number;
  asleepCount: number;
  awakeCount: number;
  concernCount: number;
  notInRoomCount: number;
  signal: "green" | "amber" | "red" | "grey";
};

export type WelfareCheckQualityData = {
  totalRounds: number;
  totalChecks: number;
  buildingSecureRate: number | null;
  overnightCoverage: number;
  checkStatusBreakdown: {
    ok: number;
    asleep: number;
    awake: number;
    concern: number;
    not_in_room: number;
    refused: number;
  };
  concernChecks: number;
  escalatedConcerns: number;
  unescalatedConcerns: number;
  notInRoomChecks: number;
  physicalMarksNoted: number;
  childProfiles: WelfareChildProfile[];
  insights: string[];
  overallSignal: "green" | "amber" | "red" | "grey";
  regulatoryNote: string;
};

async function fetchWelfareCheckQuality(): Promise<WelfareCheckQualityData> {
  const res = await fetch("/api/v1/welfare-check-quality");
  if (!res.ok) throw new Error("Failed to fetch welfare check quality data");
  const json = await res.json();
  return json.data as WelfareCheckQualityData;
}

export function useWelfareCheckQuality() {
  return useQuery({
    queryKey: ["welfare-check-quality"],
    queryFn: fetchWelfareCheckQuality,
    staleTime: 120_000,
  });
}

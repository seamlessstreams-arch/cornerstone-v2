import { useQuery } from "@tanstack/react-query";

export type EducationSignal = "thriving" | "engaged" | "vulnerable" | "crisis";

export interface ChildEducationProfile {
  childId: string;
  childName: string;
  currentSchool: string | null;
  schoolChanges: number;
  attendanceRecords: number;
  presentCount: number;
  absentCount: number;
  excludedCount: number;
  attendanceRate: number;
  exclusionCount: number;
  hasPEPInLast6Months: boolean;
  lastPEPDate: string | null;
  achievementCount: number;
  openConcernCount: number;
  monitoringCount: number;
  staffAttendedMeetings: boolean;
  signal: EducationSignal;
  supervisionPrompt: string;
}

export interface EducationStabilitySummary {
  totalChildren: number;
  thriving: number;
  engaged: number;
  vulnerable: number;
  crisis: number;
  homeAttendanceRate: number;
  childrenWithCurrentPEP: number;
  childrenWithExclusions: number;
  totalAchievements: number;
  ofstedNote: string;
}

export interface EducationStabilityResponse {
  data: {
    childProfiles: ChildEducationProfile[];
    summary: EducationStabilitySummary;
  };
}

export function useEducationStabilityIntelligence() {
  return useQuery<EducationStabilityResponse>({
    queryKey: ["education-stability-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/education-stability-intelligence");
      if (!res.ok) throw new Error("Failed to fetch education stability intelligence");
      return res.json();
    },
    staleTime: 120_000,
  });
}

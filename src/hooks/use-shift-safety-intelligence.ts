import { useQuery } from "@tanstack/react-query";

export type StaffShiftSignal = "at_risk" | "monitoring" | "good";

export interface StaffShiftProfile {
  staffId: string;
  staffName: string;
  totalShifts: number;
  totalShiftMinutes: number;
  totalOvertimeMinutes: number;
  sleepInCount: number;
  dayShiftCount: number;
  longShiftCount: number;
  lateArrivalCount: number;
  noShowCount: number;
  openShiftCount: number;
  signal: StaffShiftSignal;
  supervisionNote: string;
}

export interface OpenShift {
  shiftId: string;
  date: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  notes: string | null;
}

export interface ShiftSafetySummary {
  totalShifts: number;
  todayShifts: number;
  openShiftsToday: number;
  openShiftsTotal: number;
  totalOvertimeMinutes: number;
  longShiftsCount: number;
  lateArrivalsCount: number;
  uniqueStaffWorked: number;
  openShifts: OpenShift[];
  ofstedNote: string;
}

export interface ShiftSafetyResponse {
  data: {
    staffProfiles: StaffShiftProfile[];
    summary: ShiftSafetySummary;
  };
}

export function useShiftSafetyIntelligence() {
  return useQuery<ShiftSafetyResponse>({
    queryKey: ["shift-safety-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/shift-safety-intelligence");
      if (!res.ok) throw new Error("Failed to fetch shift safety intelligence");
      return res.json();
    },
    staleTime: 120_000,
  });
}

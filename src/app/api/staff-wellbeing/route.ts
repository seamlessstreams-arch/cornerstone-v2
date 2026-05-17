// ══════════════════════════════════════════════════════════════════════════════
// API: /api/staff-wellbeing — Staff Wellbeing & Resilience
//
// GET  — returns home metrics, individual assessments, or dashboard data
// POST — assess individual staff member or calculate custom metrics
//
// CHR 2015 Reg 33 — Employment of staff
// SCCIF — Workforce stability and wellbeing
// H&S at Work Act 1974 — Employer duty of care
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  assessStaffWellbeing,
  calculateHomeWellbeingMetrics,
} from "@/lib/staff-wellbeing";
import type { StaffWellbeingRecord } from "@/lib/staff-wellbeing";

// ── GET Handler ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const homeId = url.searchParams.get("homeId") ?? "home-oak";
  const mode = url.searchParams.get("mode") ?? "dashboard";
  const now = new Date().toISOString();

  const records = getDemoRecords(homeId);

  if (mode === "metrics") {
    return NextResponse.json(calculateHomeWellbeingMetrics(records, homeId, now));
  }

  if (mode === "assessments") {
    const assessments = records.map(r => assessStaffWellbeing(r, now));
    return NextResponse.json({ assessments });
  }

  // Default: dashboard — metrics + individual summaries
  const metrics = calculateHomeWellbeingMetrics(records, homeId, now);
  const assessments = records.map(r => assessStaffWellbeing(r, now));

  return NextResponse.json({
    metrics,
    assessments,
  });
}

// ── POST Handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "assess") {
    const { record, now } = body;
    if (!record) {
      return NextResponse.json({ error: "record required" }, { status: 400 });
    }
    return NextResponse.json(assessStaffWellbeing(record as StaffWellbeingRecord, now));
  }

  if (action === "metrics") {
    const { records, homeId, now } = body;
    if (!records || !homeId) {
      return NextResponse.json({ error: "records and homeId required" }, { status: 400 });
    }
    return NextResponse.json(calculateHomeWellbeingMetrics(records as StaffWellbeingRecord[], homeId, now));
  }

  return NextResponse.json({ error: "Invalid action. Use 'assess' or 'metrics'" }, { status: 400 });
}

// ── Demo Data ─────────────────────────────────────────────────────────────

function getDemoRecords(homeId: string): StaffWellbeingRecord[] {
  return [
    {
      staffId: "staff-rm-01",
      staffName: "Claire Edwards",
      homeId,
      role: "Registered Manager",
      startDate: "2021-06-01T00:00:00Z",
      contractedHours: 40,
      isAgency: false,
      wellbeingCheckins: [
        { date: "2026-04-05T10:00:00Z", overallRating: 3, workloadManageable: false, feelingSupported: true, sleepQuality: 3, workLifeBalance: 2, teamRelationships: 4, recordedBy: "staff-ri-01" },
        { date: "2026-04-20T10:00:00Z", overallRating: 3, workloadManageable: false, feelingSupported: true, sleepQuality: 3, workLifeBalance: 3, teamRelationships: 4, recordedBy: "staff-ri-01" },
        { date: "2026-05-05T10:00:00Z", overallRating: 4, workloadManageable: true, feelingSupported: true, sleepQuality: 4, workLifeBalance: 3, teamRelationships: 4, recordedBy: "staff-ri-01" },
      ],
      absences: [
        { id: "abs-rm-1", type: "annual_leave", startDate: "2026-03-15T00:00:00Z", endDate: "2026-03-21T00:00:00Z", totalDays: 5, returnToWorkDone: false, fitNote: false },
      ],
      supervisionAttendance: 100,
      lastSupervisionDate: "2026-05-08T10:00:00Z",
      reflectivePracticeEngagement: 85,
      overtimeHoursLast30Days: 12,
      consecutiveShiftsMax: 5,
      sleepInCountLast30Days: 0,
      restrictedPracticeInvolvement: 0,
      activeSupport: [],
    },
    {
      staffId: "staff-sw-01",
      staffName: "Marcus Campbell",
      homeId,
      role: "Senior Residential Worker",
      startDate: "2022-09-01T00:00:00Z",
      contractedHours: 37.5,
      isAgency: false,
      wellbeingCheckins: [
        { date: "2026-04-08T10:00:00Z", overallRating: 4, workloadManageable: true, feelingSupported: true, sleepQuality: 4, workLifeBalance: 4, teamRelationships: 5, recordedBy: "staff-rm-01" },
        { date: "2026-04-22T10:00:00Z", overallRating: 4, workloadManageable: true, feelingSupported: true, sleepQuality: 3, workLifeBalance: 4, teamRelationships: 5, recordedBy: "staff-rm-01" },
        { date: "2026-05-06T10:00:00Z", overallRating: 4, workloadManageable: true, feelingSupported: true, sleepQuality: 4, workLifeBalance: 4, teamRelationships: 5, recordedBy: "staff-rm-01" },
      ],
      absences: [
        { id: "abs-sw-1", type: "sick_short_term", startDate: "2026-02-10T00:00:00Z", endDate: "2026-02-11T00:00:00Z", totalDays: 2, returnToWorkDone: true, fitNote: false },
      ],
      supervisionAttendance: 95,
      lastSupervisionDate: "2026-05-02T10:00:00Z",
      reflectivePracticeEngagement: 80,
      overtimeHoursLast30Days: 6,
      consecutiveShiftsMax: 4,
      sleepInCountLast30Days: 4,
      restrictedPracticeInvolvement: 2,
      activeSupport: [],
    },
    {
      staffId: "staff-rw-01",
      staffName: "Priya Sharma",
      homeId,
      role: "Residential Worker",
      startDate: "2024-01-15T00:00:00Z",
      contractedHours: 37.5,
      isAgency: false,
      wellbeingCheckins: [
        { date: "2026-04-10T10:00:00Z", overallRating: 3, workloadManageable: true, feelingSupported: false, sleepQuality: 2, workLifeBalance: 3, teamRelationships: 4, recordedBy: "staff-rm-01" },
        { date: "2026-04-24T10:00:00Z", overallRating: 2, workloadManageable: false, feelingSupported: false, sleepQuality: 2, workLifeBalance: 2, teamRelationships: 3, recordedBy: "staff-rm-01" },
        { date: "2026-05-08T10:00:00Z", overallRating: 2, workloadManageable: false, feelingSupported: false, sleepQuality: 2, workLifeBalance: 2, teamRelationships: 3, recordedBy: "staff-rm-01" },
      ],
      absences: [
        { id: "abs-rw-1", type: "stress_related", startDate: "2026-03-01T00:00:00Z", endDate: "2026-03-07T00:00:00Z", totalDays: 5, reason: "Anxiety", returnToWorkDone: true, fitNote: true },
        { id: "abs-rw-2", type: "sick_short_term", startDate: "2026-04-15T00:00:00Z", endDate: "2026-04-16T00:00:00Z", totalDays: 2, returnToWorkDone: true, fitNote: false },
      ],
      supervisionAttendance: 75,
      lastSupervisionDate: "2026-04-28T10:00:00Z",
      reflectivePracticeEngagement: 45,
      overtimeHoursLast30Days: 18,
      consecutiveShiftsMax: 5,
      sleepInCountLast30Days: 6,
      restrictedPracticeInvolvement: 4,
      activeSupport: ["counselling_referral", "supervision_increase"],
    },
    {
      staffId: "staff-rw-02",
      staffName: "Jake Turner",
      homeId,
      role: "Residential Worker",
      startDate: "2025-04-01T00:00:00Z",
      contractedHours: 37.5,
      isAgency: false,
      wellbeingCheckins: [
        { date: "2026-04-12T10:00:00Z", overallRating: 4, workloadManageable: true, feelingSupported: true, sleepQuality: 4, workLifeBalance: 4, teamRelationships: 4, recordedBy: "staff-sw-01" },
        { date: "2026-04-26T10:00:00Z", overallRating: 4, workloadManageable: true, feelingSupported: true, sleepQuality: 4, workLifeBalance: 3, teamRelationships: 4, recordedBy: "staff-sw-01" },
        { date: "2026-05-10T10:00:00Z", overallRating: 4, workloadManageable: true, feelingSupported: true, sleepQuality: 4, workLifeBalance: 4, teamRelationships: 5, recordedBy: "staff-sw-01" },
      ],
      absences: [],
      supervisionAttendance: 100,
      lastSupervisionDate: "2026-05-03T10:00:00Z",
      reflectivePracticeEngagement: 70,
      overtimeHoursLast30Days: 4,
      consecutiveShiftsMax: 3,
      sleepInCountLast30Days: 3,
      restrictedPracticeInvolvement: 1,
      activeSupport: [],
    },
    {
      staffId: "staff-ag-01",
      staffName: "Daniel Okonkwo",
      homeId,
      role: "Agency Worker",
      startDate: "2026-04-01T00:00:00Z",
      contractedHours: 37.5,
      isAgency: true,
      wellbeingCheckins: [
        { date: "2026-05-01T10:00:00Z", overallRating: 3, workloadManageable: true, feelingSupported: true, sleepQuality: 3, workLifeBalance: 3, teamRelationships: 3, recordedBy: "staff-rm-01" },
      ],
      absences: [],
      supervisionAttendance: 50,
      lastSupervisionDate: "2026-05-01T10:00:00Z",
      reflectivePracticeEngagement: 30,
      overtimeHoursLast30Days: 8,
      consecutiveShiftsMax: 4,
      sleepInCountLast30Days: 2,
      restrictedPracticeInvolvement: 1,
      activeSupport: [],
    },
  ];
}

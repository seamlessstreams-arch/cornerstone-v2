// ==============================================================================
// API: /api/sleep-hygiene-quality
//
// Sleep Hygiene Quality Intelligence
//
// GET  — Returns assessment with Oak House demo data
// POST — Accepts custom data and returns tailored assessment
// ==============================================================================

import { NextResponse } from "next/server";
import {
  generateSleepHygieneQualityIntelligence,
  getSleepEnvironmentRatingLabel,
  getSleepDisruptionTypeLabel,
  getSleepQualityRatingLabel,
  getRoutineAdherenceLabel,
  getNightCheckOutcomeLabel,
  getRatingLabel,
} from "@/lib/sleep-hygiene-quality";
import type {
  SleepEnvironmentAudit,
  SleepRoutineRecord,
  SleepOutcomeRecord,
  StaffSleepTraining,
} from "@/lib/sleep-hygiene-quality";

// -- Demo Data: Oak House -------------------------------------------------------

const DEMO_AUDITS: SleepEnvironmentAudit[] = [
  { id: "aud-1", childId: "child-alex", childName: "Alex", auditDate: "2026-04-01", auditedBy: "Darren Laville", bedroomTemperatureOk: true, lightingAdequate: true, noiseLevel: "good", beddingCleanComfortable: true, personalItemsAllowed: true, blackoutAvailable: true, overallRating: "excellent" },
  { id: "aud-2", childId: "child-jordan", childName: "Jordan", auditDate: "2026-04-01", auditedBy: "Darren Laville", bedroomTemperatureOk: true, lightingAdequate: true, noiseLevel: "good", beddingCleanComfortable: true, personalItemsAllowed: true, blackoutAvailable: true, overallRating: "good" },
  { id: "aud-3", childId: "child-morgan", childName: "Morgan", auditDate: "2026-04-01", auditedBy: "Darren Laville", bedroomTemperatureOk: true, lightingAdequate: true, noiseLevel: "excellent", beddingCleanComfortable: true, personalItemsAllowed: true, blackoutAvailable: true, overallRating: "excellent" },
];

const DEMO_ROUTINES: SleepRoutineRecord[] = [
  { id: "rt-1", childId: "child-alex", childName: "Alex", date: "2026-05-12", bedtimeTarget: "21:30", actualBedtime: "21:25", windDownActivityOffered: true, screenFreeBeforeBed: true, routineAdherence: "fully_followed", staffSupporting: "Sarah Johnson" },
  { id: "rt-2", childId: "child-alex", childName: "Alex", date: "2026-05-13", bedtimeTarget: "21:30", actualBedtime: "21:30", windDownActivityOffered: true, screenFreeBeforeBed: true, routineAdherence: "fully_followed", staffSupporting: "Tom Richards" },
  { id: "rt-3", childId: "child-jordan", childName: "Jordan", date: "2026-05-12", bedtimeTarget: "21:00", actualBedtime: "21:15", windDownActivityOffered: true, screenFreeBeforeBed: true, routineAdherence: "mostly_followed", staffSupporting: "Lisa Williams" },
  { id: "rt-4", childId: "child-jordan", childName: "Jordan", date: "2026-05-13", bedtimeTarget: "21:00", actualBedtime: "20:55", windDownActivityOffered: true, screenFreeBeforeBed: true, routineAdherence: "fully_followed", staffSupporting: "Sarah Johnson" },
  { id: "rt-5", childId: "child-morgan", childName: "Morgan", date: "2026-05-12", bedtimeTarget: "22:00", actualBedtime: "21:50", windDownActivityOffered: true, screenFreeBeforeBed: true, routineAdherence: "fully_followed", staffSupporting: "Tom Richards" },
  { id: "rt-6", childId: "child-morgan", childName: "Morgan", date: "2026-05-13", bedtimeTarget: "22:00", actualBedtime: "22:00", windDownActivityOffered: true, screenFreeBeforeBed: true, routineAdherence: "fully_followed", staffSupporting: "Lisa Williams" },
];

const DEMO_OUTCOMES: SleepOutcomeRecord[] = [
  { id: "out-1", childId: "child-alex", childName: "Alex", date: "2026-05-13", sleepQuality: "very_good", hoursSlept: 8.5, disruptions: ["none"], childSelfReport: true, wakeFeeling: "rested", nightChecks: ["sleeping_peacefully", "sleeping_peacefully"] },
  { id: "out-2", childId: "child-alex", childName: "Alex", date: "2026-05-14", sleepQuality: "good", hoursSlept: 8, disruptions: ["none"], childSelfReport: true, wakeFeeling: "rested", nightChecks: ["sleeping_peacefully", "sleeping_peacefully"] },
  { id: "out-3", childId: "child-jordan", childName: "Jordan", date: "2026-05-13", sleepQuality: "good", hoursSlept: 7.5, disruptions: ["none"], childSelfReport: true, wakeFeeling: "rested", nightChecks: ["sleeping_peacefully", "awake_settled"] },
  { id: "out-4", childId: "child-jordan", childName: "Jordan", date: "2026-05-14", sleepQuality: "fair", hoursSlept: 6.5, disruptions: ["anxiety_at_bedtime"], childSelfReport: true, wakeFeeling: "tired", nightChecks: ["awake_unsettled", "sleeping_peacefully"] },
  { id: "out-5", childId: "child-morgan", childName: "Morgan", date: "2026-05-13", sleepQuality: "very_good", hoursSlept: 9, disruptions: ["none"], childSelfReport: true, wakeFeeling: "rested", nightChecks: ["sleeping_peacefully"] },
  { id: "out-6", childId: "child-morgan", childName: "Morgan", date: "2026-05-14", sleepQuality: "good", hoursSlept: 8, disruptions: ["none"], childSelfReport: true, wakeFeeling: "rested", nightChecks: ["sleeping_peacefully", "sleeping_peacefully"] },
];

const DEMO_TRAINING: StaffSleepTraining[] = [
  { id: "tr-1", staffId: "staff-sarah", staffName: "Sarah Johnson", sleepHygieneAwareness: true, nightCareProtocol: true, traumaInformedSleep: true, sleepDisorderAwareness: true, bedtimeRoutinesTrained: true, nightCheckProcedures: true },
  { id: "tr-2", staffId: "staff-tom", staffName: "Tom Richards", sleepHygieneAwareness: true, nightCareProtocol: true, traumaInformedSleep: true, sleepDisorderAwareness: false, bedtimeRoutinesTrained: true, nightCheckProcedures: true },
  { id: "tr-3", staffId: "staff-lisa", staffName: "Lisa Williams", sleepHygieneAwareness: true, nightCareProtocol: true, traumaInformedSleep: true, sleepDisorderAwareness: true, bedtimeRoutinesTrained: true, nightCheckProcedures: true },
  { id: "tr-4", staffId: "staff-darren", staffName: "Darren Laville", sleepHygieneAwareness: true, nightCareProtocol: true, traumaInformedSleep: true, sleepDisorderAwareness: true, bedtimeRoutinesTrained: true, nightCheckProcedures: true },
];

// -- GET ------------------------------------------------------------------------

export async function GET() {
  const result = generateSleepHygieneQualityIntelligence(
    DEMO_AUDITS,
    DEMO_ROUTINES,
    DEMO_OUTCOMES,
    DEMO_TRAINING,
    "oak-house",
    "2026-01-01",
    "2026-05-18",
  );

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        sleepEnvironmentRatingLabels: Object.fromEntries(
          (["excellent", "good", "adequate", "poor"] as const).map((r) => [r, getSleepEnvironmentRatingLabel(r)]),
        ),
        sleepDisruptionTypeLabels: Object.fromEntries(
          (["nightmares", "insomnia", "night_waking", "sleepwalking", "anxiety_at_bedtime", "noise_disturbance", "peer_disturbance", "pain_discomfort", "medication_side_effect", "none"] as const).map((t) => [t, getSleepDisruptionTypeLabel(t)]),
        ),
        sleepQualityRatingLabels: Object.fromEntries(
          (["very_good", "good", "fair", "poor", "very_poor"] as const).map((r) => [r, getSleepQualityRatingLabel(r)]),
        ),
        routineAdherenceLabels: Object.fromEntries(
          (["fully_followed", "mostly_followed", "partially_followed", "not_followed"] as const).map((a) => [a, getRoutineAdherenceLabel(a)]),
        ),
        nightCheckOutcomeLabels: Object.fromEntries(
          (["sleeping_peacefully", "awake_settled", "awake_unsettled", "not_in_room", "required_intervention"] as const).map((o) => [o, getNightCheckOutcomeLabel(o)]),
        ),
        ratingLabels: Object.fromEntries(
          (["outstanding", "good", "requires_improvement", "inadequate"] as const).map((r) => [r, getRatingLabel(r)]),
        ),
      },
    },
  });
}

// -- POST -----------------------------------------------------------------------

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { audits, routines, outcomes, training, homeId, periodStart, periodEnd } = body as {
    audits?: SleepEnvironmentAudit[];
    routines?: SleepRoutineRecord[];
    outcomes?: SleepOutcomeRecord[];
    training?: StaffSleepTraining[];
    homeId?: string;
    periodStart?: string;
    periodEnd?: string;
  };

  if (!periodStart || !periodEnd) {
    return NextResponse.json({ error: "periodStart and periodEnd are required" }, { status: 400 });
  }

  const result = generateSleepHygieneQualityIntelligence(
    audits ?? [],
    routines ?? [],
    outcomes ?? [],
    training ?? [],
    homeId ?? "unknown",
    periodStart,
    periodEnd,
  );

  return NextResponse.json({ data: result });
}

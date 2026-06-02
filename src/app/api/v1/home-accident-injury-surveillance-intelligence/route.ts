import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeAccidentInjurySurveillance,
  type AccidentRecordInput,
  type InjuryRecordInput,
  type SafetyCheckInput,
} from "@/lib/engines/home-accident-injury-surveillance-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.children ?? store.youngPeople ?? [];
  const staff = store.staff ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Accident records
  const accidentBook = (store.accidentBook as any[] ?? []);
  const accidents: AccidentRecordInput[] = accidentBook.map((a: any) => ({
    id: a.id ?? "",
    child_id: a.child_id ?? a.young_person_id ?? null,
    staff_id: a.staff_id ?? null,
    date: (a.date ?? a.accident_date ?? today).toString().slice(0, 10),
    severity: a.severity ?? "minor",
    location: a.location ?? a.area ?? "unknown",
    type: a.type ?? a.accident_type ?? "other",
    investigated: !!(a.investigated ?? a.investigation_completed),
    debrief_completed: !!(a.debrief_completed ?? a.debrief),
    hospital_visit: !!(a.hospital_visit ?? a.hospital ?? a.a_and_e),
    riddor_reportable: !!(a.riddor_reportable ?? a.riddor),
  }));

  // Child injury records
  const childInjuries = (store.childInjuryRecords as any[] ?? []);
  const injuries: InjuryRecordInput[] = childInjuries.map((i: any) => ({
    id: i.id ?? "",
    child_id: i.child_id ?? i.young_person_id ?? "",
    date: (i.date ?? i.injury_date ?? today).toString().slice(0, 10),
    origin: i.origin ?? i.cause ?? i.type ?? "accidental",
    body_map_completed: !!(i.body_map_completed ?? i.body_map),
    photographed: !!(i.photographed ?? i.photo_taken),
    reported_to_social_worker: !!(i.reported_to_social_worker ?? i.sw_notified ?? i.social_worker_informed),
  }));

  // Safety checks
  const safetyChecks = (store.safetyCheckRecords as any[] ?? []);
  const safety_checks: SafetyCheckInput[] = safetyChecks.map((c: any) => ({
    id: c.id ?? "",
    date: (c.date ?? c.check_date ?? today).toString().slice(0, 10),
    area: c.area ?? c.location ?? "general",
    passed: !!(c.passed ?? c.status === "passed"),
    issues_found: c.issues_found ?? c.issues ?? 0,
    issues_resolved: c.issues_resolved ?? c.resolved ?? 0,
  }));

  // Debrief records
  const debriefs = (store.debriefRecords as any[] ?? []);
  const debriefCompleted = debriefs.filter((d: any) => d.completed || d.status === "completed").length;

  const result = computeAccidentInjurySurveillance({
    today,
    total_children: (children as any[]).length,
    total_staff: (staff as any[]).length,
    accidents,
    injuries,
    safety_checks,
    debrief_records_total: debriefs.length,
    debrief_records_completed: debriefCompleted,
  });

  return NextResponse.json({ data: result });
}

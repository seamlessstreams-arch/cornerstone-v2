import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeWorkforceResilience,
  type StaffResilienceSnapshot,
  type HomeLevelWorkforce,
} from "@/lib/engines/home-workforce-resilience-composite-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const staff = store.staff ?? [];
  const youngPeople = store.youngPeople ?? [];

  const staff_snapshots: StaffResilienceSnapshot[] = staff.map((s: any) => {
    const staffId = s.id;

    // Supervision
    const supervisions = (store.supervisions as any[] ?? []).filter((sv: any) => sv.staff_id === staffId || sv.staffId === staffId);
    const supCompleted = supervisions.filter((sv: any) => sv.completed || sv.status === "completed").length;
    const supDue = supervisions.length;

    // Training
    const trainingRecords = (store.trainingRecords as any[] ?? []).filter((t: any) => t.staff_id === staffId || t.staffId === staffId);
    const mandatoryTraining = trainingRecords.filter((t: any) => t.mandatory || t.type === "mandatory");
    const mandatoryCurrent = mandatoryTraining.length === 0 || mandatoryTraining.every((t: any) => t.completed || t.status === "completed" || t.up_to_date);

    // Qualifications
    const qualifications = (store.qualifications as any[] ?? []).filter((q: any) => q.staff_id === staffId || q.staffId === staffId);
    const qualsMet = qualifications.length === 0 || qualifications.every((q: any) => q.met || q.status === "met" || q.verified);

    // Sickness
    const sicknessRecords = (store.staffSicknessRecords as any[] ?? []).filter((sr: any) => sr.staff_id === staffId || sr.staffId === staffId);
    const sicknessDays = sicknessRecords.reduce((sum: number, sr: any) => sum + (sr.days ?? sr.duration ?? 1), 0);

    // Development plan
    const devPlans = (store.developmentPlans as any[] ?? []).filter((dp: any) => dp.staff_id === staffId || dp.staffId === staffId);
    const hasDev = devPlans.length > 0;

    // Practice observations
    const observations = (store.practiceObservations as any[] ?? []).filter((po: any) => po.staff_id === staffId || po.staffId === staffId);
    const obsCount = observations.length;

    // Recognition
    const recognitions = (store.staffRecognitionRecords as any[] ?? []).filter((r: any) => r.staff_id === staffId || r.staffId === staffId);
    const recCount = recognitions.length;

    // Grievance
    const grievances = (store.staffGrievanceRecords as any[] ?? []).filter((g: any) => g.staff_id === staffId || g.staffId === staffId);
    const grievanceActive = grievances.some((g: any) => g.status === "active" || g.status === "open");

    // Wellbeing
    const wellbeingRecords = (store.staffWellbeingRecords as any[] ?? []).filter((w: any) => w.staff_id === staffId || w.staffId === staffId);
    const latestWb = wellbeingRecords.length > 0 ? wellbeingRecords.sort((a: any, b: any) => (b.date ?? "").localeCompare(a.date ?? ""))[0] : null;
    const wbScore = latestWb?.score ?? latestWb?.wellbeing_score ?? null;

    // DBS / induction
    const dbsCurrent = !!(s.dbs_current ?? s.dbsCurrent ?? s.dbs_valid);
    const inductionRecords = (store.staffInductionRecords as any[] ?? []).filter((ir: any) => ir.staff_id === staffId || ir.staffId === staffId);
    const inductionCompleted = inductionRecords.some((ir: any) => ir.completed || ir.status === "completed") || !!(s.induction_completed);

    return {
      staff_id: staffId,
      supervision_completed: supCompleted,
      supervision_due: supDue,
      mandatory_training_current: mandatoryCurrent,
      qualifications_met: qualsMet,
      sickness_days_90d: sicknessDays,
      has_development_plan: hasDev,
      practice_observations: obsCount,
      recognition_count: recCount,
      grievance_active: grievanceActive,
      wellbeing_score: wbScore,
      dbs_current: dbsCurrent,
      induction_completed: inductionCompleted,
    };
  });

  // Home-level metrics
  const vacancies = (store.vacancies as any[] ?? []);
  const openVacancies = vacancies.filter((v: any) => v.status === "open" || v.status === "active" || !v.filled);
  const shifts = store.shifts ?? [];
  const shiftsTotal = (shifts as any[]).length;
  const shiftsCovered = (shifts as any[]).filter((sh: any) => sh.covered || sh.status === "covered" || sh.staff_id || sh.staffId).length;
  const agencyStaff = (store.agencyStaffRecords as any[] ?? []).filter((a: any) => a.active || a.status === "active");
  const handovers = (store.handovers as any[] ?? []);
  const handoverCompleted = (handovers as any[]).filter((h: any) => h.completed || h.status === "completed").length;
  const handoverRate = handovers.length > 0 ? Math.round((handoverCompleted / handovers.length) * 100) : 90;
  const loneIncidents = (store.loneWorkingRecords as any[] ?? []).filter((l: any) => l.incident || l.type === "incident").length;
  const exitInterviews = (store.staffExitInterviewRecords as any[] ?? []);
  const exitConducted = exitInterviews.filter((e: any) => e.completed || e.status === "completed").length;

  const home_level: HomeLevelWorkforce = {
    vacancy_count: openVacancies.length,
    vacancy_total_posts: Math.max(staff.length + openVacancies.length, 1),
    shifts_covered: shiftsCovered,
    shifts_total: shiftsTotal,
    agency_staff_in_use: agencyStaff.length,
    lone_working_incidents: loneIncidents,
    handover_completion_rate: handoverRate,
    exit_interviews_conducted: exitConducted,
    exit_interviews_due: exitInterviews.length,
  };

  const result = computeWorkforceResilience({
    today: new Date().toISOString().slice(0, 10),
    total_staff: staff.length,
    staff_snapshots,
    home_level,
  });

  return NextResponse.json({ data: result });
}

// ══════════════════════════════════════════════════════════════════════════════
// Environmental Safety & Maintenance API Route
//
// GET  ?homeId=...&mode=dashboard|metrics|compliance
// POST { action: "evaluate"|"metrics", ... }
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateEnvironmentCompliance,
  calculateHomeEnvironmentMetrics,
  getCheckCategoryLabel,
  getMaintenancePriorityLabel,
  getMaintenanceStatusLabel,
} from "@/lib/environment";
import type { SafetyCheck, FireDrill, MaintenanceRequest } from "@/lib/environment";

// ── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_CHECKS: SafetyCheck[] = [
  { id: "chk-01", homeId: "home-oak", category: "fire_alarm_weekly", lastCompletedDate: "2026-05-14T10:00:00Z", nextDueDate: "2026-05-21T10:00:00Z", frequencyDays: 7, completedBy: "staff-sw-01", status: "current", outcome: "pass" },
  { id: "chk-02", homeId: "home-oak", category: "emergency_lighting_monthly", lastCompletedDate: "2026-05-01T10:00:00Z", nextDueDate: "2026-06-01T10:00:00Z", frequencyDays: 30, completedBy: "staff-sw-01", status: "current", outcome: "pass" },
  { id: "chk-03", homeId: "home-oak", category: "fire_extinguisher_annual", lastCompletedDate: "2026-02-15T10:00:00Z", nextDueDate: "2027-02-15T10:00:00Z", frequencyDays: 365, completedBy: "Chubb Fire", status: "current", outcome: "pass", certificateRef: "CHB-2026-1423" },
  { id: "chk-04", homeId: "home-oak", category: "fire_risk_assessment", lastCompletedDate: "2026-03-01T10:00:00Z", nextDueDate: "2027-03-01T10:00:00Z", frequencyDays: 365, completedBy: "FireSafe Ltd", status: "current", outcome: "pass", certificateRef: "FS-26-0891" },
  { id: "chk-05", homeId: "home-oak", category: "smoke_detectors", lastCompletedDate: "2026-05-14T10:00:00Z", nextDueDate: "2026-05-21T10:00:00Z", frequencyDays: 7, completedBy: "staff-sw-02", status: "current", outcome: "pass" },
  { id: "chk-06", homeId: "home-oak", category: "co_detectors", lastCompletedDate: "2026-05-14T10:00:00Z", nextDueDate: "2026-05-21T10:00:00Z", frequencyDays: 7, completedBy: "staff-sw-02", status: "current", outcome: "pass" },
  { id: "chk-07", homeId: "home-oak", category: "gas_safety_cp12", lastCompletedDate: "2026-01-20T10:00:00Z", nextDueDate: "2027-01-20T10:00:00Z", frequencyDays: 365, completedBy: "Gas Safe Engineer", status: "current", outcome: "pass", certificateRef: "GS-260120-4521" },
  { id: "chk-08", homeId: "home-oak", category: "electrical_eicr", lastCompletedDate: "2024-06-01T10:00:00Z", nextDueDate: "2029-06-01T10:00:00Z", frequencyDays: 1825, completedBy: "Sparks Electrical", status: "current", outcome: "pass", certificateRef: "EICR-2024-2890" },
  { id: "chk-09", homeId: "home-oak", category: "pat_testing", lastCompletedDate: "2026-01-15T10:00:00Z", nextDueDate: "2027-01-15T10:00:00Z", frequencyDays: 365, completedBy: "PAT Pro Services", status: "current", outcome: "pass" },
  { id: "chk-10", homeId: "home-oak", category: "legionella_assessment", lastCompletedDate: "2025-11-01T10:00:00Z", nextDueDate: "2026-11-01T10:00:00Z", frequencyDays: 365, completedBy: "Water Hygiene Ltd", status: "current", outcome: "pass", certificateRef: "WH-2025-6672" },
  { id: "chk-11", homeId: "home-oak", category: "legionella_monitoring", lastCompletedDate: "2026-05-01T10:00:00Z", nextDueDate: "2026-06-01T10:00:00Z", frequencyDays: 30, completedBy: "staff-rm-01", status: "current", outcome: "pass" },
  { id: "chk-12", homeId: "home-oak", category: "water_temperature", lastCompletedDate: "2026-05-14T10:00:00Z", nextDueDate: "2026-05-21T10:00:00Z", frequencyDays: 7, completedBy: "staff-sw-01", status: "current", outcome: "pass" },
  { id: "chk-13", homeId: "home-oak", category: "window_restrictors", lastCompletedDate: "2026-04-01T10:00:00Z", nextDueDate: "2026-07-01T10:00:00Z", frequencyDays: 90, completedBy: "staff-rm-01", status: "current", outcome: "pass" },
  { id: "chk-14", homeId: "home-oak", category: "first_aid_kits", lastCompletedDate: "2026-05-01T10:00:00Z", nextDueDate: "2026-05-29T10:00:00Z", frequencyDays: 30, completedBy: "staff-sw-02", status: "due_soon", outcome: "pass" },
  { id: "chk-15", homeId: "home-oak", category: "general_hsa", lastCompletedDate: "2026-02-01T10:00:00Z", nextDueDate: "2026-08-01T10:00:00Z", frequencyDays: 180, completedBy: "staff-rm-01", status: "current", outcome: "advisory", defectsFound: ["Minor trip hazard in garden — flagged for repair"] },
  { id: "chk-16", homeId: "home-oak", category: "boiler_service", lastCompletedDate: "2025-10-01T10:00:00Z", nextDueDate: "2026-10-01T10:00:00Z", frequencyDays: 365, completedBy: "Plumbing Pro", status: "current", outcome: "pass" },
];

const DEMO_DRILLS: FireDrill[] = Array.from({ length: 13 }, (_, i) => ({
  id: `drill-${i + 1}`,
  homeId: "home-oak",
  date: new Date(2025, 4 + i, 1, 10, 0, 0).toISOString(), // monthly from May 2025
  scenario: i % 4 === 0 ? "Night scenario — waking night only" : i % 4 === 1 ? "Blocked front exit" : i % 4 === 2 ? "Daytime — all present" : "Kitchen fire scenario",
  evacuationTimeSeconds: 75 + Math.round(Math.random() * 40),
  allChildrenEvacuated: true,
  allStaffParticipated: i !== 7, // one drill had a staff member absent
  assemblyPointUsed: true,
  issuesIdentified: i === 3 ? ["Child hesitated at assembly point"] : i === 9 ? ["Staff took too long to check rooms"] : [],
  actionsTaken: i === 3 ? ["Reviewed assembly point procedure with child"] : i === 9 ? ["Staff refresher on sweep procedure"] : [],
  conductedBy: "staff-rm-01",
}));

const DEMO_MAINTENANCE: MaintenanceRequest[] = [
  { id: "maint-01", homeId: "home-oak", reportedDate: "2026-05-12T10:00:00Z", reportedBy: "staff-sw-01", description: "Kitchen tap leaking", location: "Kitchen", priority: "routine", status: "assigned", assignedTo: "Handyman Services", safetyRelated: false },
  { id: "maint-02", homeId: "home-oak", reportedDate: "2026-05-14T10:00:00Z", reportedBy: "staff-sw-02", description: "Bedroom 3 radiator not heating", location: "Bedroom 3", priority: "urgent", status: "in_progress", assignedTo: "Plumbing Pro", safetyRelated: false },
  { id: "maint-03", homeId: "home-oak", reportedDate: "2026-05-01T10:00:00Z", reportedBy: "staff-rm-01", description: "Garden fence panel blown down", location: "Garden", priority: "routine", status: "completed", completedDate: "2026-05-08T10:00:00Z", cost: 180, assignedTo: "Fencing Solutions", safetyRelated: true },
  { id: "maint-04", homeId: "home-oak", reportedDate: "2026-04-15T10:00:00Z", reportedBy: "staff-sw-01", description: "Bathroom extractor fan noisy", location: "Bathroom", priority: "cosmetic", status: "parts_ordered", assignedTo: "Handyman Services", safetyRelated: false },
  { id: "maint-05", homeId: "home-oak", reportedDate: "2026-04-01T10:00:00Z", reportedBy: "staff-rm-01", description: "Front door lock stiff", location: "Main entrance", priority: "urgent", status: "completed", completedDate: "2026-04-03T14:00:00Z", cost: 95, assignedTo: "Locksmith Direct", safetyRelated: true },
];

// ── GET Handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") ?? "home-oak";
  const mode = searchParams.get("mode") ?? "dashboard";

  const now = new Date().toISOString();

  if (mode === "compliance") {
    const result = evaluateEnvironmentCompliance(DEMO_CHECKS, DEMO_DRILLS, DEMO_MAINTENANCE, homeId, now);
    return NextResponse.json(result);
  }

  if (mode === "metrics") {
    const metrics = calculateHomeEnvironmentMetrics(DEMO_CHECKS, DEMO_DRILLS, DEMO_MAINTENANCE, homeId, now);
    return NextResponse.json(metrics);
  }

  // Dashboard mode
  const compliance = evaluateEnvironmentCompliance(DEMO_CHECKS, DEMO_DRILLS, DEMO_MAINTENANCE, homeId, now);
  const metrics = calculateHomeEnvironmentMetrics(DEMO_CHECKS, DEMO_DRILLS, DEMO_MAINTENANCE, homeId, now);

  const openMaintenance = DEMO_MAINTENANCE
    .filter(m => m.homeId === homeId && m.status !== "completed" && m.status !== "cancelled")
    .map(m => ({
      id: m.id,
      description: m.description,
      location: m.location,
      priority: m.priority,
      priorityLabel: getMaintenancePriorityLabel(m.priority),
      status: m.status,
      statusLabel: getMaintenanceStatusLabel(m.status),
      reportedDate: m.reportedDate,
      safetyRelated: m.safetyRelated,
    }));

  return NextResponse.json({
    compliance: {
      isCompliant: compliance.isCompliant,
      fireComplianceScore: compliance.fireComplianceScore,
      generalSafetyScore: compliance.generalSafetyScore,
      certificatesValid: compliance.certificatesValid,
      gasValid: compliance.gasValid,
      electricalValid: compliance.electricalValid,
      legionellaValid: compliance.legionellaValid,
      fireDrillsCurrent: compliance.fireDrillsCurrent,
      fireDrillCount12Months: compliance.fireDrillCount12Months,
      averageEvacuationTime: compliance.averageEvacuationTime,
    },
    metrics: {
      overallComplianceRate: metrics.overallComplianceRate,
      checksOverdue: metrics.checksOverdue,
      checksDueSoon: metrics.checksDueSoon,
      maintenanceOpenCount: metrics.maintenanceOpenCount,
      emergencyMaintenanceOpen: metrics.emergencyMaintenanceOpen,
      maintenanceCompletedThisMonth: metrics.maintenanceCompletedThisMonth,
      averageCompletionDays: metrics.averageCompletionDays,
    },
    openMaintenance,
    certificateStatus: metrics.certificateStatus,
    overdueItems: compliance.overdueChecks,
    dueSoonItems: compliance.dueSoonChecks,
    recentDrills: metrics.recentDrills.slice(0, 3),
    issues: compliance.issues,
    warnings: compliance.warnings,
  });
}

// ── POST Handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  if (action === "evaluate") {
    const { checks, drills, maintenance, homeId } = body;
    if (!checks || !homeId) {
      return NextResponse.json({ error: "checks and homeId required" }, { status: 400 });
    }
    const result = evaluateEnvironmentCompliance(checks, drills ?? [], maintenance ?? [], homeId);
    return NextResponse.json(result);
  }

  if (action === "metrics") {
    const { checks, drills, maintenance, homeId } = body;
    if (!checks || !homeId) {
      return NextResponse.json({ error: "checks and homeId required" }, { status: 400 });
    }
    const result = calculateHomeEnvironmentMetrics(checks, drills ?? [], maintenance ?? [], homeId);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

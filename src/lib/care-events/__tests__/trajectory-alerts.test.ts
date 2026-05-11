// ══════════════════════════════════════════════════════════════════════════════
// Trajectory alerts + notifications promotion (M46)
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db/store";
import {
  buildInspectionBundle,
  persistInspectionBundle,
} from "@/lib/care-events/inspection-bundle";
import {
  detectTrajectoryAlerts,
  LARGE_STEP_DROP_THRESHOLD,
} from "@/lib/care-events/inspection-trajectory";
import { loadNotifications } from "@/lib/care-events/notifications";

const HOME = "home_oak";

beforeEach(() => {
  const arr = db.inspectionBundles.findAll() as { home_id: string }[];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].home_id === HOME) arr.splice(i, 1);
  }
});

function mutate(id: string, score: number, severity: string) {
  const row = db.inspectionBundles.findById(id)!;
  (row as unknown as { readiness_score: number }).readiness_score = score;
  (row as unknown as { readiness_severity: string }).readiness_severity = severity;
  type P = { headline: { readiness_score: number; readiness_severity: string } };
  (row.payload as P).headline.readiness_score = score;
  (row.payload as P).headline.readiness_severity = severity;
}

describe("trajectory alerts (M46)", () => {
  it("returns no alerts when no bundles exist", () => {
    expect(detectTrajectoryAlerts(HOME)).toEqual([]);
  });

  it("flags regressing trajectory as critical", async () => {
    const a = buildInspectionBundle(HOME); persistInspectionBundle(a);
    await new Promise((r) => setTimeout(r, 5));
    const b = buildInspectionBundle(HOME); persistInspectionBundle(b);
    mutate(a.bundle_id, 80, "ready");
    mutate(b.bundle_id, 60, "ready");
    const flags = detectTrajectoryAlerts(HOME);
    const reg = flags.find((f) => f.kind === "regressing");
    expect(reg).toBeTruthy();
    expect(reg!.severity).toBe("critical");
    expect(reg!.bundle_id).toBe(b.bundle_id);
  });

  it("flags severity flip on the latest bundle", async () => {
    const a = buildInspectionBundle(HOME); persistInspectionBundle(a);
    await new Promise((r) => setTimeout(r, 5));
    const b = buildInspectionBundle(HOME); persistInspectionBundle(b);
    mutate(a.bundle_id, 70, "ready");
    mutate(b.bundle_id, 70, "needs-action");
    const flags = detectTrajectoryAlerts(HOME);
    expect(flags.some((f) => f.kind === "severity_flip_latest")).toBe(true);
  });

  it("flags large single-step drop (>= threshold)", async () => {
    const a = buildInspectionBundle(HOME); persistInspectionBundle(a);
    await new Promise((r) => setTimeout(r, 5));
    const b = buildInspectionBundle(HOME); persistInspectionBundle(b);
    mutate(a.bundle_id, 80, "ready");
    mutate(b.bundle_id, 80 - LARGE_STEP_DROP_THRESHOLD, "ready");
    const flags = detectTrajectoryAlerts(HOME);
    expect(flags.some((f) => f.kind === "large_step_drop")).toBe(true);
  });

  it("does not flag holding trajectories", async () => {
    const a = buildInspectionBundle(HOME); persistInspectionBundle(a);
    await new Promise((r) => setTimeout(r, 5));
    const b = buildInspectionBundle(HOME); persistInspectionBundle(b);
    mutate(a.bundle_id, 70, "ready");
    mutate(b.bundle_id, 71, "ready");
    expect(detectTrajectoryAlerts(HOME)).toEqual([]);
  });

  it("promotes alerts into the manager notification stream", async () => {
    const a = buildInspectionBundle(HOME); persistInspectionBundle(a);
    await new Promise((r) => setTimeout(r, 5));
    const b = buildInspectionBundle(HOME); persistInspectionBundle(b);
    mutate(a.bundle_id, 80, "ready");
    mutate(b.bundle_id, 60, "needs-action");
    const stream = loadNotifications(HOME);
    const trajItems = stream.items.filter((i) => i.source === "trajectory_alert");
    expect(trajItems.length).toBeGreaterThanOrEqual(2); // regressing + severity flip
    for (const item of trajItems) {
      expect(item.audience).toBe("manager");
      expect(item.link_href).toBe("/intelligence/care-events/inspection-bundle/trajectory");
    }
  });
});

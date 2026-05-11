// ══════════════════════════════════════════════════════════════════════════════
// Inspection Readiness Trajectory  (Milestone 45)
//
// Turns the home's persisted inspection bundles into a chronological,
// deltas-aware time series so inspectors / RIs can see whether the home
// is improving, holding or regressing across visits — without opening
// each bundle.
//
// Read-only. Pure derivation over `listPersistedInspectionBundles`.
// ══════════════════════════════════════════════════════════════════════════════

import {
  listPersistedInspectionBundles,
  type PersistedInspectionBundleRow,
} from "@/lib/care-events/inspection-bundle";

export interface TrajectoryPoint {
  bundle_id: string;
  generated_at: string;
  readiness_score: number;
  readiness_severity: string;
  reg44_packs_included: number;
  filing_total: number;
  reg45_evidence_items: number;
  annex_a_evidence_items: number;
  recent_exports_included: number;
  delta_readiness_score: number;       // vs previous (chronological) point; 0 if first
  severity_changed: boolean;           // vs previous point
}

export type TrajectoryDirection = "improving" | "regressing" | "holding" | "insufficient_data";

export interface TrajectorySummary {
  home_id: string;
  bundles_total: number;
  earliest_at: string | null;
  latest_at: string | null;
  earliest_score: number | null;
  latest_score: number | null;
  net_score_delta: number | null;            // latest - earliest
  direction: TrajectoryDirection;
  severity_changes: number;                  // count of points where severity flipped
  points: TrajectoryPoint[];                 // chronological (oldest → newest)
}

const HOLDING_BAND = 1; // |net delta| ≤ 1 ⇒ holding

export function loadInspectionTrajectory(homeId: string): TrajectorySummary {
  // listPersistedInspectionBundles returns newest-first; reverse for chronology
  const rows: PersistedInspectionBundleRow[] = [...listPersistedInspectionBundles(homeId)].reverse();

  if (rows.length === 0) {
    return {
      home_id: homeId,
      bundles_total: 0,
      earliest_at: null,
      latest_at: null,
      earliest_score: null,
      latest_score: null,
      net_score_delta: null,
      direction: "insufficient_data",
      severity_changes: 0,
      points: [],
    };
  }

  let severity_changes = 0;
  const points: TrajectoryPoint[] = rows.map((row, i) => {
    const prev = i > 0 ? rows[i - 1] : null;
    const delta = prev ? row.readiness_score - prev.readiness_score : 0;
    const flipped = !!prev && prev.readiness_severity !== row.readiness_severity;
    if (flipped) severity_changes += 1;
    return {
      bundle_id: row.id,
      generated_at: row.generated_at,
      readiness_score: row.readiness_score,
      readiness_severity: row.readiness_severity,
      reg44_packs_included: row.reg44_packs_included,
      filing_total: row.filing_total,
      reg45_evidence_items: row.reg45_evidence_items,
      annex_a_evidence_items: row.annex_a_evidence_items,
      recent_exports_included: row.recent_exports_included,
      delta_readiness_score: delta,
      severity_changed: flipped,
    };
  });

  const earliest = rows[0];
  const latest = rows[rows.length - 1];
  const net = latest.readiness_score - earliest.readiness_score;

  let direction: TrajectoryDirection;
  if (rows.length < 2) direction = "insufficient_data";
  else if (net > HOLDING_BAND) direction = "improving";
  else if (net < -HOLDING_BAND) direction = "regressing";
  else direction = "holding";

  return {
    home_id: homeId,
    bundles_total: rows.length,
    earliest_at: earliest.generated_at,
    latest_at: latest.generated_at,
    earliest_score: earliest.readiness_score,
    latest_score: latest.readiness_score,
    net_score_delta: net,
    direction,
    severity_changes,
    points,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Inspection Bundle  (Milestone 42)
//
// Composes one inspector-facing artifact from the live system:
//   - latest Inspection Snapshot  (or a fresh one)
//   - all persisted Reg 44 packs in the home
//   - latest Filing Cabinet index
//   - Reg 45 evidence items
//   - Annex A evidence items
//   - export history (last 90 days)
//
// Read-only. Pure composition over the existing engines and the in-memory
// db facades — no migrations, no destructive ops. Always treated as
// safeguarding-sensitive: bundles contain Reg 44 + filing index +
// safeguarding-relevant Reg 45 evidence, so any external transmission must
// follow sensitive-export rules (audit + notifications + abuse signals).
// ══════════════════════════════════════════════════════════════════════════════

import { db } from "@/lib/db/store";
import {
  generateInspectionSnapshot,
  type InspectionSnapshot,
} from "@/lib/care-events/inspection-snapshot";
import {
  loadFilingCabinetIndex,
  type FilingCabinetIndex,
} from "@/lib/care-events/filing-cabinet-index";
import {
  loadExportHistory,
  type ExportHistorySummary,
} from "@/lib/care-events/export-history";

export const INSPECTION_BUNDLE_SCHEMA_VERSION = 1;

export interface InspectionBundleHeadline {
  inspection_snapshots_included: number;
  reg44_packs_included: number;
  filing_total: number;
  reg45_evidence_items: number;
  annex_a_evidence_items: number;
  recent_exports_included: number;
  readiness_score: number;
  readiness_severity: string;
}

export interface InspectionBundle {
  bundle_id: string;
  home_id: string;
  generated_at: string;
  generated_by: string | null;
  schema_version: number;
  headline: InspectionBundleHeadline;
  inspection_snapshot: InspectionSnapshot;
  reg44_packs: ReadonlyArray<unknown>;       // PersistedReg44Pack[] (loosely typed to avoid cycle)
  filing_cabinet: FilingCabinetIndex;
  reg45_evidence: ReadonlyArray<unknown>;
  annex_a_evidence: ReadonlyArray<unknown>;
  export_history_recent: ExportHistorySummary;
}

export interface BuildInspectionBundleOptions {
  generatedBy?: string | null;
}

export function buildInspectionBundle(
  homeId: string,
  opts: BuildInspectionBundleOptions = {},
): InspectionBundle {
  const generated_at = new Date().toISOString();
  const inspection_snapshot = generateInspectionSnapshot(homeId, {
    generatedBy: opts.generatedBy ?? null,
  });
  const reg44_packs = db.reg44Packs
    .findAll(homeId)
    .slice()
    .sort((a, b) => b.generated_at.localeCompare(a.generated_at));
  const filing_cabinet = loadFilingCabinetIndex(homeId);
  const reg45_evidence = db.reg45EvidenceQueue
    .findAll()
    .filter((r) => r.home_id === homeId);
  const annex_a_evidence = db.annexAEvidenceQueue
    .findAll()
    .filter((a) => a.home_id === homeId);
  const export_history_recent = loadExportHistory(homeId);

  const bundle_id = `inspection_bundle_${homeId}_${generated_at.replace(/[:.]/g, "")}`;

  return {
    bundle_id,
    home_id: homeId,
    generated_at,
    generated_by: opts.generatedBy ?? null,
    schema_version: INSPECTION_BUNDLE_SCHEMA_VERSION,
    headline: {
      inspection_snapshots_included: 1,
      reg44_packs_included: reg44_packs.length,
      filing_total: filing_cabinet.total,
      reg45_evidence_items: reg45_evidence.length,
      annex_a_evidence_items: annex_a_evidence.length,
      recent_exports_included: export_history_recent.total,
      readiness_score: inspection_snapshot.headline.readiness_score,
      readiness_severity: inspection_snapshot.headline.readiness_severity,
    },
    inspection_snapshot,
    reg44_packs,
    filing_cabinet,
    reg45_evidence,
    annex_a_evidence,
    export_history_recent,
  };
}

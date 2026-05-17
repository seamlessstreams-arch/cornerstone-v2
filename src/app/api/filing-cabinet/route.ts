// ══════════════════════════════════════════════════════════════════════════════
// API: /api/filing-cabinet — Document Retention & Filing Intelligence
//
// Returns filing statistics, retention status, expiring documents, and
// destruction queue. Powers the Filing Cabinet dashboard and management UI.
//
// CHR 2015 Schedule 3, DPA 2018, UK-GDPR compliance tracking.
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseEnabled } from "@/lib/supabase/server";
import {
  checkRetentionStatus,
  calculateFilingStats,
  getDocumentsApproachingExpiry,
  getExpiredDocuments,
  getRetentionPolicy,
  getCategoryLabel,
  RETENTION_POLICIES,
} from "@/lib/filing-cabinet";
import type {
  FiledDocument,
  FilingCategory,
  DocumentStatus,
} from "@/lib/filing-cabinet";

type SB = any;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const homeId = url.searchParams.get("homeId");
    const childId = url.searchParams.get("childId");
    const category = url.searchParams.get("category") as FilingCategory | null;
    const view = url.searchParams.get("view") ?? "overview";

    const sb = createServerClient();

    if (sb && isSupabaseEnabled()) {
      return await handleLiveData(sb, homeId, childId, category, view);
    }

    return NextResponse.json(getDemoData(homeId, childId, category, view));
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// ── Live Data ──────────────────────────────────────────────────────────────

async function handleLiveData(
  sb: any,
  homeId: string | null,
  childId: string | null,
  category: FilingCategory | null,
  view: string,
) {
  let query = (sb.from("filed_documents") as SB).select("*");
  if (homeId) query = query.eq("home_id", homeId);
  if (childId) query = query.eq("child_id", childId);
  if (category) query = query.eq("category", category);

  const { data: documents, error } = await query;
  if (error) throw error;

  const docs: FiledDocument[] = (documents ?? []).map(mapToDocument);

  if (view === "retention") {
    const retentionStatus = checkRetentionStatus(docs);
    const approaching = getDocumentsApproachingExpiry(docs);
    const expired = getExpiredDocuments(docs);
    return NextResponse.json({ retentionStatus, approaching, expired });
  }

  if (view === "destruction") {
    const expired = getExpiredDocuments(docs);
    const pending = docs.filter(d => d.status === "pending_destruction" || d.status === "destruction_approved");
    return NextResponse.json({ expired, pendingDestruction: pending });
  }

  // Default overview
  const stats = calculateFilingStats(docs);
  const approaching = getDocumentsApproachingExpiry(docs);
  const expired = getExpiredDocuments(docs);

  return NextResponse.json({
    stats,
    approachingExpiry: approaching.slice(0, 20),
    expiredDocuments: expired.slice(0, 20),
    retentionPolicies: RETENTION_POLICIES,
  });
}

// ── Mapper ────────────────────────────────────────────────────────────────

function mapToDocument(row: any): FiledDocument {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    sensitivity: row.sensitivity,
    homeId: row.home_id,
    childId: row.child_id,
    staffId: row.staff_id,
    filedBy: row.filed_by,
    filedAt: row.filed_at,
    status: row.status,
    retentionExpiresAt: row.retention_expires_at,
    retentionBasis: row.retention_basis,
    retentionYears: row.retention_years,
    tags: row.tags ?? [],
    version: row.version ?? 1,
    previousVersionId: row.previous_version_id,
    destructionApprovedBy: row.destruction_approved_by,
    destructionApprovedAt: row.destruction_approved_at,
    destroyedAt: row.destroyed_at,
    destroyedBy: row.destroyed_by,
    holdReason: row.hold_reason,
    holdPlacedBy: row.hold_placed_by,
    holdPlacedAt: row.hold_placed_at,
    transferredTo: row.transferred_to,
    transferredAt: row.transferred_at,
    lastAccessedBy: row.last_accessed_by,
    lastAccessedAt: row.last_accessed_at,
    accessCount: row.access_count ?? 0,
  };
}

// ── Demo Data ──────────────────────────────────────────────────────────────

function getDemoData(
  homeId: string | null,
  childId: string | null,
  category: FilingCategory | null,
  view: string,
) {
  const home = homeId ?? "home-oak";

  const demoDocuments: FiledDocument[] = [
    // Child records
    {
      id: "doc-cr-001",
      title: "Jordan Williams — LAC Care Record",
      category: "child_record",
      sensitivity: "highly_sensitive",
      homeId: home,
      childId: "child-jordan",
      filedBy: "user-rsw-1",
      filedAt: "2024-01-15T10:00:00Z",
      status: "active",
      retentionExpiresAt: "2085-06-15T00:00:00Z",
      retentionBasis: "chr_2015_schedule_3",
      retentionYears: 75,
      tags: ["lac", "primary-record"],
      version: 1,
      accessCount: 45,
      lastAccessedAt: "2026-05-15T14:30:00Z",
      lastAccessedBy: "user-tl-1",
    },
    {
      id: "doc-cp-001",
      title: "Jordan Williams — Placement Plan Q2 2026",
      category: "care_plan",
      sensitivity: "highly_sensitive",
      homeId: home,
      childId: "child-jordan",
      filedBy: "user-tl-1",
      filedAt: "2026-04-01T09:00:00Z",
      status: "active",
      retentionExpiresAt: "2085-06-15T00:00:00Z",
      retentionBasis: "chr_2015_schedule_3",
      retentionYears: 75,
      tags: ["placement-plan", "q2-2026"],
      version: 3,
      previousVersionId: "doc-cp-001-v2",
      accessCount: 12,
    },
    // Safeguarding
    {
      id: "doc-sg-001",
      title: "Safeguarding Referral SR-2026-003 — Jordan",
      category: "safeguarding",
      sensitivity: "restricted",
      homeId: home,
      childId: "child-jordan",
      filedBy: "user-tl-1",
      filedAt: "2026-03-22T16:45:00Z",
      status: "active",
      retentionExpiresAt: "2125-03-22T16:45:00Z",
      retentionBasis: "safeguarding_indefinite",
      retentionYears: 99,
      tags: ["safeguarding", "referral", "disclosure"],
      version: 1,
      accessCount: 8,
    },
    // Daily records
    {
      id: "doc-dl-001",
      title: "Daily Log — Morning Shift 16 May 2026",
      category: "daily_record",
      sensitivity: "standard",
      homeId: home,
      filedBy: "user-rsw-2",
      filedAt: "2026-05-16T14:30:00Z",
      status: "active",
      retentionExpiresAt: "2041-05-16T14:30:00Z",
      retentionBasis: "chr_2015_schedule_3",
      retentionYears: 15,
      tags: ["daily", "shift-morning", "may-2026"],
      version: 1,
      accessCount: 2,
    },
    // Incident
    {
      id: "doc-inc-001",
      title: "Incident Report — Restraint IR-2026-008",
      category: "incident",
      sensitivity: "sensitive",
      homeId: home,
      childId: "child-jordan",
      filedBy: "user-rsw-1",
      filedAt: "2026-02-14T20:15:00Z",
      status: "active",
      retentionExpiresAt: "2051-02-14T20:15:00Z",
      retentionBasis: "limitation_act",
      retentionYears: 25,
      tags: ["incident", "restraint", "pi"],
      version: 1,
      accessCount: 15,
    },
    // Staff personnel
    {
      id: "doc-sp-001",
      title: "Sarah Mitchell — Supervision Record May 2026",
      category: "staff_personnel",
      sensitivity: "sensitive",
      homeId: home,
      staffId: "staff-sarah",
      filedBy: "user-tl-1",
      filedAt: "2026-05-10T11:00:00Z",
      status: "active",
      retentionExpiresAt: "2033-05-10T11:00:00Z",
      retentionBasis: "employment_law",
      retentionYears: 7,
      tags: ["supervision", "may-2026"],
      version: 1,
      accessCount: 3,
    },
    // Regulatory
    {
      id: "doc-reg-001",
      title: "Reg 44 Report — April 2026",
      category: "regulatory",
      sensitivity: "standard",
      homeId: home,
      filedBy: "user-reg44-1",
      filedAt: "2026-04-28T10:00:00Z",
      status: "active",
      retentionExpiresAt: "2041-04-28T10:00:00Z",
      retentionBasis: "chr_2015_schedule_3",
      retentionYears: 15,
      tags: ["reg44", "april-2026", "visitor-report"],
      version: 1,
      accessCount: 7,
    },
    // Document approaching expiry
    {
      id: "doc-pol-001",
      title: "Behaviour Management Policy v4 (superseded)",
      category: "policy",
      sensitivity: "standard",
      homeId: home,
      filedBy: "user-rm-1",
      filedAt: "2019-06-01T09:00:00Z",
      status: "archived",
      retentionExpiresAt: "2026-06-01T09:00:00Z",
      retentionBasis: "organisational",
      retentionYears: 7,
      tags: ["policy", "behaviour", "superseded"],
      version: 4,
      accessCount: 1,
    },
    // Document on hold
    {
      id: "doc-hold-001",
      title: "Correspondence — Social Worker re: Placement",
      category: "correspondence",
      sensitivity: "sensitive",
      homeId: home,
      childId: "child-jordan",
      filedBy: "user-rm-1",
      filedAt: "2023-11-15T14:00:00Z",
      status: "hold",
      retentionExpiresAt: "2030-11-15T14:00:00Z",
      retentionBasis: "organisational",
      retentionYears: 7,
      tags: ["correspondence", "social-worker", "placement"],
      version: 1,
      holdReason: "Subject Access Request in progress — do not destroy",
      holdPlacedBy: "user-rm-1",
      holdPlacedAt: "2026-04-01T09:00:00Z",
      accessCount: 5,
    },
    // Medication
    {
      id: "doc-med-001",
      title: "MAR Chart — Jordan — May 2026",
      category: "medication",
      sensitivity: "sensitive",
      homeId: home,
      childId: "child-jordan",
      filedBy: "user-rsw-1",
      filedAt: "2026-05-01T08:00:00Z",
      status: "active",
      retentionExpiresAt: "2051-05-01T08:00:00Z",
      retentionBasis: "chr_2015_schedule_3",
      retentionYears: 25,
      tags: ["mar", "medication", "may-2026"],
      version: 1,
      accessCount: 30,
      lastAccessedAt: "2026-05-16T08:05:00Z",
    },
  ];

  // Filter by child if requested
  let filteredDocs = demoDocuments;
  if (childId) {
    filteredDocs = filteredDocs.filter(d => d.childId === childId);
  }
  if (category) {
    filteredDocs = filteredDocs.filter(d => d.category === category);
  }

  const now = new Date().toISOString();

  if (view === "retention") {
    const retentionStatus = checkRetentionStatus(filteredDocs, now);
    const approaching = getDocumentsApproachingExpiry(filteredDocs, 90, now);
    const expired = getExpiredDocuments(filteredDocs, now);
    return { retentionStatus, approaching, expired };
  }

  if (view === "destruction") {
    const expired = getExpiredDocuments(filteredDocs, now);
    const pending = filteredDocs.filter(d =>
      d.status === "pending_destruction" || d.status === "destruction_approved",
    );
    return { expired, pendingDestruction: pending };
  }

  if (view === "policies") {
    return {
      policies: RETENTION_POLICIES.map(p => ({
        ...p,
        categoryLabel: getCategoryLabel(p.category),
      })),
    };
  }

  // Default overview
  const stats = calculateFilingStats(filteredDocs, now);
  const approaching = getDocumentsApproachingExpiry(filteredDocs, 90, now);
  const expired = getExpiredDocuments(filteredDocs, now);

  return {
    stats,
    approachingExpiry: approaching,
    expiredDocuments: expired,
    recentDocuments: filteredDocs
      .sort((a, b) => new Date(b.filedAt).getTime() - new Date(a.filedAt).getTime())
      .slice(0, 10),
    categoryBreakdown: RETENTION_POLICIES.map(p => ({
      category: p.category,
      label: getCategoryLabel(p.category),
      count: filteredDocs.filter(d => d.category === p.category).length,
      retentionYears: p.defaultRetentionYears,
      basis: p.basis,
    })).filter(c => c.count > 0),
    holdCount: filteredDocs.filter(d => d.status === "hold").length,
  };
}

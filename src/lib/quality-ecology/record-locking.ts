// ══════════════════════════════════════════════════════════════════════════════
// Cara Quality Ecology — Record Locking & Amendment Engine
//
// Once a record reaches 'locked' or 'filed' status, it becomes immutable.
// No field can be changed, no content deleted. Any correction or addition
// creates a linked Amendment (addendum) that references the original.
//
// This satisfies CHR 2015 Reg 35(3) record integrity requirements and
// Ofsted inspection evidence standards — records must demonstrate they
// were not altered after the fact.
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

import type { LifecycleStatus } from "./types";
import type { UserContext, Role } from "../permissions/types";
import { isAtLeast } from "../permissions/role-rules";

// ── Constants ──────────────────────────────────────────────────────────────

const LOCKED_STATUSES: LifecycleStatus[] = ["locked", "filed"];

const AMENDMENT_MIN_ROLE: Role = "team_leader";

export type AmendmentType =
  | "correction"      // factual error
  | "addition"        // new information received
  | "clarification"   // context added for clarity
  | "late_entry"      // information entered after lock
  | "regulatory";     // required by regulator/inspector

export type AmendmentStatus = "draft" | "submitted" | "approved" | "rejected";

// ── Interfaces ─────────────────────────────────────────────────────────────

export interface LockedRecord {
  id: string;
  occurrenceId: string;
  templateId: string;
  homeId: string;
  childId?: string;
  status: LifecycleStatus;
  lockedAt: string;
  lockedBy: string;
  filedAt?: string;
  contentHash: string;       // SHA-256 of content at lock time
  amendments: Amendment[];
}

export interface Amendment {
  id: string;
  recordId: string;
  type: AmendmentType;
  status: AmendmentStatus;
  content: string;
  reason: string;
  fieldPath?: string;        // which field is being amended (dot notation)
  originalValue?: string;    // what it was before (for corrections)
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface AmendmentRequest {
  recordId: string;
  type: AmendmentType;
  content: string;
  reason: string;
  fieldPath?: string;
  originalValue?: string;
}

// ── Results ────────────────────────────────────────────────────────────────

export interface LockCheckResult {
  isLocked: boolean;
  canAmend: boolean;
  lockTimestamp?: string;
  amendmentCount: number;
  reason?: string;
}

export interface AmendmentResult {
  success: boolean;
  amendment?: Amendment;
  error?: string;
  userExplanation?: string;
}

export interface AmendmentApprovalResult {
  success: boolean;
  amendment?: Amendment;
  error?: string;
  userExplanation?: string;
}

// ── Core: Check Lock Status ────────────────────────────────────────────────

export function checkLockStatus(
  record: LockedRecord,
  user: UserContext,
): LockCheckResult {
  if (!LOCKED_STATUSES.includes(record.status)) {
    return {
      isLocked: false,
      canAmend: false,
      amendmentCount: record.amendments.length,
      reason: "Record is not yet locked.",
    };
  }

  const canAmend = isAtLeast(user.role, AMENDMENT_MIN_ROLE);

  return {
    isLocked: true,
    canAmend,
    lockTimestamp: record.lockedAt,
    amendmentCount: record.amendments.length,
    reason: canAmend
      ? undefined
      : "Your role does not permit amendments. Contact your team leader.",
  };
}

// ── Core: Create Amendment ─────────────────────────────────────────────────

export function createAmendment(
  record: LockedRecord,
  request: AmendmentRequest,
  user: UserContext,
  now?: string,
): AmendmentResult {
  const timestamp = now ?? new Date().toISOString();

  // 1. Record must be locked
  if (!LOCKED_STATUSES.includes(record.status)) {
    return {
      success: false,
      error: "Record is not locked. Edit it directly instead.",
      userExplanation: "This record is not yet locked — you can edit it directly.",
    };
  }

  // 2. User must have sufficient role
  if (!isAtLeast(user.role, AMENDMENT_MIN_ROLE)) {
    return {
      success: false,
      error: `Role '${user.role}' cannot create amendments. Requires '${AMENDMENT_MIN_ROLE}' or above.`,
      userExplanation: "You do not have permission to create amendments. Please ask your team leader.",
    };
  }

  // 3. Content and reason must be provided
  if (!request.content || request.content.trim().length === 0) {
    return {
      success: false,
      error: "Amendment content is required.",
      userExplanation: "Please provide the amendment content.",
    };
  }

  if (!request.reason || request.reason.trim().length === 0) {
    return {
      success: false,
      error: "Amendment reason is required.",
      userExplanation: "Please provide a reason for this amendment.",
    };
  }

  // 4. Corrections must specify original value
  if (request.type === "correction" && !request.originalValue) {
    return {
      success: false,
      error: "Corrections must specify the original value being corrected.",
      userExplanation: "Please specify what the original text said before this correction.",
    };
  }

  // 5. Build amendment
  const amendment: Amendment = {
    id: `amend-${record.id}-${record.amendments.length + 1}`,
    recordId: record.id,
    type: request.type,
    status: "submitted",
    content: request.content.trim(),
    reason: request.reason.trim(),
    fieldPath: request.fieldPath,
    originalValue: request.originalValue,
    createdBy: user.userId,
    createdAt: timestamp,
  };

  return {
    success: true,
    amendment,
  };
}

// ── Core: Approve Amendment ────────────────────────────────────────────────

export function approveAmendment(
  record: LockedRecord,
  amendmentId: string,
  user: UserContext,
  now?: string,
): AmendmentApprovalResult {
  const timestamp = now ?? new Date().toISOString();

  // Find the amendment
  const amendment = record.amendments.find(a => a.id === amendmentId);
  if (!amendment) {
    return {
      success: false,
      error: "Amendment not found.",
      userExplanation: "This amendment could not be found.",
    };
  }

  // Must be in submitted status
  if (amendment.status !== "submitted") {
    return {
      success: false,
      error: `Amendment is '${amendment.status}', not 'submitted'.`,
      userExplanation: "This amendment is not awaiting approval.",
    };
  }

  // Must have deputy_manager or above to approve amendments
  if (!isAtLeast(user.role, "deputy_manager")) {
    return {
      success: false,
      error: `Role '${user.role}' cannot approve amendments. Requires 'deputy_manager' or above.`,
      userExplanation: "You do not have permission to approve amendments.",
    };
  }

  // Cannot approve own amendment
  if (amendment.createdBy === user.userId) {
    return {
      success: false,
      error: "Cannot approve own amendment.",
      userExplanation: "You cannot approve your own amendment.",
    };
  }

  const approved: Amendment = {
    ...amendment,
    status: "approved",
    approvedBy: user.userId,
    approvedAt: timestamp,
  };

  return {
    success: true,
    amendment: approved,
  };
}

// ── Core: Reject Amendment ─────────────────────────────────────────────────

export function rejectAmendment(
  record: LockedRecord,
  amendmentId: string,
  user: UserContext,
  rejectionReason: string,
  now?: string,
): AmendmentApprovalResult {
  const timestamp = now ?? new Date().toISOString();

  const amendment = record.amendments.find(a => a.id === amendmentId);
  if (!amendment) {
    return {
      success: false,
      error: "Amendment not found.",
      userExplanation: "This amendment could not be found.",
    };
  }

  if (amendment.status !== "submitted") {
    return {
      success: false,
      error: `Amendment is '${amendment.status}', not 'submitted'.`,
      userExplanation: "This amendment is not awaiting review.",
    };
  }

  if (!isAtLeast(user.role, "deputy_manager")) {
    return {
      success: false,
      error: `Role '${user.role}' cannot reject amendments.`,
      userExplanation: "You do not have permission to reject amendments.",
    };
  }

  if (!rejectionReason || rejectionReason.trim().length === 0) {
    return {
      success: false,
      error: "Rejection reason is required.",
      userExplanation: "Please provide a reason for rejecting this amendment.",
    };
  }

  const rejected: Amendment = {
    ...amendment,
    status: "rejected",
    rejectedBy: user.userId,
    rejectedAt: timestamp,
    rejectionReason: rejectionReason.trim(),
  };

  return {
    success: true,
    amendment: rejected,
  };
}

// ── Core: Validate Record Integrity ────────────────────────────────────────

export interface IntegrityCheckResult {
  isValid: boolean;
  originalHash: string;
  currentHash: string;
  tamperedFields?: string[];
  message: string;
}

export function validateRecordIntegrity(
  record: LockedRecord,
  currentContentHash: string,
): IntegrityCheckResult {
  const isValid = record.contentHash === currentContentHash;

  return {
    isValid,
    originalHash: record.contentHash,
    currentHash: currentContentHash,
    tamperedFields: isValid ? undefined : ["unknown"],
    message: isValid
      ? "Record integrity verified — content matches lock-time hash."
      : "WARNING: Record content has been altered since lock. This may indicate data corruption or unauthorized modification.",
  };
}

// ── Core: Get Amendment Timeline ───────────────────────────────────────────

export interface AmendmentTimelineEntry {
  id: string;
  type: AmendmentType;
  status: AmendmentStatus;
  summary: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export function getAmendmentTimeline(record: LockedRecord): AmendmentTimelineEntry[] {
  return record.amendments
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(a => ({
      id: a.id,
      type: a.type,
      status: a.status,
      summary: a.content.slice(0, 100) + (a.content.length > 100 ? "..." : ""),
      createdBy: a.createdBy,
      createdAt: a.createdAt,
      approvedBy: a.approvedBy,
      approvedAt: a.approvedAt,
    }));
}

// ── Utility: Can Modify Record ─────────────────────────────────────────────

export function canModifyRecord(status: LifecycleStatus): boolean {
  return !LOCKED_STATUSES.includes(status);
}

// ── Utility: Amendment Type Labels ─────────────────────────────────────────

export const AMENDMENT_TYPE_LABELS: Record<AmendmentType, string> = {
  correction: "Factual Correction",
  addition: "Additional Information",
  clarification: "Clarification",
  late_entry: "Late Entry",
  regulatory: "Regulatory Requirement",
};

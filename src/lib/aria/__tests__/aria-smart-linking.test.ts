// ══════════════════════════════════════════════════════════════════════════════
// Tests — ARIA Smart Linking
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi } from "vitest";

// Mock Supabase before importing
vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => null),
  isSupabaseEnabled: vi.fn(() => false),
}));

import {
  writeSmartLinks,
  flagRecordAsAriaAssisted,
  getAriaUsageForRecord,
  linkCommittedOutput,
  _testing,
} from "../aria-smart-linking";

const { ARIA_FLAGGABLE_TABLES } = _testing;

// ─── ARIA_FLAGGABLE_TABLES ──────────────────────────────────────────────────

describe("ARIA_FLAGGABLE_TABLES", () => {
  it("includes the expected tables", () => {
    expect(ARIA_FLAGGABLE_TABLES.has("daily_log_entries")).toBe(true);
    expect(ARIA_FLAGGABLE_TABLES.has("incidents")).toBe(true);
    expect(ARIA_FLAGGABLE_TABLES.has("key_work_sessions")).toBe(true);
    expect(ARIA_FLAGGABLE_TABLES.has("care_forms")).toBe(true);
    expect(ARIA_FLAGGABLE_TABLES.has("handovers")).toBe(true);
    expect(ARIA_FLAGGABLE_TABLES.has("supervisions")).toBe(true);
  });

  it("does not include tables without an aria flag column", () => {
    expect(ARIA_FLAGGABLE_TABLES.has("young_people")).toBe(false);
    expect(ARIA_FLAGGABLE_TABLES.has("tasks")).toBe(false);
    expect(ARIA_FLAGGABLE_TABLES.has("qa_audits")).toBe(false);
  });
});

// ─── writeSmartLinks (Supabase off) ─────────────────────────────────────────

describe("writeSmartLinks", () => {
  it("returns 0 written when Supabase is disabled", async () => {
    const result = await writeSmartLinks([
      {
        outputId: "out_1",
        sourceTable: "daily_log_entries",
        sourceRecordId: "dl_1",
        linkType: "context_source",
      },
    ]);
    expect(result.written).toBe(0);
  });

  it("returns 0 written for empty links array", async () => {
    const result = await writeSmartLinks([]);
    expect(result.written).toBe(0);
  });
});

// ─── flagRecordAsAriaAssisted (Supabase off) ────────────────────────────────

describe("flagRecordAsAriaAssisted", () => {
  it("returns false when Supabase is disabled", async () => {
    const result = await flagRecordAsAriaAssisted("daily_log_entries", "dl_1");
    expect(result).toBe(false);
  });

  it("returns false for non-flaggable tables", async () => {
    const result = await flagRecordAsAriaAssisted("young_people", "yp_1");
    expect(result).toBe(false);
  });
});

// ─── getAriaUsageForRecord (Supabase off) ───────────────────────────────────

describe("getAriaUsageForRecord", () => {
  it("returns empty array when Supabase is disabled", async () => {
    const result = await getAriaUsageForRecord("daily_log_entries", "dl_1");
    expect(result).toEqual([]);
  });
});

// ─── linkCommittedOutput (Supabase off) ─────────────────────────────────────

describe("linkCommittedOutput", () => {
  it("does not throw when Supabase is disabled", async () => {
    await expect(
      linkCommittedOutput("out_1", "daily_log_entries", "dl_1"),
    ).resolves.not.toThrow();
  });
});

import { describe, it, expect, vi } from "vitest";

// ══════════════════════════════════════════════════════════════════════════════
// PRACTICE INTELLIGENCE — THERAPEUTIC PROFILE SERVICE TESTS
// ══════════════════════════════════════════════════════════════════════════════

// Mock the Supabase server module — return null to trigger demo path
vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => null),
}));

import {
  getTherapeuticProfile,
  listTherapeuticProfiles,
  buildProfileFromEvidence,
} from "../therapeutic-profile.service";

describe("getTherapeuticProfile (demo mode)", () => {
  it("returns a profile for a known demo child", async () => {
    const profile = await getTherapeuticProfile("child_1");
    expect(profile).not.toBeNull();
    expect(profile!.child_id).toBe("child_1");
  });

  it("returned profile has required top-level fields", async () => {
    const profile = await getTherapeuticProfile("child_1");
    expect(profile).not.toBeNull();
    expect(profile!.id).toBeDefined();
    expect(profile!.home_id).toBeDefined();
    expect(profile!.child_id).toBeDefined();
    expect(profile!.status).toBeDefined();
    expect(profile!.version).toBeDefined();
  });

  it("returned profile contains therapeutic detail fields", async () => {
    const profile = await getTherapeuticProfile("child_1");
    expect(profile).not.toBeNull();
    expect(profile!.known_triggers).toBeDefined();
    expect(Array.isArray(profile!.known_triggers)).toBe(true);
    expect(profile!.known_triggers.length).toBeGreaterThan(0);
    expect(profile!.known_soothing_strategies).toBeDefined();
    expect(Array.isArray(profile!.known_soothing_strategies)).toBe(true);
    expect(profile!.relational_strengths).toBeDefined();
    expect(Array.isArray(profile!.relational_strengths)).toBe(true);
  });

  it("returned profile includes child voice entries", async () => {
    const profile = await getTherapeuticProfile("child_1");
    expect(profile).not.toBeNull();
    expect(profile!.child_voice_entries).toBeDefined();
    expect(Array.isArray(profile!.child_voice_entries)).toBe(true);
    expect(profile!.child_voice_entries.length).toBeGreaterThan(0);
    expect(profile!.child_voice_entries[0]).toHaveProperty("quote");
    expect(profile!.child_voice_entries[0]).toHaveProperty("context");
    expect(profile!.child_voice_entries[0]).toHaveProperty("theme");
    expect(profile!.child_voice_entries[0]).toHaveProperty("sentiment");
  });

  it("returned profile has staff relationships", async () => {
    const profile = await getTherapeuticProfile("child_1");
    expect(profile).not.toBeNull();
    expect(profile!.staff_relationships).toBeDefined();
    expect(Array.isArray(profile!.staff_relationships)).toBe(true);
    expect(profile!.staff_relationships.length).toBeGreaterThan(0);
    expect(profile!.staff_relationships[0]).toHaveProperty("staffName");
    expect(profile!.staff_relationships[0]).toHaveProperty("quality");
  });

  it("returned profile has progress_over_time", async () => {
    const profile = await getTherapeuticProfile("child_1");
    expect(profile).not.toBeNull();
    expect(Array.isArray(profile!.progress_over_time)).toBe(true);
    if (profile!.progress_over_time.length > 0) {
      expect(profile!.progress_over_time[0]).toHaveProperty("date");
      expect(profile!.progress_over_time[0]).toHaveProperty("area");
      expect(profile!.progress_over_time[0]).toHaveProperty("direction");
    }
  });

  it("returned profile has therapeutic priorities", async () => {
    const profile = await getTherapeuticProfile("child_1");
    expect(profile).not.toBeNull();
    expect(Array.isArray(profile!.current_therapeutic_priorities)).toBe(true);
    expect(profile!.current_therapeutic_priorities.length).toBeGreaterThan(0);
    expect(profile!.current_therapeutic_priorities[0]).toHaveProperty("title");
    expect(profile!.current_therapeutic_priorities[0]).toHaveProperty("framework");
  });

  it("returned profile has what_helps and what_does_not_help", async () => {
    const profile = await getTherapeuticProfile("child_1");
    expect(profile).not.toBeNull();
    expect(Array.isArray(profile!.what_helps)).toBe(true);
    expect(Array.isArray(profile!.what_does_not_help)).toBe(true);
    expect(profile!.what_helps.length).toBeGreaterThan(0);
    expect(profile!.what_does_not_help.length).toBeGreaterThan(0);
  });
});

describe("listTherapeuticProfiles (demo mode)", () => {
  it("returns an array of profiles", async () => {
    const profiles = await listTherapeuticProfiles();
    expect(Array.isArray(profiles)).toBe(true);
    expect(profiles.length).toBeGreaterThan(0);
  });

  it("each profile has child_id and status", async () => {
    const profiles = await listTherapeuticProfiles();
    for (const p of profiles) {
      expect(p.child_id).toBeDefined();
      expect(p.child_id.length).toBeGreaterThan(0);
      expect(p.status).toBeDefined();
    }
  });

  it("returns at least two demo profiles", async () => {
    const profiles = await listTherapeuticProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(2);
  });
});

describe("buildProfileFromEvidence (demo mode)", () => {
  it("returns a partial profile with evidence-extracted fields", async () => {
    const profile = await buildProfileFromEvidence("child_1");
    expect(profile).toBeDefined();
    expect(profile.known_triggers).toBeDefined();
    expect(Array.isArray(profile.known_triggers)).toBe(true);
    expect(profile.known_triggers!.length).toBeGreaterThan(0);
  });

  it("returned profile has core fields populated", async () => {
    const profile = await buildProfileFromEvidence("child_1");
    expect(profile.known_soothing_strategies).toBeDefined();
    expect(Array.isArray(profile.known_soothing_strategies)).toBe(true);
    expect(profile.relational_strengths).toBeDefined();
    expect(Array.isArray(profile.relational_strengths)).toBe(true);
  });

  it("returned profile includes risk_themes", async () => {
    const profile = await buildProfileFromEvidence("child_1");
    expect(profile.risk_themes).toBeDefined();
    expect(Array.isArray(profile.risk_themes)).toBe(true);
    expect(profile.risk_themes!.length).toBeGreaterThan(0);
  });
});

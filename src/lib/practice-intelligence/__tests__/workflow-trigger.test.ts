import { describe, it, expect, vi } from "vitest";

// ══════════════════════════════════════════════════════════════════════════════
// PRACTICE INTELLIGENCE — WORKFLOW TRIGGER SERVICE TESTS
// ══════════════════════════════════════════════════════════════════════════════

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => null),
}));

import {
  processWorkflowTrigger,
  listPendingTriggers,
  listWorkflowTriggers,
} from "../workflow-trigger.service";

describe("processWorkflowTrigger (demo mode)", () => {
  it("returns a trigger for incident_created event", async () => {
    const trigger = await processWorkflowTrigger(
      "incident_created",
      "incidents",
      "inc-123",
      "child_1",
      "Child became distressed during activity",
    );
    expect(trigger).not.toBeNull();
    expect(trigger!.trigger_event).toBe("incident_created");
  });

  it("trigger has required fields", async () => {
    const trigger = await processWorkflowTrigger(
      "incident_created",
      "incidents",
      "inc-123",
      "child_1",
      "Test content",
    );
    expect(trigger).not.toBeNull();
    expect(trigger!.id).toBeDefined();
    expect(trigger!.home_id).toBeDefined();
    expect(trigger!.status).toBe("pending");
    expect(trigger!.suggestions).toBeDefined();
    expect(Array.isArray(trigger!.suggestions)).toBe(true);
    expect(trigger!.suggestions.length).toBeGreaterThan(0);
  });

  it("returns a trigger for missing_episode_created event", async () => {
    const trigger = await processWorkflowTrigger(
      "missing_episode_created",
      "missing_from_care",
      "mfc-456",
      "child_1",
      "Child left home at 20:15",
    );
    expect(trigger).not.toBeNull();
    expect(trigger!.trigger_event).toBe("missing_episode_created");
    expect(trigger!.suggestions.length).toBeGreaterThan(0);
  });

  it("returns a trigger for restraint_recorded event", async () => {
    const trigger = await processWorkflowTrigger(
      "restraint_recorded",
      "restraints",
      "rst-789",
      "child_2",
      "Physical intervention was necessary",
    );
    expect(trigger).not.toBeNull();
    expect(trigger!.suggestions.length).toBeGreaterThan(0);
  });

  it("returns a trigger for safeguarding_concern_raised event", async () => {
    const trigger = await processWorkflowTrigger(
      "safeguarding_concern_raised",
      "safeguarding",
      "sg-101",
      "child_1",
      "Concern raised about online contact",
    );
    expect(trigger).not.toBeNull();
    expect(trigger!.suggestions.length).toBeGreaterThan(0);
  });

  it("trigger suggestions include type, title, and description", async () => {
    const trigger = await processWorkflowTrigger(
      "incident_created",
      "incidents",
      "inc-123",
      "child_1",
      "Test content",
    );
    expect(trigger).not.toBeNull();
    for (const s of trigger!.suggestions) {
      expect(s.type).toBeDefined();
      expect(s.title).toBeDefined();
      expect(s.description).toBeDefined();
      expect(s.priority).toBeDefined();
    }
  });
});

describe("listPendingTriggers (demo mode)", () => {
  it("returns an array", async () => {
    const triggers = await listPendingTriggers();
    expect(Array.isArray(triggers)).toBe(true);
  });
});

describe("listWorkflowTriggers (demo mode)", () => {
  it("returns an array", async () => {
    const triggers = await listWorkflowTriggers();
    expect(Array.isArray(triggers)).toBe(true);
  });
});

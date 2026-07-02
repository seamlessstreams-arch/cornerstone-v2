import { describe, it, expect } from "vitest";
import {
  deriveReminderSpecs,
  planReminderSync,
  extractReminderKey,
  reminderMarker,
} from "../recruitment-reminder-engine";
import type {
  SaferRecruitmentCommandResult,
  CommandCandidate,
} from "../safer-recruitment-command-engine";

const TODAY = "2026-06-11";

function candidate(over: Partial<CommandCandidate> = {}): CommandCandidate {
  return {
    candidate_id: "cand_1",
    name: "Tess Whitfield",
    role_applied: "Residential Care Worker",
    stage: "pre_start_checks",
    days_since_application: 22,
    traffic_light: "amber",
    traffic_reasons: ["Checks in progress"],
    start_eligibility: "conditional",
    eligibility_reason: "Conditional offer in progress",
    compliance_score: 60,
    blockers: [],
    warnings: [],
    next_action: { label: "Progress the Enhanced DBS check", detail: "1 check outstanding", urgency: "normal" },
    references_summary: { required: 2, received: 0, satisfactory: 0, most_recent_employer_received: false },
    reference_chases: [],
    checks_outstanding: ["Enhanced DBS"],
    human_signoff: null,
    exceptional_start: null,
    missing_evidence: [],
    staff_file_index: [],
    one_line_status: "Amber: checks in progress.",
    ...over,
  };
}

function command(candidates: CommandCandidate[]): SaferRecruitmentCommandResult {
  return {
    generated_for: TODAY,
    summary: {
      total_candidates: candidates.length, red: 0, amber: candidates.length, green: 0,
      cleared: 0, exceptional_active: 0, references_outstanding: 0, chases_needing_escalation: 0,
      headline: "test",
    },
    candidates,
  };
}

describe("recruitment-reminder-engine", () => {
  it("maps the chase ladder to tasks with escalating priority and the right key", () => {
    const c = candidate({
      reference_chases: [
        { reference_id: "ref_a", referee_name: "A", organisation: "Org", is_most_recent_employer: false, days_waiting: 1, state: "awaiting", action: "wait" },
        { reference_id: "ref_b", referee_name: "B", organisation: "Org", is_most_recent_employer: false, days_waiting: 3, state: "remind_48h", action: "remind" },
        { reference_id: "ref_c", referee_name: "C", organisation: "Org", is_most_recent_employer: false, days_waiting: 6, state: "second_reminder", action: "second" },
        { reference_id: "ref_d", referee_name: "D", organisation: "Org", is_most_recent_employer: true, days_waiting: 8, state: "escalate_manager", action: "phone" },
        { reference_id: "ref_e", referee_name: "E", organisation: "Org", is_most_recent_employer: false, days_waiting: 12, state: "suggest_alternative", action: "alt" },
      ],
    });
    const specs = deriveReminderSpecs(command([c]));
    const byKey = Object.fromEntries(specs.map((s) => [s.key, s]));
    expect(byKey["srcmd:ref:ref_a:awaiting"]).toBeUndefined(); // awaiting → no task yet
    expect(byKey["srcmd:ref:ref_b:remind_48h"].priority).toBe("medium");
    expect(byKey["srcmd:ref:ref_c:second_reminder"].priority).toBe("high");
    expect(byKey["srcmd:ref:ref_d:escalate_manager"].priority).toBe("urgent");
    expect(byKey["srcmd:ref:ref_d:escalate_manager"].assigned_role).toBe("registered_manager");
    expect(byKey["srcmd:ref:ref_e:suggest_alternative"].priority).toBe("urgent");
    expect(specs.every((s) => s.due_date === TODAY)).toBe(true);
  });

  it("creates an urgent manager task for urgent next-actions", () => {
    const c = candidate({
      next_action: { label: "Review the DBS concern with the Registered Manager today", detail: "Concern flagged", urgency: "urgent" },
    });
    const specs = deriveReminderSpecs(command([c]));
    expect(specs).toHaveLength(1);
    expect(specs[0].priority).toBe("urgent");
    expect(specs[0].assigned_role).toBe("registered_manager");
    expect(specs[0].description).toMatch(/decision and its rationale must be recorded by a person/i);
  });

  it("creates the final sign-off task when the pack is complete", () => {
    const c = candidate({
      next_action: { label: "Final suitability sign-off by the Registered Manager", detail: "Pack complete", urgency: "high" },
    });
    const specs = deriveReminderSpecs(command([c]));
    expect(specs.map((s) => s.key)).toContain("srcmd:cand:cand_1:signoff");
    expect(specs[0].description).toMatch(/belongs to the Registered Manager/i);
  });

  it("creates a per-day exceptional-start review task (key includes the date)", () => {
    const c = candidate({
      start_eligibility: "exceptional_supervised_only",
      exceptional_start: { active: true, approved_by: "staff_olivia", has_risk_mitigation: true, identity_evidenced: true, dbs_evidenced: true, missing: [], daily_review_due: true },
    });
    const specs = deriveReminderSpecs(command([c]));
    expect(specs.map((s) => s.key)).toContain(`srcmd:cand:cand_1:exceptional:${TODAY}`);
  });

  it("creates nothing for cleared candidates", () => {
    const c = candidate({
      start_eligibility: "cleared",
      reference_chases: [{ reference_id: "ref_x", referee_name: "X", organisation: "O", is_most_recent_employer: false, days_waiting: 9, state: "escalate_manager", action: "a" }],
      next_action: { label: "Cleared — schedule induction and onboarding", detail: "", urgency: "normal" },
    });
    expect(deriveReminderSpecs(command([c]))).toHaveLength(0);
  });

  it("round-trips the marker and plans an idempotent sync", () => {
    const c = candidate({
      reference_chases: [
        { reference_id: "ref_b", referee_name: "B", organisation: "Org", is_most_recent_employer: false, days_waiting: 3, state: "remind_48h", action: "remind" },
        { reference_id: "ref_c", referee_name: "C", organisation: "Org", is_most_recent_employer: false, days_waiting: 6, state: "second_reminder", action: "second" },
      ],
    });
    const specs = deriveReminderSpecs(command([c]));
    expect(extractReminderKey(specs[0].description)).toBe(specs[0].key);

    // First sync: nothing open yet → create both.
    const first = planReminderSync(specs, []);
    expect(first.to_create).toHaveLength(2);

    // Second sync: both open → create none.
    const second = planReminderSync(specs, specs.map((s) => s.description));
    expect(second.to_create).toHaveLength(0);
    expect(second.skipped_existing).toHaveLength(2);

    // One completed/closed (its description no longer in the open set) → recreate just that one.
    const third = planReminderSync(specs, [specs[1].description]);
    expect(third.to_create.map((s) => s.key)).toEqual([specs[0].key]);
  });

  it("marker extraction ignores unrelated descriptions", () => {
    expect(extractReminderKey("Chase the GP letter")).toBeNull();
    expect(extractReminderKey(null)).toBeNull();
    expect(extractReminderKey(`done ${reminderMarker("srcmd:cand:x:signoff")}`)).toBe("srcmd:cand:x:signoff");
  });
});

import { describe, it, expect } from "vitest";
import {
  computeChild360,
  type Child360Input,
} from "../child-360-intelligence-engine";

function baseChild(): Child360Input["child"] {
  return {
    id: "c1",
    first_name: "Jayden",
    preferred_name: "Jay",
    date_of_birth: "2010-06-15",
    gender: "Male",
    ethnicity: "White British",
    religion: null,
    placement_start: "2025-01-10",
    placement_end: null,
    placement_type: "Residential",
    legal_status: "Section 20",
    local_authority: "Anytown LA",
    social_worker_name: "Sarah Jones",
    key_worker_id: "s1",
    risk_flags: [],
    allergies: [],
    school_name: "Anytown Academy",
    status: "current",
  };
}

function baseInput(overrides: Partial<Child360Input> = {}): Child360Input {
  return {
    today: "2026-05-26",
    child: baseChild(),
    incidents: [],
    daily_logs: [],
    medications: [],
    medication_administrations: [],
    missing_episodes: [],
    risk_assessments: [],
    keywork_sessions: [],
    outcome_targets: [],
    outcome_reviews: [],
    contact_logs: [],
    education_records: [],
    care_forms: [],
    behaviour_logs: [],
    appointments: [],
    chronology_entries: [],
    staff_name_map: { s1: "Alex Carter" },
    ...overrides,
  };
}

describe("Child 360 Intelligence Engine", () => {
  it("produces stable result for healthy child with minimal data", () => {
    const result = computeChild360(baseInput());
    expect(result.child_id).toBe("c1");
    expect(result.child_name).toBe("Jay");
    expect(result.age_years).toBe(15);
    expect(result.overall_wellbeing).toBe("stable");
    expect(result.domain_scores).toHaveLength(7);
    expect(result.generated_at).toBe("2026-05-26");
  });

  it("computes days in placement correctly", () => {
    const result = computeChild360(baseInput());
    expect(result.days_in_placement).toBeGreaterThan(400);
  });

  it("uses first_name when preferred_name is null", () => {
    const result = computeChild360(baseInput({
      child: { ...baseChild(), preferred_name: null },
    }));
    expect(result.child_name).toBe("Jayden");
  });

  it("marks safety red with critical risk assessment", () => {
    const result = computeChild360(baseInput({
      risk_assessments: [{
        domain: "self_harm", current_level: "critical", previous_level: "high",
        trend: "escalating", status: "current", assessed_date: "2026-05-20",
        review_date: "2026-06-20", triggers: ["isolation"],
      }],
    }));
    expect(result.safety_profile.risk_level).toBe("critical");
    const safeDomain = result.domain_scores.find((d) => d.domain === "safety");
    expect(safeDomain?.rag).toBe("red");
  });

  it("computes emotional wellbeing from mood scores", () => {
    const result = computeChild360(baseInput({
      daily_logs: [
        { date: "2026-05-25", entry_type: "mood", mood_score: 8, is_significant: false, content: "Good day" },
        { date: "2026-05-24", entry_type: "mood", mood_score: 7, is_significant: false, content: "OK day" },
        { date: "2026-05-23", entry_type: "mood", mood_score: 9, is_significant: false, content: "Great day" },
        { date: "2026-05-10", entry_type: "mood", mood_score: 5, is_significant: false, content: "Hard day" },
        { date: "2026-05-05", entry_type: "mood", mood_score: 4, is_significant: false, content: "Sad" },
      ],
    }));
    expect(result.emotional_wellbeing.average_mood_7d).toBe(8);
    expect(result.emotional_wellbeing.average_mood_30d).toBeGreaterThan(5);
    expect(result.emotional_wellbeing.mood_trend).toBe("improving");
  });

  it("marks education red with low attendance", () => {
    const records = [];
    for (let i = 1; i <= 20; i++) {
      records.push({
        record_type: "attendance",
        date: `2026-05-${String(i).padStart(2, "0")}`,
        school: "Anytown Academy",
        attendance_status: i <= 14 ? "present" : "absent",
        status: "recorded",
      });
    }
    const result = computeChild360(baseInput({ education_records: records }));
    expect(result.education_profile.attendance_rate_30d).toBe(70);
    expect(result.education_profile.rag).toBe("red");
  });

  it("computes health profile with medication compliance", () => {
    const result = computeChild360(baseInput({
      medications: [
        { name: "Sertraline", type: "prescribed", dosage: "50mg", frequency: "daily", is_active: true, start_date: "2026-01-01", end_date: null },
      ],
      medication_administrations: [
        { scheduled_time: "2026-05-25 08:00", status: "given", medication_id: "m1" },
        { scheduled_time: "2026-05-24 08:00", status: "given", medication_id: "m1" },
        { scheduled_time: "2026-05-23 08:00", status: "missed", medication_id: "m1" },
        { scheduled_time: "2026-05-22 08:00", status: "given", medication_id: "m1" },
        { scheduled_time: "2026-05-21 08:00", status: "given", medication_id: "m1" },
      ],
    }));
    expect(result.health_profile.active_medications).toBe(1);
    expect(result.health_profile.medication_compliance_7d).toBe(80);
    expect(result.health_profile.missed_doses_7d).toBe(1);
  });

  it("computes relationships profile from contact logs", () => {
    const result = computeChild360(baseInput({
      contact_logs: [
        { date: "2026-05-20", contact_type: "face_to_face", outcome: "positive", yp_voice: "Was nice to see mum" },
        { date: "2026-05-13", contact_type: "telephone", outcome: "positive", yp_voice: null },
        { date: "2026-05-06", contact_type: "face_to_face", outcome: "mixed", yp_voice: null },
      ],
    }));
    expect(result.relationships_profile.contact_sessions_30d).toBe(3);
    expect(result.relationships_profile.positive_contacts_pct).toBe(67);
    expect(result.relationships_profile.contact_consistency).toBe("consistent");
    expect(result.relationships_profile.yp_voice_on_contact).toBe(true);
  });

  it("computes outcomes profile with targets", () => {
    const result = computeChild360(baseInput({
      outcome_targets: [
        { domain: "emotional", target_description: "Manage anger", baseline_rating: 2, current_rating: 5, target_rating: 8, direction: "improving", status: "active", review_date: "2026-06-01" },
        { domain: "education", target_description: "Attend school daily", baseline_rating: 3, current_rating: 2, target_rating: 8, direction: "declining", status: "active", review_date: "2026-06-01" },
        { domain: "independence", target_description: "Cook a meal", baseline_rating: 1, current_rating: 8, target_rating: 8, direction: "improving", status: "achieved", review_date: "2026-04-01" },
      ],
      outcome_reviews: [
        { target_id: "t1", review_date: "2026-05-01", previous_rating: 3, new_rating: 5, direction: "improving", yp_participated: true },
        { target_id: "t2", review_date: "2026-05-01", previous_rating: 3, new_rating: 2, direction: "declining", yp_participated: false },
      ],
    }));
    expect(result.outcomes_profile.total_active_targets).toBe(2);
    expect(result.outcomes_profile.targets_on_track).toBe(1);
    expect(result.outcomes_profile.targets_off_track).toBe(1);
    expect(result.outcomes_profile.targets_achieved).toBe(1);
    expect(result.outcomes_profile.yp_participation_rate).toBe(50);
  });

  it("detects critical overall wellbeing", () => {
    const result = computeChild360(baseInput({
      risk_assessments: [
        { domain: "self_harm", current_level: "critical", previous_level: "high", trend: "escalating", status: "current", assessed_date: "2026-05-20", review_date: "2026-06-20", triggers: [] },
      ],
      incidents: [
        { id: "i1", type: "self_harm", severity: "critical", date: "2026-05-25", description: "Self-harm incident", status: "open", outcome: null },
        { id: "i2", type: "absconding", severity: "high", date: "2026-05-24", description: "Left home", status: "open", outcome: null },
      ],
      missing_episodes: [
        { date_missing: "2026-05-24", date_returned: "2026-05-24", duration_hours: 3, risk_level: "high", return_interview_completed: false, status: "returned" },
        { date_missing: "2026-05-15", date_returned: "2026-05-15", duration_hours: 5, risk_level: "high", return_interview_completed: false, status: "returned" },
        { date_missing: "2026-04-20", date_returned: "2026-04-20", duration_hours: 8, risk_level: "critical", return_interview_completed: false, status: "returned" },
      ],
    }));
    expect(result.overall_wellbeing).toBe("critical");
    expect(result.headline).toContain("immediate");
  });

  it("generates priority actions for safety issues", () => {
    const result = computeChild360(baseInput({
      incidents: [
        { id: "i1", type: "aggression", severity: "high", date: "2026-05-25", description: "Aggression", status: "open", outcome: null },
      ],
      risk_assessments: [
        { domain: "aggression", current_level: "high", previous_level: "medium", trend: "escalating", status: "current", assessed_date: "2026-04-01", review_date: "2026-05-01", triggers: [] },
      ],
    }));
    expect(result.priority_actions.length).toBeGreaterThan(0);
    expect(result.priority_actions[0].action).toContain("open incident");
    expect(result.priority_actions[0].regulatory_ref).toBe("Reg 40");
    const raAction = result.priority_actions.find((a) => a.action.includes("risk assessment"));
    expect(raAction).toBeDefined();
    expect(raAction?.regulatory_ref).toBe("Reg 12");
  });

  it("generates positive insights for thriving child", () => {
    const result = computeChild360(baseInput({
      daily_logs: Array.from({ length: 7 }, (_, i) => ({
        date: `2026-05-${String(20 + i).padStart(2, "0")}`,
        entry_type: "mood" as const,
        mood_score: 8 + (i % 2),
        is_significant: false,
        content: "Great day",
      })),
      keywork_sessions: [
        { theme: "emotional_wellbeing", status: "completed", child_voice: "I feel happy", created_at: "2026-05-20", completed_at: "2026-05-20" },
        { theme: "independence", status: "completed", child_voice: "Learning to cook", created_at: "2026-05-13", completed_at: "2026-05-13" },
      ],
      contact_logs: [
        { date: "2026-05-20", contact_type: "face_to_face", outcome: "positive", yp_voice: "Good visit" },
        { date: "2026-05-13", contact_type: "face_to_face", outcome: "positive", yp_voice: null },
        { date: "2026-05-06", contact_type: "telephone", outcome: "positive", yp_voice: null },
      ],
      outcome_targets: [
        { domain: "emotional", target_description: "Manage anger", baseline_rating: 2, current_rating: 7, target_rating: 8, direction: "improving", status: "active", review_date: "2026-06-01" },
      ],
    }));
    const positiveInsights = result.insights.filter((i) => i.severity === "positive");
    expect(positiveInsights.length).toBeGreaterThan(0);
  });

  it("identifies missing return interview actions", () => {
    const result = computeChild360(baseInput({
      missing_episodes: [
        { date_missing: "2026-05-20", date_returned: "2026-05-20", duration_hours: 4, risk_level: "medium", return_interview_completed: false, status: "returned" },
      ],
    }));
    const riAction = result.priority_actions.find((a) => a.action.includes("return interview"));
    expect(riAction).toBeDefined();
    expect(riAction?.regulatory_ref).toBe("Reg 34");
  });

  it("builds key dates from risk reviews and appointments", () => {
    const result = computeChild360(baseInput({
      risk_assessments: [
        { domain: "exploitation", current_level: "medium", previous_level: "low", trend: "stable", status: "current", assessed_date: "2026-05-01", review_date: "2026-06-15", triggers: [] },
      ],
      appointments: [
        { date: "2026-06-01", type: "CAMHS", provider: "Dr Smith", status: "scheduled", outcome: null },
      ],
    }));
    expect(result.key_dates.length).toBe(2);
    expect(result.key_dates.some((d) => d.label.includes("exploitation"))).toBe(true);
    expect(result.key_dates.some((d) => d.label.includes("CAMHS"))).toBe(true);
  });

  it("flags overdue key dates", () => {
    const result = computeChild360(baseInput({
      risk_assessments: [
        { domain: "self_harm", current_level: "high", previous_level: "high", trend: "stable", status: "current", assessed_date: "2026-03-01", review_date: "2026-05-01", triggers: [] },
      ],
    }));
    const overdueDates = result.key_dates.filter((d) => d.overdue);
    expect(overdueDates.length).toBe(1);
    expect(overdueDates[0]).toEqual(expect.objectContaining({ overdue: true }));
  });

  it("generates placement ending insight for child near end date", () => {
    const result = computeChild360(baseInput({
      child: { ...baseChild(), placement_end: "2026-07-15" },
    }));
    const placementInsight = result.insights.find((i) => i.domain === "placement");
    expect(placementInsight).toBeDefined();
    expect(placementInsight?.text).toContain("Placement ending");
  });

  it("generates age-specific insight for 16+ without outcomes", () => {
    const result = computeChild360(baseInput({
      child: { ...baseChild(), date_of_birth: "2009-05-01" },
      outcome_targets: [
        { domain: "emotional", target_description: "Manage anger", baseline_rating: 2, current_rating: 5, target_rating: 8, direction: "improving", status: "active", review_date: "2026-06-01" },
      ],
    }));
    const ageInsight = result.insights.find((i) => i.text.includes("16+"));
    expect(ageInsight).toBeDefined();
  });

  it("computes engagement profile correctly", () => {
    const result = computeChild360(baseInput({
      daily_logs: Array.from({ length: 6 }, (_, i) => ({
        date: `2026-05-${String(21 + i).padStart(2, "0")}`,
        entry_type: "general" as const,
        mood_score: null,
        is_significant: false,
        content: "Daily entry",
      })),
      keywork_sessions: Array.from({ length: 7 }, (_, i) => ({
        theme: "emotional_wellbeing",
        status: "completed" as const,
        child_voice: "I feel good",
        created_at: `2026-0${3 + Math.floor(i / 3)}-${String(10 + (i % 28)).padStart(2, "0")}`,
        completed_at: `2026-0${3 + Math.floor(i / 3)}-${String(10 + (i % 28)).padStart(2, "0")}`,
      })),
      care_forms: [
        { form_type: "placement_plan", status: "active", next_review: "2026-05-01", created_at: "2025-06-01" },
        { form_type: "behaviour_support", status: "active", next_review: "2026-07-01", created_at: "2025-08-01" },
      ],
    }));
    expect(result.engagement_profile.daily_log_entries_7d).toBe(6);
    expect(result.engagement_profile.keywork_regularity).toBe("regular");
    expect(result.engagement_profile.care_plans_current).toBe(2);
    expect(result.engagement_profile.care_plans_due_review).toBe(1);
  });

  it("caps priority actions at 10", () => {
    const result = computeChild360(baseInput({
      incidents: Array.from({ length: 5 }, (_, i) => ({
        id: `i${i}`, type: "aggression", severity: "high", date: "2026-05-25",
        description: "Incident", status: "open", outcome: null,
      })),
      risk_assessments: Array.from({ length: 5 }, (_, i) => ({
        domain: `domain_${i}`, current_level: "high", previous_level: "medium",
        trend: "escalating", status: "current", assessed_date: "2026-04-01",
        review_date: "2026-04-15", triggers: [],
      })),
      missing_episodes: Array.from({ length: 3 }, () => ({
        date_missing: "2026-05-20", date_returned: "2026-05-20",
        duration_hours: 4, risk_level: "high",
        return_interview_completed: false, status: "returned" as const,
      })),
      medications: [{ name: "Med", type: "prescribed", dosage: "10mg", frequency: "daily", is_active: true, start_date: "2026-01-01", end_date: null }],
      medication_administrations: Array.from({ length: 7 }, (_, i) => ({
        scheduled_time: `2026-05-${String(20 + i).padStart(2, "0")} 08:00`,
        status: "missed", medication_id: "m1",
      })),
    }));
    expect(result.priority_actions.length).toBeLessThanOrEqual(10);
  });
});

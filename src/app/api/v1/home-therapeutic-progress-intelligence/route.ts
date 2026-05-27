// ══════════════════════════════════════════════════════════════════════════════
// API — HOME THERAPEUTIC PROGRESS INTELLIGENCE
// Maps in-memory store → engine input → JSON response.
// ══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeTherapeuticProgress,
  type BehaviourMapInput,
  type SensoryProfileInput,
  type SleepAssessmentInput,
  type EmotionalVocabInput,
  type BereavementInput,
  type AttachmentProfileInput,
  type SelfSoothingToolkitInput,
} from "@/lib/engines/home-therapeutic-progress-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Behaviour Map Entries ──────────────────────────────────────────
  const behaviour_map_entries: BehaviourMapInput[] = (store.behaviourMapEntries as any[]).map((e: any) => ({
    id: e.id,
    child_id: e.child_id,
    date: (e.date ?? "").toString().slice(0, 10),
    behaviour_type: e.behaviour_type ?? "dysregulation",
    intensity: e.intensity ?? "moderate",
    de_escalation_used_count: e.de_escalation_used?.length ?? 0,
    trigger_pattern_present: !!(e.trigger_pattern),
  }));

  // ── Sensory Profiles ───────────────────────────────────────────────
  const sensory_profiles: SensoryProfileInput[] = (store.sensoryProfileRecords as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    assessment_date: (p.assessment_date ?? "").toString().slice(0, 10),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    entries_count: p.entries?.length ?? 0,
    strategies_count: p.strategies?.length ?? 0,
    environmental_adaptations_count: p.environmental_adaptations?.length ?? 0,
    child_views_provided: !!(p.child_views),
  }));

  // ── Sleep Assessments ──────────────────────────────────────────────
  const sleep_assessments: SleepAssessmentInput[] = (store.sleepAssessmentRecords as any[]).map((a: any) => ({
    id: a.id,
    child_id: a.child_id,
    assessment_date: (a.assessment_date ?? "").toString().slice(0, 10),
    review_date: (a.review_date ?? "").toString().slice(0, 10),
    average_hours: a.average_hours ?? 0,
    sleep_quality: a.sleep_quality ?? "fair",
    night_wakings: a.night_wakings ?? 0,
    strategies_count: a.strategies?.length ?? 0,
    trend: a.trend ?? "stable",
  }));

  // ── Emotional Vocabulary Records ───────────────────────────────────
  const emotional_vocab_records: EmotionalVocabInput[] = (store.emotionalVocabRecords as any[]).map((r: any) => ({
    id: r.id,
    child_id: r.child_id,
    recorded_date: (r.recorded_date ?? "").toString().slice(0, 10),
    review_date: (r.review_date ?? "").toString().slice(0, 10),
    feelings_recognised_count: r.feelings_recognised?.length ?? 0,
    tools_in_use_count: r.tools_in_use?.length ?? 0,
    breakthroughs_count: r.breakthroughs?.length ?? 0,
    child_voice_provided: !!(r.child_voice),
  }));

  // ── Bereavement Records ────────────────────────────────────────────
  const bereavement_records: BereavementInput[] = (store.bereavementRecords as any[]).map((r: any) => ({
    id: r.id,
    child_id: r.child_id,
    record_date: (r.record_date ?? "").toString().slice(0, 10),
    review_date: (r.review_date ?? "").toString().slice(0, 10),
    grief_stage: r.grief_stage ?? "adjusting",
    support_provided_count: r.support_provided?.length ?? 0,
    memory_work_count: r.memory_work?.length ?? 0,
    child_voice_provided: !!(r.child_voice),
    external_support_present: !!(r.external_support),
  }));

  // ── Attachment Profiles ────────────────────────────────────────────
  const attachment_profiles: AttachmentProfileInput[] = (store.attachmentProfiles as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    assessment_date: (p.assessment_date ?? "").toString().slice(0, 10),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    primary_style: p.primary_style ?? "anxious_avoidant",
    therapeutic_approach_count: p.therapeutic_approach?.length ?? 0,
    staff_guidance_count: p.staff_guidance?.length ?? 0,
    protective_factors_count: p.protective_factors?.length ?? 0,
    child_views_provided: !!(p.child_views),
  }));

  // ── Self-Soothing Toolkits ─────────────────────────────────────────
  const self_soothing_toolkits: SelfSoothingToolkitInput[] = (store.selfSoothingToolkits as any[]).map((t: any) => ({
    id: t.id,
    child_id: t.child_id,
    last_updated: (t.last_updated ?? "").toString().slice(0, 10),
    review_date: (t.review_date ?? "").toString().slice(0, 10),
    total_strategies_count:
      (t.sensory_strategies?.length ?? 0) +
      (t.breathing_strategies?.length ?? 0) +
      (t.movement_strategies?.length ?? 0) +
      (t.distraction_strategies?.length ?? 0) +
      (t.co_regulation_strategies?.length ?? 0),
    child_chose_all: !!(t.child_chose_all),
    effectiveness_rating: t.effectiveness_rating ?? "not_yet_assessed",
    child_voice_provided: !!(t.child_voice),
  }));

  const result = computeHomeTherapeuticProgress({
    today,
    behaviour_map_entries,
    sensory_profiles,
    sleep_assessments,
    emotional_vocab_records,
    bereavement_records,
    attachment_profiles,
    self_soothing_toolkits,
    total_children: store.children?.length ?? 0,
  });

  return NextResponse.json({ data: result });
}

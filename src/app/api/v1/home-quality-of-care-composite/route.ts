import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeQualityOfCare } from "@/lib/engines/home-quality-of-care-composite-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const tc = (children as any[]).length;

  // Child voice
  const feedback = (store.ypFeedbackEntries as any[] ?? []);
  const feedbackActed = feedback.filter((f: any) => f.acted_on || f.action_taken || f.status === "actioned").length;
  const houseMeetings = (store.houseMeetings as any[] ?? []);
  const houseMeetingsHeld = houseMeetings.filter((h: any) => h.held || h.completed || h.status === "completed").length;
  // Count unique children with voice captured via feedback or meetings
  const voiceChildren = new Set([
    ...feedback.map((f: any) => f.child_id ?? f.young_person_id),
    ...houseMeetings.flatMap((h: any) => h.attendees ?? []),
  ].filter(Boolean));

  // Participation
  const councilChildren = (children as any[]).filter((c: any) => c.on_council || c.on_forum || c.participation_role).length;
  const advocacyRecords = (store.advocacyRecords as any[] ?? []);
  const advocacyAccepted = advocacyRecords.filter((a: any) => a.accepted || a.status === "accepted" || a.status === "active").length;

  // Key working
  const kwSessions = (store.keyWorkingSessions as any[] ?? []);
  const kwCompleted = kwSessions.filter((k: any) => k.completed || k.status === "completed").length;
  const kwAllocated = (children as any[]).filter((c: any) => c.keyworker_id || c.key_worker_id || c.keyworkerId).length;

  // Cultural identity
  const culPlans = (store.culturalIdentityPlans as any[] ?? []);
  const childrenWithCulPlan = new Set(culPlans.map((c: any) => c.child_id ?? c.young_person_id).filter(Boolean)).size;
  const culVisits = (store.culturalVisits as any[] ?? []);
  const culVisitsCompleted = culVisits.filter((v: any) => v.completed || v.status === "completed").length;
  const diversityEvents = (store.diversityCalendarEvents as any[] ?? []);
  const diversityHeld = diversityEvents.filter((e: any) => e.held || e.completed || e.status === "completed").length;
  const herLangRecords = (store.heritageLanguageRecords as any[] ?? []);
  const herSupported = new Set(herLangRecords.map((r: any) => r.child_id ?? r.young_person_id).filter(Boolean)).size;

  // Life story
  const lifeStories = (store.lifeStoryEntries as any[] ?? []);
  const childrenWithLS = new Set(lifeStories.map((l: any) => l.child_id ?? l.young_person_id).filter(Boolean)).size;
  const lsUpToDate = new Set(lifeStories.filter((l: any) => l.up_to_date || l.current || l.status === "current").map((l: any) => l.child_id ?? l.young_person_id).filter(Boolean)).size;
  const passports = (store.personalPassports as any[] ?? []);
  const childrenWithPP = new Set(passports.map((p: any) => p.child_id ?? p.young_person_id).filter(Boolean)).size;

  // Therapeutic climate
  const attachProfiles = (store.attachmentProfiles as any[] ?? []);
  const childrenWithAttach = new Set(attachProfiles.map((a: any) => a.child_id ?? a.young_person_id).filter(Boolean)).size;
  const therapySessions = (store.therapeuticSessions as any[] ?? []);
  const thAttended = therapySessions.filter((s: any) => s.attended || s.status === "attended").length;
  const sensoryProfiles = (store.sensoryProfileRecords as any[] ?? []);
  const childrenWithSensory = new Set(sensoryProfiles.map((s: any) => s.child_id ?? s.young_person_id).filter(Boolean)).size;
  const emoVocab = (store.emotionalVocabRecords as any[] ?? []);
  const emoSessions = emoVocab.length;

  // Social
  const friendshipMaps = (store.friendshipMaps as any[] ?? []);
  const childrenWithFM = new Set(friendshipMaps.map((f: any) => f.child_id ?? f.young_person_id).filter(Boolean)).size;
  const aspirations = (store.aspirationRecords as any[] ?? []);
  const childrenWithAsp = new Set(aspirations.map((a: any) => a.child_id ?? a.young_person_id).filter(Boolean)).size;

  const result = computeQualityOfCare({
    today: new Date().toISOString().slice(0, 10),
    total_children: tc,
    feedback_entries_total: feedback.length,
    feedback_entries_acted_on: feedbackActed,
    house_meetings_held: houseMeetingsHeld,
    house_meetings_due: houseMeetings.length,
    children_with_voice_captured: Math.min(voiceChildren.size, tc),
    children_on_council_or_forum: councilChildren,
    advocacy_referrals_offered: advocacyRecords.length,
    advocacy_referrals_accepted: advocacyAccepted,
    keywork_sessions_completed: kwCompleted,
    keywork_sessions_due: kwSessions.length,
    children_with_keyworker_allocated: kwAllocated,
    children_with_cultural_plan: childrenWithCulPlan,
    cultural_visits_completed: culVisitsCompleted,
    cultural_visits_planned: culVisits.length,
    diversity_events_held: diversityHeld,
    heritage_language_supported: herSupported,
    children_with_life_story: childrenWithLS,
    life_stories_up_to_date: lsUpToDate,
    children_with_personal_passport: childrenWithPP,
    children_with_attachment_profile: childrenWithAttach,
    therapeutic_sessions_attended: thAttended,
    therapeutic_sessions_offered: therapySessions.length,
    children_with_sensory_profile: childrenWithSensory,
    emotional_vocab_sessions: emoSessions,
    children_with_friendship_map: childrenWithFM,
    children_with_aspiration_record: childrenWithAsp,
  });

  return NextResponse.json({ data: result });
}

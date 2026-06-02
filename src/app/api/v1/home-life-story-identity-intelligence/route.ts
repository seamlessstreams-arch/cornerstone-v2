import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeLifeStoryIdentity,
  type LifeStoryInput, type PersonalPassportInput, type FriendshipMapInput,
  type AspirationInput, type LgbtqInclusionInput, type StyleIdentityInput,
} from "@/lib/engines/home-life-story-identity-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  const life_story_entries: LifeStoryInput[] = (store.lifeStoryEntries as any[]).map((e: any) => ({
    id: e.id, child_id: e.child_id ?? "",
    date: (e.date ?? "").toString().slice(0, 10),
    entry_type: e.type ?? "memory",
    child_voice: e.child_voice ?? "",
    linked_to_book: !!(e.linked_to_book),
    status: e.status ?? "planned",
  }));

  const personal_passports: PersonalPassportInput[] = (store.personalPassports as any[]).map((p: any) => {
    const sectionFields = ["my_strengths", "what_makes_me_happy", "what_makes_me_upset", "what_helps_when_i_am_upset", "my_interests", "my_favourite_food", "food_i_dont_like", "my_music", "my_friends", "my_family", "my_dreams", "my_fears", "important_people", "my_routines", "things_im_working_on", "signs_im_not_okay", "things_to_know_about_me", "my_culture", "my_faith", "my_style"];
    const completed = sectionFields.filter(f => {
      const v = (p as any)[f];
      if (Array.isArray(v)) return v.length > 0;
      return v && String(v).trim().length > 0;
    }).length;
    return {
      id: p.id, child_id: p.child_id ?? "",
      last_updated: (p.last_updated ?? "").toString().slice(0, 10),
      child_authored: !!(p.child_authored),
      sections_completed: completed,
      reviewed_with_child: !!(p.review_with_child_date),
    };
  });

  const friendship_maps: FriendshipMapInput[] = (store.friendshipMaps as any[]).map((f: any) => ({
    id: f.id, child_id: f.child_id ?? "",
    map_date: (f.map_date ?? "").toString().slice(0, 10),
    friends_count: f.friends?.length ?? 0,
    isolation_risk: f.isolation_risk ?? "none",
    support_strategies_count: f.support_to_build_friendships?.length ?? 0,
    reviewed: !!(f.reviewed_date),
  }));

  const aspirations: AspirationInput[] = (store.aspirationRecords as any[]).map((a: any) => ({
    id: a.id, child_id: a.child_id ?? "",
    recorded_date: (a.recorded_date ?? "").toString().slice(0, 10),
    child_chose: !!(a.child_chose),
    steps_taken_count: a.steps_taken?.length ?? 0,
    review_date: (a.review_date ?? "").toString().slice(0, 10),
    progress_status: a.current_realism ?? "realistic",
  }));

  const lgbtq_inclusions: LgbtqInclusionInput[] = (store.lgbtqInclusionRecords as any[]).map((l: any) => ({
    id: l.id, child_id: l.child_id ?? "",
    last_updated: (l.last_updated ?? "").toString().slice(0, 10),
    pronouns_used_consistently: !!(l.pronouns_used_consistently),
    preferred_name_used_consistently: !!(l.preferred_name_used_consistently),
    identity_affirming_actions_count: l.identity_affirming_actions?.length ?? 0,
    child_voice_present: !!(l.child_voice && String(l.child_voice).trim().length > 0),
  }));

  const style_identities: StyleIdentityInput[] = (store.styleIdentityRecords as any[]).map((s: any) => ({
    id: s.id, child_id: s.child_id ?? "",
    recorded_date: (s.recorded_date ?? "").toString().slice(0, 10),
    child_voice: s.child_voice ?? "",
    style_descriptors_count: s.style_descriptors?.length ?? 0,
    identity_elements_count: s.identity_elements?.length ?? 0,
    review_date: (s.review_date ?? "").toString().slice(0, 10),
  }));

  const result = computeHomeLifeStoryIdentity({
    today, life_story_entries, personal_passports, friendship_maps,
    aspirations, lgbtq_inclusions, style_identities,
    total_children: store.children?.length ?? 0,
  });

  return NextResponse.json({ data: result });
}

// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME FRIENDSHIP & SOCIAL NETWORK INTELLIGENCE API ROUTE
// GET /api/v1/home-friendship-social-network-intelligence
// Cross-domain composite: friendshipMappingRecords + socialNetworkRecords +
// peerSupportRecords + isolationPreventionRecords + childSatisfactionRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeFriendshipSocialNetwork,
  type FriendshipMappingInput,
  type SocialNetworkInput,
  type PeerSupportInput,
  type IsolationPreventionInput,
  type ChildSatisfactionInput,
} from "@/lib/engines/home-friendship-social-network-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawMappings = (store.friendshipMappingRecords ?? []) as any[];
    const friendship_mapping_records: FriendshipMappingInput[] = rawMappings.map((m: any) => ({
      id: m.id ?? "",
      child_id: m.child_id ?? "",
      mapping_date: (m.mapping_date ?? today).toString(),
      mapper_role: m.mapper_role ?? "keyworker",
      total_friends_identified: m.total_friends_identified ?? 0,
      friends_in_home: m.friends_in_home ?? 0,
      friends_outside_home: m.friends_outside_home ?? 0,
      friends_from_school: m.friends_from_school ?? 0,
      friends_from_community: m.friends_from_community ?? 0,
      online_friends_identified: m.online_friends_identified ?? 0,
      friendship_quality_rating: m.friendship_quality_rating ?? 3,
      child_involved_in_mapping: !!m.child_involved_in_mapping,
      support_plan_in_place: !!m.support_plan_in_place,
      review_date: m.review_date ?? null,
      review_overdue: !!m.review_overdue,
      concerns_identified: !!m.concerns_identified,
      concerns_description: m.concerns_description ?? "",
      created_at: (m.created_at ?? today).toString(),
    }));

    const rawNetworks = (store.socialNetworkRecords ?? []) as any[];
    const social_network_records: SocialNetworkInput[] = rawNetworks.map((n: any) => ({
      id: n.id ?? "",
      child_id: n.child_id ?? "",
      assessment_date: (n.assessment_date ?? today).toString(),
      network_type: n.network_type ?? "peer",
      contacts_count: n.contacts_count ?? 0,
      positive_contacts: n.positive_contacts ?? 0,
      negative_contacts: n.negative_contacts ?? 0,
      neutral_contacts: n.neutral_contacts ?? 0,
      network_stability: n.network_stability ?? "stable",
      child_satisfaction_with_network: n.child_satisfaction_with_network ?? 3,
      barriers_identified: !!n.barriers_identified,
      barriers_description: n.barriers_description ?? "",
      support_provided: !!n.support_provided,
      review_date: n.review_date ?? null,
      review_overdue: !!n.review_overdue,
      created_at: (n.created_at ?? today).toString(),
    }));

    const rawPeerSupport = (store.peerSupportRecords ?? []) as any[];
    const peer_support_records: PeerSupportInput[] = rawPeerSupport.map((p: any) => ({
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      activity_date: (p.activity_date ?? today).toString(),
      activity_type: p.activity_type ?? "group_activity",
      participants_count: p.participants_count ?? 0,
      child_engagement_rating: p.child_engagement_rating ?? 3,
      peer_interaction_quality: p.peer_interaction_quality ?? 3,
      staff_facilitated: !!p.staff_facilitated,
      child_reported_enjoyment: !!p.child_reported_enjoyment,
      skills_developed: Array.isArray(p.skills_developed) ? p.skills_developed : [],
      outcome_positive: !!p.outcome_positive,
      notes_recorded: !!p.notes_recorded,
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawIsolation = (store.isolationPreventionRecords ?? []) as any[];
    const isolation_prevention_records: IsolationPreventionInput[] = rawIsolation.map((i: any) => ({
      id: i.id ?? "",
      child_id: i.child_id ?? "",
      identified_date: (i.identified_date ?? today).toString(),
      risk_level: i.risk_level ?? "low",
      isolation_indicators: Array.isArray(i.isolation_indicators) ? i.isolation_indicators : [],
      intervention_type: i.intervention_type ?? "friendship_facilitation",
      intervention_start_date: (i.intervention_start_date ?? today).toString(),
      intervention_active: i.intervention_active !== false,
      progress_rating: i.progress_rating ?? 3,
      child_engagement: i.child_engagement ?? 3,
      outcome_improved: !!i.outcome_improved,
      review_date: i.review_date ?? null,
      review_overdue: !!i.review_overdue,
      escalated_to_professional: !!i.escalated_to_professional,
      created_at: (i.created_at ?? today).toString(),
    }));

    const rawSatisfaction = (store.childSatisfactionRecords ?? []) as any[];
    const child_satisfaction_records: ChildSatisfactionInput[] = rawSatisfaction.map((s: any) => ({
      id: s.id ?? "",
      child_id: s.child_id ?? "",
      survey_date: (s.survey_date ?? today).toString(),
      satisfaction_with_friendships: s.satisfaction_with_friendships ?? 3,
      feels_supported_by_staff: !!s.feels_supported_by_staff,
      feels_included: !!s.feels_included,
      has_best_friend: !!s.has_best_friend,
      feels_lonely: !!s.feels_lonely,
      wants_more_social_opportunities: !!s.wants_more_social_opportunities,
      confidence_in_social_situations: s.confidence_in_social_situations ?? 3,
      satisfaction_with_contact_arrangements: s.satisfaction_with_contact_arrangements ?? 3,
      free_text_feedback: s.free_text_feedback ?? "",
      created_at: (s.created_at ?? today).toString(),
    }));

    const result = computeFriendshipSocialNetwork({
      today,
      total_children,
      friendship_mapping_records,
      social_network_records,
      peer_support_records,
      isolation_prevention_records,
      child_satisfaction_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}

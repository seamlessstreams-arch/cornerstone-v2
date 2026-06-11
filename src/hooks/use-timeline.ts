"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — UNIVERSAL TIMELINE HOOKS
//
// React Query hooks for the universal timeline.
// Uses the same api helper and refetch pattern as use-dashboard.
// ══════════════════════════════════════════════════════════════════════════════

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { TimelineEvent, TimelineFilter } from "@/lib/timeline/types";

interface TimelineResponse {
  data: TimelineEvent[];
  total: number;
}

function buildQueryString(filter: TimelineFilter): string {
  const params = new URLSearchParams();

  if (filter.child_id) params.set("child_id", filter.child_id);
  if (filter.staff_id) params.set("staff_id", filter.staff_id);
  if (filter.home_id) params.set("home_id", filter.home_id);
  if (filter.date_from) params.set("date_from", filter.date_from);
  if (filter.date_to) params.set("date_to", filter.date_to);
  if (filter.search) params.set("search", filter.search);
  if (filter.limit) params.set("limit", String(filter.limit));
  if (filter.offset) params.set("offset", String(filter.offset));
  if (filter.event_types?.length) params.set("event_types", filter.event_types.join(","));
  if (filter.risk_levels?.length) params.set("risk_levels", filter.risk_levels.join(","));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useTimeline(filter: TimelineFilter) {
  return useQuery({
    queryKey: ["timeline", filter],
    queryFn: () =>
      api.get<TimelineResponse>(`/timeline${buildQueryString(filter)}`),
    refetchInterval: 30_000,
  });
}

export function useChildTimeline(childId: string) {
  return useTimeline({ child_id: childId, limit: 50 });
}

export function useHomeTimeline() {
  return useTimeline({ home_id: "home_oak", limit: 50 });
}

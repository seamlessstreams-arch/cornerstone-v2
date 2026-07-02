"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";
import type { RelationalTimeline } from "@/lib/relational-timeline/relational-timeline-engine";

/**
 * Fetch a child's Relational Timeline — the relational story + Relationship
 * Intelligence projected from their existing records.
 */
export function useRelationalTimeline(childId: string | undefined) {
  return useQuery({
    queryKey: ["relational-timeline", childId],
    enabled: !!childId,
    queryFn: async () =>
      (
        await api.get<{ data: RelationalTimeline }>(
          `/relational-timeline?child_id=${encodeURIComponent(childId!)}`,
        )
      ).data,
  });
}

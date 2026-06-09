"use client";

import { useQuery } from "@tanstack/react-query";
import type { WorkforceCommand } from "@/lib/engines/workforce-command-engine";

export interface RecentActivity { kind: string; label: string; when: string; href: string }
export interface WorkforceCommandResponse extends WorkforceCommand {
  recent_activity: RecentActivity[];
}

export function useWorkforceCommand() {
  return useQuery<WorkforceCommandResponse>({
    queryKey: ["workforce-command"],
    queryFn: async () => {
      const res = await fetch("/api/v1/workforce-command");
      if (!res.ok) throw new Error("Failed to fetch workforce command");
      return (await res.json()).data;
    },
    refetchInterval: 120_000,
  });
}

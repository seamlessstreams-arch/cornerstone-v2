"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SaferRecruitmentCommandResult } from "@/lib/engines/safer-recruitment-command-engine";

export function useSaferRecruitmentCommand() {
  return useQuery<SaferRecruitmentCommandResult>({
    queryKey: ["safer-recruitment-command"],
    queryFn: async () => {
      const res = await fetch("/api/v1/safer-recruitment-command");
      if (!res.ok) throw new Error("Failed to fetch safer recruitment command centre");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 120_000,
  });
}

export interface IssuedReferenceLink {
  link: string;
  expires_at: string;
  referee_name: string;
  note: string;
}

export interface ReminderSyncResult {
  created: number;
  skipped_existing: number;
  tasks: { id: string; title: string; priority: string }[];
}

export function useSyncChaseReminders() {
  const qc = useQueryClient();
  return useMutation<ReminderSyncResult, Error, void>({
    mutationFn: async () => {
      const res = await fetch("/api/v1/safer-recruitment-command/sync-reminders", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Couldn't sync chase reminders");
      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["safer-recruitment-command"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useIssueReferenceLink() {
  const qc = useQueryClient();
  return useMutation<IssuedReferenceLink, Error, string>({
    mutationFn: async (referenceId: string) => {
      const res = await fetch(`/api/v1/safer-recruitment-command/references/${referenceId}/link`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Couldn't issue the reference link");
      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["safer-recruitment-command"] });
    },
  });
}

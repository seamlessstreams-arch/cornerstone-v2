"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./use-api";

export interface SlaEscalation {
  task_id: string;
  title: string;
  category: string;
  priority: string;
  severity: "critical" | "high" | "medium" | "watch";
  days_overdue: number;
  due_date: string | null;
  is_statutory: boolean;
  reason: string;
  child_id?: string | null;
  linked_record_type?: string | null;
  linked_record_id?: string | null;
}

interface TaskSlaResponse {
  data: SlaEscalation[];
  summary: {
    active_tasks: number;
    overdue: number;
    breached_critical: number;
    breached_high: number;
    approaching: number;
    statutory_overdue: number;
  };
  by_category: { category: string; overdue: number }[];
  headline: string;
}

/**
 * Task SLA breach monitor — reads GET /api/v1/task-sla-monitor.
 * Surfaces overdue deadline-bound tasks created by the Enter Once orchestrators.
 * (Distinct from useEscalations, which manages manual escalation records.)
 */
export function useTaskSla(params?: { severity?: string; statutoryOnly?: boolean }) {
  const q = new URLSearchParams();
  if (params?.severity) q.set("severity", params.severity);
  if (params?.statutoryOnly) q.set("statutory", "true");
  const qs = q.toString();

  return useQuery({
    queryKey: ["task-sla", params],
    queryFn: () => api.get<TaskSlaResponse>(`/task-sla-monitor${qs ? `?${qs}` : ""}`),
    refetchInterval: 60_000,
  });
}

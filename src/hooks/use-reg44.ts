"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./use-api";
import { toastSuccess, toastError } from "@/lib/toast";
import type { Reg44VisitReport, Reg44Recommendation } from "@/types/extended";

interface Reg44Response {
  data: Reg44VisitReport[];
}

interface UpdateRecommendationPayload {
  visit_id: string;
  recommendation_id: string;
  status: "completed" | "in_progress" | "outstanding";
  evidence_notes?: string;
}

interface CreateVisitPayload {
  visit_date: string;
  visitor: string;
  duration: string;
  children_spoken: string;
  staff_spoken: number;
  overall_judgement: string;
  notes: string;
  records_reviewed?: string[];
  strengths?: string[];
  areas_for_development?: string[];
  recommendations?: Reg44Recommendation[];
  report_sent_to_ofsted?: boolean;
  report_sent_date?: string;
  previous_actions_status?: string;
}

export function useReg44Visits() {
  return useQuery({
    queryKey: ["reg44"],
    queryFn: () => api.get<Reg44Response>("/reg44"),
  });
}

export function useUpdateRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRecommendationPayload) =>
      api.patch<{ data: Reg44Recommendation }>("/reg44", data),
    onSuccess: (_res, variables) => {
      const label =
        variables.status === "completed"
          ? "Completed"
          : variables.status === "in_progress"
            ? "In Progress"
            : "Outstanding";
      toastSuccess("Recommendation updated", `Status set to ${label}.`);
      qc.invalidateQueries({ queryKey: ["reg44"] });
    },
    onError: () => toastError("Update failed", "Could not update recommendation status."),
  });
}

export function useCreateVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVisitPayload) =>
      api.post<{ data: Reg44VisitReport }>("/reg44", data),
    onSuccess: () => {
      toastSuccess("Visit recorded", "New Reg 44 visit report has been saved.");
      qc.invalidateQueries({ queryKey: ["reg44"] });
    },
    onError: () => toastError("Create failed", "Could not save visit report."),
  });
}

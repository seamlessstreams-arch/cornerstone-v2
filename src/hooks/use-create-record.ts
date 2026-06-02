import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateRecordInput } from "@/lib/orchestrator/universal-record-orchestrator";

// ── Types ───────────────────────────────────────────────────────────────────

interface CreateRecordResponse {
  data: Record<string, unknown>;
  linked_updates: string[];
  alerts: string[];
  meta: {
    tasks_created: number;
    has_alerts: boolean;
    risk_level: string;
    reference: string;
  };
}

interface CreateRecordError {
  error: string;
  fields?: string[];
}

// ── Query keys that should be invalidated per record type ───────────────────

const INVALIDATION_MAP: Record<string, string[]> = {
  safeguarding_concern: ["safeguarding", "timeline", "tasks", "dashboard"],
  risk_assessment: ["risk-assessments", "timeline", "tasks", "dashboard"],
  care_plan: ["care-plans", "timeline", "tasks", "dashboard"],
  key_work_session: ["key-work-sessions", "timeline", "dashboard"],
  direct_work: ["direct-work", "timeline", "dashboard"],
  health_update: ["health-updates", "timeline", "dashboard"],
  education_update: ["education-records", "timeline", "dashboard"],
  family_contact: ["family-contacts", "timeline"],
  professional_contact: ["professional-contacts", "timeline"],
  supervision: ["supervisions", "timeline", "tasks", "dashboard"],
  welfare_check: ["welfare-checks", "timeline", "dashboard"],
  complaint: ["complaints", "timeline", "tasks", "dashboard"],
  medication: ["medications", "timeline", "tasks", "dashboard"],
  restraint: ["restraints", "timeline", "tasks", "dashboard"],
  missing_from_care: ["missing-episodes", "timeline", "tasks", "dashboard"],
  fire_drill: ["fire-drills", "timeline", "dashboard"],
  vehicle_check: ["vehicle-checks", "timeline", "dashboard"],
  observation: ["observations", "timeline", "dashboard"],
  training_record: ["training-records", "timeline", "dashboard"],
};

// ── Hook ────────────────────────────────────────────────────────────────────

export function useCreateRecord() {
  const qc = useQueryClient();

  return useMutation<CreateRecordResponse, CreateRecordError, CreateRecordInput>({
    mutationFn: async (input: CreateRecordInput) => {
      const res = await fetch("/api/v1/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const json = await res.json();

      if (!res.ok) {
        throw json as CreateRecordError;
      }

      return json as CreateRecordResponse;
    },

    onSuccess: (_data, variables) => {
      // Invalidate relevant queries for the record type
      const keys = INVALIDATION_MAP[variables.record_type] ?? ["timeline", "dashboard"];
      for (const key of keys) {
        qc.invalidateQueries({ queryKey: [key] });
      }

      // Always invalidate the generic records query
      qc.invalidateQueries({ queryKey: ["records"] });

      // Invalidate child-specific queries if a child was linked
      if (variables.child_id) {
        qc.invalidateQueries({ queryKey: ["child", variables.child_id] });
        qc.invalidateQueries({ queryKey: ["child-timeline", variables.child_id] });
      }
    },
  });
}

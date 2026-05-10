"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wand2, FileText, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AriaQuickActionContext, AriaArtifactType } from "@/types/aria-studio";
import { ARIA_ARTIFACT_TYPE_LABELS } from "@/types/aria-studio";

const CONTEXT_ARTIFACT_TYPES: Record<string, AriaArtifactType[]> = {
  daily_log: ["keywork_session", "management_oversight", "risk_review"],
  incident: ["incident_learning_review", "risk_review", "safeguarding_review", "management_oversight"],
  keywork: ["keywork_session", "child_friendly_explanation", "supervision_prompt"],
  risk_assessment: ["risk_review", "safeguarding_review", "management_oversight"],
  missing_from_care: ["risk_review", "safeguarding_review", "social_worker_update"],
  management_oversight: ["management_oversight", "reg45_summary", "ri_briefing"],
  reg45: ["reg45_summary", "ofsted_readiness_summary", "ri_briefing"],
  safeguarding: ["safeguarding_review", "risk_review", "social_worker_update", "management_oversight"],
};

const DEFAULT_TYPES: AriaArtifactType[] = [
  "keywork_session", "management_oversight", "risk_review", "reg45_summary",
];

interface AriaStudioQuickActionButtonProps {
  context: AriaQuickActionContext;
  size?: "default" | "sm" | "xs";
  className?: string;
}

export function AriaStudioQuickActionButton({
  context,
  size = "sm",
  className,
}: AriaStudioQuickActionButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const types = CONTEXT_ARTIFACT_TYPES[context.record_type] ?? DEFAULT_TYPES;

  const handleGenerate = (artifactType: AriaArtifactType) => {
    const params = new URLSearchParams({
      from: context.record_type,
      record_id: context.record_id,
      artifact_type: artifactType,
    });
    if (context.child_id) params.set("child_id", context.child_id);
    if (context.home_id) params.set("home_id", context.home_id);
    setOpen(false);
    router.push(`/intelligence/aria/studio?${params.toString()}`);
  };

  return (
    <>
      <Button
        variant="outline"
        size={size === "xs" ? "sm" : size}
        className={`gap-1.5 ${className ?? ""}`}
        onClick={() => setOpen(true)}
      >
        <Wand2 className="h-3.5 w-3.5 text-violet-600" />
        <span>Generate with ARIA</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <Wand2 className="h-4 w-4 text-violet-600" />
              Generate from this record
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1 py-1">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => handleGenerate(type)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                <FileText className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                {ARIA_ARTIFACT_TYPE_LABELS[type] ?? type}
              </button>
            ))}
            <div className="border-t mt-2 pt-2">
              <button
                onClick={() => { setOpen(false); router.push("/intelligence/aria/studio"); }}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground w-full px-3 py-2 rounded-md hover:bg-muted/50"
              >
                <Layers className="h-3.5 w-3.5" />
                Open ARIA Studio
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EVENT CAPTURE (write path) detail page
// "Capture once, validate once, route everywhere" — the pre-submission preview.
// ══════════════════════════════════════════════════════════════════════════════

import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FilePlus2, Brain, Loader2, Info, CheckCircle2, XCircle, Copy, Route, Archive, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEventCapture } from "@/hooks/use-event-capture";

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800", warning: "border-amber-200 bg-amber-50 text-amber-800", positive: "border-green-200 bg-green-50 text-green-800",
};

export default function EventCapturePage() {
  const { data, isLoading } = useEventCapture();
  const intel = data?.data;

  return (
    <PageShell
      title="Event Capture — Write Path"
      subtitle="Capture once, validate once, route everywhere — what happens to a record the moment it's submitted, previewed before it saves"
      icon={<FilePlus2 className="h-5 w-5" />}
      showQuickCreate={false}
      ariaContext={{ pageTitle: "Event Capture", sourceType: "general" }}
    >
      {isLoading || !intel ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-[var(--cs-text-muted)]" /></div>
      ) : (
        <div className="space-y-6">

          <div className="rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-bg)] p-4 flex gap-3">
            <Info className="h-4 w-4 text-[var(--cs-text-muted)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--cs-text-secondary)] leading-relaxed">
              A form is just a way to capture an event <strong>once</strong>. The moment it's submitted, the orchestrator
              validates it against fixed rules, checks it isn't a duplicate, decides which workflows it routes to and which
              evidence it builds — so one entry surfaces everywhere it's needed, nothing is re-typed, and nothing
              externally-facing fires without approval. This is that preview, shown on a representative draft.
            </p>
          </div>

          <div className={cn("rounded-2xl border p-4 flex items-center gap-3", intel.ready_to_submit ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50")}>
            {intel.ready_to_submit ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-amber-600" />}
            <div>
              <p className={cn("text-sm font-semibold", intel.ready_to_submit ? "text-green-700" : "text-amber-700")}>{intel.ready_to_submit ? "Ready to submit" : "Held for review before submission"}</p>
              {intel.blocks.length > 0 && <ul className="text-xs text-amber-800 mt-1 list-disc ml-4">{intel.blocks.map((b, i) => <li key={i}>{b}</li>)}</ul>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Validation */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2">{intel.validation.passed ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />} Validation</CardTitle></CardHeader>
              <CardContent className="text-xs space-y-1">
                {intel.validation.issues.length === 0 && <p className="text-green-700">All mandatory fields present.</p>}
                {intel.validation.issues.map((iss, i) => (
                  <p key={i} className={cn("flex items-start gap-1", iss.severity === "error" ? "text-red-700" : "text-amber-700")}>
                    <span className="font-medium">{iss.field}:</span> {iss.message}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* Duplicates */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Copy className="h-4 w-4 text-brand" /> Duplicate check</CardTitle></CardHeader>
              <CardContent className="text-xs space-y-1">
                {!intel.duplicates.suspected && <p className="text-green-700">No existing event matches — safe to create.</p>}
                {intel.duplicates.matches.map((m, i) => (
                  <p key={i} className="text-amber-700">Matches <span className="font-mono">{m.event_id}</span> ({Math.round(m.similarity * 100)}%) — {m.reason}</p>
                ))}
              </CardContent>
            </Card>

            {/* Routing */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Route className="h-4 w-4 text-brand" /> Will route to</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {intel.routing.destinations.map((d, i) => <Badge key={i} className="text-[10px] bg-gray-50 text-gray-600 border">{d}</Badge>)}
                  {intel.routing.external_apis.map((a, i) => <Badge key={`e${i}`} className="text-[10px] bg-red-50 text-red-700 border-red-200">{a} (gated)</Badge>)}
                </div>
                {intel.routing.requires_human_approval && <p className="text-[10px] text-amber-700 mt-1.5">Requires human approval before external notifications send.</p>}
              </CardContent>
            </Card>

            {/* Evidence */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Archive className="h-4 w-4 text-brand" /> Builds evidence</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {intel.evidence_categories.map((c, i) => <Badge key={i} className="text-[10px] bg-green-50 text-green-700 border-green-200">{c}</Badge>)}
                </div>
              </CardContent>
            </Card>
          </div>

          {(intel.insights ?? []).map((i, idx) => (
            <div key={idx} className={cn("rounded-xl border p-3 text-sm leading-relaxed", INSIGHT_STYLES[i.severity] ?? INSIGHT_STYLES.positive)}>{i.text}</div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

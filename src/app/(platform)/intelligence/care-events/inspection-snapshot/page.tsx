"use client";

// ══════════════════════════════════════════════════════════════════════════════
// Inspection Snapshot page  (Milestone 30)
//
// Generates a fresh point-in-time bundle and lets the manager download it as
// JSON for the inspection evidence file.
// ══════════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Download, Loader2 } from "lucide-react";
import { useGenerateInspectionSnapshot } from "@/hooks/use-inspection-snapshot";
import type { InspectionSnapshot } from "@/lib/care-events/inspection-snapshot";

const HOME_ID = "home_oak";

export default function InspectionSnapshotPage() {
  const gen = useGenerateInspectionSnapshot(HOME_ID);
  const [snap, setSnap] = useState<InspectionSnapshot | null>(null);

  async function generate() {
    const r = await gen.mutateAsync();
    setSnap(r.data);
  }

  function download() {
    if (!snap) return;
    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${snap.id}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <PageShell
      title="Inspection Snapshot"
      subtitle="Generate a point-in-time bundle of every live signal an inspector or RI would ask for. Each snapshot is immutable evidence."
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={generate} disabled={gen.isPending}>
            {gen.isPending
              ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" />Generating…</>
              : <><Camera className="mr-1 h-4 w-4" />Generate snapshot</>}
          </Button>
          {snap && (
            <Button size="sm" variant="outline" onClick={download}>
              <Download className="mr-1 h-4 w-4" />Download JSON
            </Button>
          )}
        </div>
      }
    >
      {!snap && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-slate-500">
            No snapshot generated yet. Click <em>Generate snapshot</em> to capture the current state.
          </CardContent>
        </Card>
      )}

      {snap && (
        <div className="space-y-6">
          {/* Meta */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Snapshot</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-mono text-xs text-slate-500">{snap.id}</p>
              <p>Generated: {new Date(snap.generated_at).toLocaleString()}</p>
              <p>By: {snap.generated_by ?? "unknown"}</p>
              <p>Home: {snap.home_id}</p>
              <p>Schema version: {snap.schema_version}</p>
            </CardContent>
          </Card>

          {/* Headline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                Headline
                <Badge variant="outline">readiness {snap.headline.readiness_score}</Badge>
                <Badge variant="outline">{snap.headline.readiness_severity}</Badge>
                <Badge variant="outline">jobs: {snap.headline.jobs_health}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-3">
                <Row k="Filing total"             v={snap.headline.filing_total} />
                <Row k="Filing unverified %"      v={`${snap.headline.filing_unverified_pct}%`} />
                <Row k="Manager verify queue"     v={snap.headline.manager_verify_total} />
                <Row k="Manager verify critical"  v={snap.headline.manager_verify_critical} />
                <Row k="Manager verify sensitive" v={snap.headline.manager_verify_sensitive} />
                <Row k="Returned records"         v={snap.headline.returned_total} />
                <Row k="Returned (sensitive)"     v={snap.headline.returned_safeguarding_sensitive} />
                <Row k="Oversight inbox"          v={snap.headline.oversight_total} />
                <Row k="Oversight critical"       v={snap.headline.oversight_critical} />
                <Row k="Notifications"            v={snap.headline.notifications_total} />
                <Row k="Notifications critical"   v={snap.headline.notifications_critical} />
                <Row k="Open Reg 40 triages"      v={snap.headline.open_reg40_triages} />
                <Row k="AI-draft Reg 45 evidence" v={snap.headline.ai_draft_reg45_evidence} />
                <Row k="Pending Annex A evidence" v={snap.headline.pending_annex_a_evidence} />
                <Row k="Failed routes"            v={snap.headline.routing_failed_routes} />
                <Row k="Failed jobs"              v={snap.headline.routing_failed_jobs} />
                <Row k="Job failures"             v={snap.headline.jobs_failures} />
                <Row k="Saved time (30d)"         v={`${snap.headline.saved_time_hours_30d}h`} />
                <Row k="Saved time (all-time)"    v={`${snap.headline.saved_time_hours_all_time}h`} />
              </div>
            </CardContent>
          </Card>

          {/* Sections summary */}
          <div className="grid gap-3 md:grid-cols-2">
            <SectionCard title="Inspection readiness" detail={`${snap.readiness.categories.length} categories`} />
            <SectionCard title="Filing cabinet" detail={`${snap.filing_cabinet.categories.length} categories · ${snap.filing_cabinet.recent_filings.length} recent`} />
            <SectionCard title="Routing health" detail={`${snap.routing_health.affected_event_count} events affected`} />
            <SectionCard title="Job queue" detail={`${snap.job_queue.jobs_total} jobs · health ${snap.job_queue.health}`} />
            <SectionCard title="Oversight inbox" detail={`${snap.oversight_inbox.total} items`} />
            <SectionCard title="Manager verify queue" detail={`${snap.manager_verify_queue.total} pending`} />
            <SectionCard title="Returned records" detail={`${snap.returned_records.total} returned`} />
            <SectionCard title="Notifications" detail={`${snap.notifications.total} live`} />
            <SectionCard title="Saved-time" detail={`${snap.saved_time.all_time.records} routing actions logged`} />
          </div>
        </div>
      )}
    </PageShell>
  );
}

function Row({ k, v }: { k: string; v: number | string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-slate-200 py-1">
      <span className="text-slate-600">{k}</span>
      <span className="font-medium text-slate-900">{v}</span>
    </div>
  );
}

function SectionCard({ title, detail }: { title: string; detail: string }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent>
        <p className="text-xs text-slate-500">{detail}</p>
      </CardContent>
    </Card>
  );
}

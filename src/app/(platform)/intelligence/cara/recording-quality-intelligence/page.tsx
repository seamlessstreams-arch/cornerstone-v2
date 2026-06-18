"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenLine, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeRecordingQualityIntelligence } from "@/hooks/use-home-recording-quality-intelligence";
import type { HomeRecordingResult, RecordingRating } from "@/lib/engines/home-recording-quality-intelligence-engine";

const RATING_META: Record<RecordingRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 80 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 50 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function RecordingQualityIntelligencePage() {
  const { data, isLoading, error } = useHomeRecordingQualityIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Recording Quality Intelligence" description="Analysing care form submission, review, approval, and quality profiles…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Recording Quality Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load recording quality data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.recording_rating];
  const sub = d.submission_profile;
  const rev = d.review_profile;
  const apr = d.approval_profile;
  const qual = d.quality_profile;

  return (
    <PageShell
      title="Recording Quality Intelligence"
      description="Care form submission rates, review timeliness, approval rates, urgent and priority form oversight, and form type coverage — evidencing that care records are submitted promptly, reviewed by managers, and acted upon, so that the recording cycle is an active quality control mechanism rather than a passive archive (CHR 2015 Reg 17; SCCIF: Quality of care and leadership)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <PenLine className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recording score: {d.recording_score}/100 · {sub.total_forms} forms · submitted {Math.round(sub.submission_rate)}% · reviewed {Math.round(rev.review_rate)}% · approved {Math.round(apr.approval_rate)}% · {sub.overdue_count} overdue · {qual.urgent_unreviewed_count} urgent unreviewed
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.recording_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(qual.urgent_unreviewed_count > 0 || sub.overdue_count > 0 || rev.review_rate < 60) && (
          <div className="flex flex-col gap-2">
            {qual.urgent_unreviewed_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {qual.urgent_unreviewed_count} urgent form{qual.urgent_unreviewed_count !== 1 ? "s" : ""} unreviewed — urgent records flagged as requiring immediate managerial attention have not been reviewed; this is a governance failure and a safeguarding risk
              </div>
            )}
            {sub.overdue_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {sub.overdue_count} overdue form{sub.overdue_count !== 1 ? "s" : ""} — records past their due date and not yet approved represent gaps in the home's formal care record; these gaps may be visible to Ofsted, to the placing authority, and to any reviewing professional
              </div>
            )}
            {rev.review_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Review rate {Math.round(rev.review_rate)}% — fewer than 60% of submitted forms have been reviewed; managerial review is not a rubber stamp; it is the mechanism by which managers know what is happening in their home and can identify concerns before they escalate
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><PenLine className="h-4 w-4 text-muted-foreground" /> Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Total forms", value: sub.total_forms, color: "text-foreground" },
                  { label: "Submitted", value: sub.submitted_count, color: "text-emerald-600" },
                  { label: "Draft", value: sub.draft_count, color: sub.draft_count > 0 ? "text-amber-600" : "text-foreground" },
                  { label: "Overdue", value: sub.overdue_count, color: sub.overdue_count > 0 ? "text-red-600" : "text-emerald-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded border bg-muted/30 p-2 text-center">
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <RateBar label="Submission rate" value={sub.submission_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Review & Approval</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Pending review", value: rev.pending_review_count, color: rev.pending_review_count > 5 ? "text-amber-600" : "text-foreground" },
                  { label: "Reviewed", value: rev.reviewed_count, color: "text-emerald-600" },
                  { label: "Approved", value: apr.approved_count, color: "text-emerald-600" },
                  { label: "Avg review days", value: rev.avg_review_days.toFixed(1), color: rev.avg_review_days > 3 ? "text-amber-600" : "text-emerald-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded border bg-muted/30 p-2 text-center">
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <RateBar label="Review rate" value={rev.review_rate} warn={85} />
              <RateBar label="Approval rate" value={apr.approval_rate} warn={85} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-muted-foreground" /> Quality Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { label: "Urgent forms", value: qual.urgent_count, color: qual.urgent_count > 0 ? "text-red-600" : "text-foreground" },
                { label: "High priority forms", value: qual.high_priority_count, color: qual.high_priority_count > 0 ? "text-amber-600" : "text-foreground" },
                { label: "Urgent unreviewed", value: qual.urgent_unreviewed_count, color: qual.urgent_unreviewed_count > 0 ? "text-red-600" : "text-emerald-600" },
                { label: "Form types covered", value: qual.form_type_count, color: "text-foreground" },
                { label: "Child-linked rate", value: `${Math.round(qual.child_linked_rate)}%`, color: qual.child_linked_rate >= 90 ? "text-emerald-600" : "text-amber-600" },
                { label: "Incident-linked rate", value: `${Math.round(qual.incident_linked_rate)}%`, color: "text-foreground" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded border bg-muted/30 p-3 text-center">
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  <p className="text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {d.insights.length > 0 && (
          <div className="space-y-2">
            {d.insights.map((ins, i) => {
              const cls =
                ins.severity === "critical" ? "bg-red-50 border-red-200 text-red-800" :
                ins.severity === "warning"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-emerald-50 border-emerald-200 text-emerald-800";
              return (
                <div key={i} className={`flex items-start gap-2 rounded border px-3 py-2 text-xs ${cls}`}>
                  {ins.severity === "critical" ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   ins.severity === "positive"  ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   <Clock className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />}
                  {ins.text}
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {d.strengths.length > 0 && (
            <Card className="border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.strengths.map((s, i) => (
                    <li key={i} className="text-xs flex gap-2"><Star className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {d.concerns.length > 0 && (
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Concerns</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.concerns.map((c, i) => (
                    <li key={i} className="text-xs flex gap-2"><AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />{c}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {d.recommendations.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Recommendations</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {d.recommendations.map((rec) => {
                const urgencyColor =
                  rec.urgency === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  rec.urgency === "soon"      ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{rec.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{rec.recommendation}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{rec.urgency}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Regulation 17 — the registered person must maintain a record of each child which includes specified categories of information; the submission and review pipeline tracked here is the operational evidence that this obligation is being met. The SCCIF "Quality of care" domain asks inspectors to assess whether managers review records and act on what they find; the review and approval rates here directly evidence this. Average review and approval time are measures of managerial responsiveness: a manager who takes five days to review a record submitted urgently after a serious incident is not providing the oversight that the record requires. Form type coverage is a proxy for whether the home is recording across all the relevant domains of a child's life (health, education, behaviour, relationships, activities) or focusing only on incident-type records. Child-linkage of records is the mechanism by which pattern analysis is possible: records that are not linked to individual children cannot inform child-specific intelligence about trends, concerns, or strengths.
        </p>
      </div>
    </PageShell>
  );
}

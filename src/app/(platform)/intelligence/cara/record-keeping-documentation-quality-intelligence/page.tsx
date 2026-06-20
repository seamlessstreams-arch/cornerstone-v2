"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeRecordKeepingDocumentationQualityIntelligence } from "@/hooks/use-home-record-keeping-documentation-quality-intelligence";
import type { RecordKeepingResult, RecordKeepingRating } from "@/lib/engines/home-record-keeping-documentation-quality-intelligence-engine";

const RATING_META: Record<RecordKeepingRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 85 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 55 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 55 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function RecordKeepingDocumentationQualityIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeRecordKeepingDocumentationQualityIntelligence();
  const d = (raw as { data?: RecordKeepingResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Record Keeping & Documentation Quality" description="Analysing daily log completion, care plan currency, risk assessment reviews, incident report timeliness, and regulatory compliance data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Record Keeping & Documentation Quality" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load record keeping documentation quality data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.documentation_rating];

  return (
    <PageShell
      title="Record Keeping & Documentation Quality"
      description="Daily log completion rates, care plan currency, risk assessment review rates, incident report timeliness, regulatory compliance, and record accuracy — evidencing that the home maintains documentation of sufficient quality to evidence its care, protect its children, and give future workers the information they need to understand each child's history (CHR 2015 Reg 5, Reg 17; GDPR; Information Commissioner guidance)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <FileCheck className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Documentation score: {d.documentation_score}/100 · daily logs {Math.round(d.daily_log_completion_rate)}% · care plans {Math.round(d.care_plan_currency_rate)}% · risk assessments {Math.round(d.risk_assessment_review_rate)}% · incident timeliness {Math.round(d.incident_report_timeliness_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.documentation_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.daily_log_completion_rate < 80 || d.care_plan_currency_rate < 80 || d.risk_assessment_review_rate < 70 || d.incident_report_timeliness_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.daily_log_completion_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Daily log completion {Math.round(d.daily_log_completion_rate)}% — daily logs are not administrative record-keeping; they are the primary mechanism for sharing information about a child's day, mood, and wellbeing across shift handovers; gaps in the daily log are gaps in the knowledge continuity that protects children
              </div>
            )}
            {d.care_plan_currency_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Care plan currency {Math.round(d.care_plan_currency_rate)}% — out-of-date care plans are not just an administrative failure; they are a clinical risk; staff working from an outdated plan may apply an approach that was appropriate months ago but is now contraindicated by the child's development or changed circumstances
              </div>
            )}
            {d.risk_assessment_review_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Risk assessment review rate {Math.round(d.risk_assessment_review_rate)}% — risk assessments that have not been reviewed since initial placement do not reflect the child's current risk profile; a child who has stabilised or escalated significantly since their last assessment is being managed against inaccurate information
              </div>
            )}
            {d.incident_report_timeliness_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Incident report timeliness {Math.round(d.incident_report_timeliness_rate)}% — late incident reports undermine safeguarding; they delay notification to the placing authority and to the child's professional network, and they create a gap between the event and the management oversight that should follow it
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><FileCheck className="h-4 w-4 text-muted-foreground" /> Documentation Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Daily log completion rate" value={d.daily_log_completion_rate} warn={90} />
            <RateBar label="Care plan currency rate" value={d.care_plan_currency_rate} warn={90} />
            <RateBar label="Risk assessment review rate" value={d.risk_assessment_review_rate} warn={85} />
            <RateBar label="Incident report timeliness rate" value={d.incident_report_timeliness_rate} warn={90} />
            <RateBar label="Regulatory compliance rate" value={d.regulatory_compliance_rate} warn={95} />
            <RateBar label="Record accuracy rate" value={d.record_accuracy_rate} warn={90} />
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
          CHR 2015 Regulation 5 — the registered person must promote each child's welfare; complete and accurate records are fundamental to this; without them, care decisions are made without the full picture of the child's needs, history, and current presentation. Regulation 17 — the registered person must maintain a record of each child that includes the information specified in Schedule 3; this is a direct legal obligation, not an advisory standard. UK GDPR and the Data Protection Act 2018 — personal data held about children must be accurate, up to date, and adequate for the purpose for which it is held; inaccurate or outdated records create data protection risk as well as practice risk. The Information Commissioner has issued specific guidance on record-keeping in children's services noting the heightened responsibility that comes with holding sensitive information about vulnerable children. Children's right to access their own records (under the Access to Records regulations and the DPA) means that the quality of recording has direct implications for the child's ability to understand their own history. Ofsted consistently identify poor record-keeping as a contributory factor in inspection judgements of "requires improvement"; conversely, outstanding homes typically demonstrate exemplary recording that tells the story of each child with clarity, accuracy, and appropriate professional judgement.
        </p>
      </div>
    </PageShell>
  );
}

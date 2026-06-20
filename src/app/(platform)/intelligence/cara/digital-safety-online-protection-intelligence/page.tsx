"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeDigitalSafetyOnlineProtectionIntelligence } from "@/hooks/use-home-digital-safety-online-protection-intelligence";
import type { DigitalSafetyOnlineProtectionResult, DigitalSafetyRating } from "@/lib/engines/home-digital-safety-online-protection-intelligence-engine";

const RATING_META: Record<DigitalSafetyRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function DigitalSafetyOnlineProtectionIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeDigitalSafetyOnlineProtectionIntelligence();
  const d = (raw as { data?: DigitalSafetyOnlineProtectionResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Digital Safety & Online Protection" description="Analysing digital safety and online protection data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Digital Safety & Online Protection" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load digital safety and online protection data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.digital_safety_rating];

  return (
    <PageShell
      title="Digital Safety & Online Protection"
      description="eSafety training compliance, internet usage monitoring, social media risk assessment, access agreements, digital literacy and incident response — structured online protection for children at risk of digital exploitation (NMS 7; KCSIE 2024; CHR 2015 Reg 12; Reg 13 — Online Safety)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ShieldAlert className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Digital safety score: {d.digital_safety_score}/100 · training {Math.round(d.esafety_training_compliance_rate)}% · agreements {Math.round(d.access_agreement_coverage_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.digital_safety_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.high_risk_usage_count > 0 || d.flagged_content_count > 0 || d.overdue_training_count > 0) && (
          <div className="flex flex-col gap-2">
            {d.high_risk_usage_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.high_risk_usage_count} high-risk internet usage {d.high_risk_usage_count === 1 ? "log" : "logs"} — immediate review and safeguarding consideration required
              </div>
            )}
            {d.flagged_content_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.flagged_content_count} flagged content {d.flagged_content_count === 1 ? "item" : "items"} — review and escalate if required
              </div>
            )}
            {d.overdue_training_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {d.overdue_training_count} overdue eSafety training {d.overdue_training_count === 1 ? "record" : "records"} — prioritise completion
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "With training", value: d.children_with_training, color: "text-blue-600" },
            { label: "With agreements", value: d.children_with_agreements, color: "text-emerald-600" },
            { label: "With assessments", value: d.children_with_assessments, color: "" },
            { label: "With monitoring", value: d.children_with_monitoring, color: "" },
            { label: "With literacy support", value: d.children_with_literacy_support, color: "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                Training & Agreements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="eSafety training compliance rate" value={d.esafety_training_compliance_rate} warn={90} />
              <RateBar label="Training pass rate" value={d.training_pass_rate} warn={85} />
              <RateBar label="Access agreement coverage rate" value={d.access_agreement_coverage_rate} warn={90} />
              <RateBar label="Digital literacy engagement rate" value={d.digital_literacy_engagement_rate} warn={80} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                Monitoring & Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Internet usage monitoring rate" value={d.usage_monitoring_rate} warn={90} />
              <RateBar label="Social media risk assessment rate" value={d.social_media_risk_assessment_rate} warn={85} />
              <RateBar label="Privacy settings compliance rate" value={d.privacy_settings_compliance_rate} warn={90} />
              <RateBar label="Incident response rate" value={d.incident_response_rate} warn={100} />
            </CardContent>
          </Card>
        </div>

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
                      {rec.regulatory_ref && <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>}
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{rec.urgency}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          National Minimum Standards 7 (Online Safety). Keeping Children Safe in Education 2024. CHR 2015 Regulation 12 (Health and Safety) and Regulation 13 (Online Safety). Children in residential care are at elevated risk of online exploitation — structured eSafety training, consistent monitoring, and up-to-date access agreements are essential protective factors, not optional extras.
        </p>
      </div>
    </PageShell>
  );
}

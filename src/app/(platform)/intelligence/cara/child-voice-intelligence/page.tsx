"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle, AlertTriangle, Clock, Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useHomeChildVoiceIntelligence } from "@/hooks/use-home-child-voice-intelligence";
import type { ChildVoiceRating } from "@/lib/engines/home-child-voice-intelligence-engine";

const RATING_META: Record<ChildVoiceRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 60 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ChildVoiceIntelligencePage() {
  const { data, isLoading, error } = useHomeChildVoiceIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Child Voice" description="Analysing child voice and participation…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Child Voice" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load child voice data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.child_voice_rating];
  const TrendIcon =
    d.meetings.trend === "improving" ? TrendingUp :
    d.meetings.trend === "declining" ? TrendingDown : Minus;
  const trendColor =
    d.meetings.trend === "improving" ? "text-emerald-600" :
    d.meetings.trend === "declining" ? "text-red-600" : "text-muted-foreground";

  return (
    <PageShell
      title="Child Voice"
      description="House meetings, child participation, visitor governance and external scrutiny — children's right to influence the running of the home (CHR 2015 Reg 7 — Children's guide; Reg 11 — Support and advocacy; UN CRC Article 12)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <MessageCircle className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Voice score: {d.child_voice_score}/100 · {d.meetings.total_meetings_90d} meetings (90d) · {Math.round(d.meetings.avg_attendance_rate)}% avg attendance
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.child_voice_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.meetings.total_meetings_90d === 0 || d.visitors.visitors_still_signed_in > 0) && (
          <div className="flex flex-col gap-2">
            {d.meetings.total_meetings_90d === 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                No house meetings in the past 90 days — immediate action required under CHR 2015 Reg 7
              </div>
            )}
            {d.visitors.visitors_still_signed_in > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.visitors.visitors_still_signed_in} visitor(s) still signed in — confirm departure and close sign-in record
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={`rounded-lg border p-3 text-center ${d.meetings.total_meetings_90d === 0 ? "bg-red-50" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.meetings.total_meetings_90d === 0 ? "text-red-600" : "text-blue-600"}`}>{d.meetings.total_meetings_90d}</p>
            <p className="text-xs text-muted-foreground mt-1">Meetings (90d)</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{Math.round(d.meetings.avg_attendance_rate)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Avg attendance</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{Math.round(d.meetings.child_raised_topic_rate)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Child-raised topics</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendIcon className={`h-5 w-5 ${trendColor}`} />
              <p className={`text-sm font-semibold capitalize ${trendColor}`}>{d.meetings.trend.replace("_", " ")}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Participation trend</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                House Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Attendance rate" value={d.meetings.avg_attendance_rate} warn={80} />
              <RateBar label="Child-raised topic rate" value={d.meetings.child_raised_topic_rate} warn={60} />
              <RateBar label="Action completion rate" value={d.meetings.action_completion_rate} warn={80} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Avg feedback per meeting</span>
                <span className="font-medium">{d.meetings.avg_feedback_per_meeting.toFixed(1)}</span>
              </div>
              {d.meetings.meeting_frequency_weeks !== null && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Avg frequency</span>
                  <span className="font-medium">every {d.meetings.meeting_frequency_weeks.toFixed(1)} weeks</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Visitor Governance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="DBS compliance rate" value={d.visitors.dbs_compliance_rate} warn={100} />
              <RateBar label="ID verification rate" value={d.visitors.id_verification_rate} warn={100} />
              <RateBar label="Sign-out compliance rate" value={d.visitors.sign_out_compliance_rate} warn={100} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Total visitors (90d)</span>
                <span className="font-medium">{d.visitors.total_90d}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Inspector visits (children seen)</span>
                <span className="font-medium">{d.visitors.inspector_count}</span>
              </div>
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
          CHR 2015 Regulation 7 (Children&apos;s guide) and Regulation 11 (Support and advocacy). UN CRC Article 12 — children have the right to be heard in matters affecting them. House meetings must be held regularly and children&apos;s views must influence the running of the home.
        </p>
      </div>
    </PageShell>
  );
}

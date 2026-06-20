"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeAgencyStaffManagementIntelligence } from "@/hooks/use-home-agency-staff-management-intelligence";
import type { AgencyStaffManagementResult, AgencyManagementRating } from "@/lib/engines/home-agency-staff-management-intelligence-engine";

const RATING_META: Record<AgencyManagementRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function AgencyStaffManagementIntelligencePage() {
  const { data, isLoading, error } = useHomeAgencyStaffManagementIntelligence();
  const d: AgencyStaffManagementResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Agency Staff Management Intelligence" description="Analysing agency shift vetting compliance, induction completion, safeguarding briefings, feedback quality, and flagged concerns…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Agency Staff Management Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load agency staff management data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.agency_rating];

  return (
    <PageShell
      title="Agency Staff Management Intelligence"
      description="Agency shift vetting compliance, home-specific induction completion, safeguarding briefing rates, practice feedback quality, and flagged concerns about agency workers — evidencing that the home manages its use of agency staff in a way that maintains safeguarding standards and does not dilute the quality or consistency of care (CHR 2015 Regulation 33 — fitness of workers; Regulation 35 — suitable staffing; Safer Recruitment in Education guidance; DBS requirements for agency staff; agency-specific provisions in the NMS for Children's Homes 2015)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Users className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Agency management score: {d.agency_score}/100 · {d.total_agency_shifts} shifts · vetting {Math.round(d.vetting_compliance_rate)}% · induction {Math.round(d.induction_completion_rate)}% · safeguarding briefing {Math.round(d.safeguarding_briefing_rate)}% · {d.concerns_flagged} concern{d.concerns_flagged !== 1 ? "s" : ""} flagged
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.agency_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.vetting_compliance_rate < 100 || d.safeguarding_briefing_rate < 95 || d.concerns_flagged > 0) && (
          <div className="flex flex-col gap-2">
            {d.vetting_compliance_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Agency vetting compliance rate {Math.round(d.vetting_compliance_rate)}% — every agency worker deployed to the home must have a valid DBS check that has been verified before they begin work; CHR 2015 Regulation 33 applies to agency workers in exactly the same way as it applies to directly employed staff; an agency worker whose vetting documentation has not been verified is an unvetted adult with access to children, and this is a safeguarding absolute
              </div>
            )}
            {d.safeguarding_briefing_rate < 95 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Safeguarding briefing rate {Math.round(d.safeguarding_briefing_rate)}% — every agency worker must receive a home-specific safeguarding briefing before their first shift; this must cover the home's safeguarding lead, the local authority designated officer contact, the reporting protocol, and the specific safeguarding risks and vulnerabilities of the children in the home; an agency worker who starts a shift without this briefing cannot fulfil their safeguarding obligations
              </div>
            )}
            {d.concerns_flagged > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.concerns_flagged} concern{d.concerns_flagged > 1 ? "s" : ""} flagged about agency staff — flagged concerns must be investigated promptly and fed back to the agency; where concerns relate to safeguarding, competence, or conduct, the home has a duty to ensure the agency worker is not redeployed to the home until the concern is resolved; persistent concerns about the same agency or the same worker may indicate a systemic issue with the agency's own vetting and training standards
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Total agency shifts", value: d.total_agency_shifts, color: "text-blue-600" },
            { label: "Concerns flagged", value: d.concerns_flagged, color: d.concerns_flagged > 0 ? "text-red-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> Agency Staff Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Vetting compliance rate" value={d.vetting_compliance_rate} warn={100} />
            <RateBar label="Safeguarding briefing rate" value={d.safeguarding_briefing_rate} warn={100} />
            <RateBar label="Home induction completion rate" value={d.induction_completion_rate} warn={90} />
            <RateBar label="Positive practice feedback rate" value={d.positive_feedback_rate} warn={75} />
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
          Agency staff present the home's most significant safeguarding governance challenge: they have access to vulnerable children, often at short notice, without the benefit of the induction, supervision, and relationship history that permanent staff have. The registered manager's legal responsibility under CHR 2015 Regulation 33 does not diminish because a worker is supplied by an agency — the home remains responsible for ensuring every worker deployed to it is fit for the role, regardless of who employs them. This means verifying vetting documentation before the worker starts, not accepting agency assurances in lieu of documentary evidence, and ensuring the home's own induction and safeguarding briefing is completed regardless of any training the agency claims the worker has completed elsewhere. The safeguarding briefing rate is the non-negotiable baseline: an agency worker who starts a shift in a residential children's home without knowing who the safeguarding lead is, how to report a concern, and what specific vulnerabilities the children in the home have cannot discharge their safeguarding duty in the first hours of their shift — which is precisely when a new adult's behaviour is most likely to be tested. Induction completion is the quality measure beyond the compliance baseline: a home-specific induction covers the home's therapeutic model, its behaviour management approach, the individual children's needs and trigger patterns, and the communication protocols that allow the shift to run safely; agency workers who have not completed it are competent generalists functioning in a context-specific environment without the context. Positive feedback rate and flagged concerns together form the quality loop: the feedback system should be systematic (every shift has a quality rating), transparent (workers know they are rated), and acted upon (poor feedback leads to conversation, not redeployment).
        </p>
      </div>
    </PageShell>
  );
}

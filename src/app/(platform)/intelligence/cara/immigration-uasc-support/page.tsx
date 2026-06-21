"use client";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding:      { label: "Outstanding",    cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:             { label: "Good",           cls: "text-blue-700 bg-blue-50 border-blue-200" },
  adequate:         { label: "Adequate",       cls: "text-amber-700 bg-amber-50 border-amber-200" },
  inadequate:       { label: "Inadequate",     cls: "text-red-700 bg-red-50 border-red-200" },
  not_applicable:   { label: "Not Applicable", cls: "text-slate-600 bg-slate-50 border-slate-200" },
};

export default function ImmigrationUascSupportPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["immigration-uasc-support-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/immigration-uasc-support-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d ? (RATING[d.overall_status] ?? RATING.adequate) : null;

  return (
    <PageShell title="Immigration & UASC Support Intelligence" description="Age assessment, pathway planning, ESOL engagement, legal representation, and family tracing">
      {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">Failed to load data.</p>}
      {d && (
        <div className="space-y-6">
          <Card className={`border ${rating!.cls}`}>
            <CardHeader>
              <CardTitle className="text-base">Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${rating!.cls.split(" ")[0]}`}>{rating!.label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {d.uasc_records} UASC record{d.uasc_records !== 1 ? "s" : ""} across {d.total_children} children
              </p>
              {d.message && <p className="text-sm text-muted-foreground mt-1">{d.message}</p>}
            </CardContent>
          </Card>

          {d.uasc_records > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Age Assessment Completed", value: d.age_assessment_completed },
                { label: "Age Assessment Rate", value: `${d.age_assessment_rate_pct}%` },
                { label: "Pathway Plan Linked", value: d.pathway_plan_linked },
                { label: "Pathway Plan Rate", value: `${d.pathway_rate_pct}%` },
                { label: "ESOL Engaged", value: d.esol_engaged },
                { label: "Family Tracing Active", value: d.family_tracing_active },
                { label: "Legal Rep Present", value: d.legal_rep_present },
                { label: "Legal Rep Rate", value: `${d.legal_rep_rate_pct}%` },
                { label: "Documents Awaiting", value: d.documents_awaiting, highlight: d.documents_awaiting > 0 },
                { label: "Culture/Community Links", value: d.culture_community_links },
              ].map(({ label, value, highlight }) => (
                <Card key={label} className={highlight ? "border-amber-200 bg-amber-50" : ""}>
                  <CardContent className="pt-4">
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Regulatory Reference</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{d.regulatory_ref}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  );
}

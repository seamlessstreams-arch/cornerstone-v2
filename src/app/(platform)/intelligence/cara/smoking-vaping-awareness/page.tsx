"use client";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200" },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200" },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200" },
};

export default function SmokingVapingAwarenessPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["smoking-vaping-awareness-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/smoking-vaping-awareness-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d ? (RATING[d.overall_status] ?? RATING.adequate) : null;

  return (
    <PageShell title="Smoking & Vaping Awareness Intelligence" description="Brief intervention delivery, harm reduction, and stop-smoking support">
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
              <p className="text-sm text-muted-foreground mt-1">{d.total_children} children in placement</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Smoking/Vaping Records", value: d.smoking_vaping_records },
              { label: "Active Users", value: d.active_users, highlight: d.active_users > 0 },
              { label: "Recently Quit", value: d.recently_quit },
              { label: "Brief Intervention Delivered", value: d.brief_intervention_delivered },
              { label: "Brief Intervention Rate", value: d.brief_intervention_rate_pct != null ? `${d.brief_intervention_rate_pct}%` : "—" },
              { label: "Stop Smoking Referrals", value: d.stop_smoking_referrals },
              { label: "Harm Reduction Coverage", value: d.harm_reduction_coverage_pct != null ? `${d.harm_reduction_coverage_pct}%` : "—" },
              { label: "Child Voice Rate", value: d.child_voice_rate_pct != null ? `${d.child_voice_rate_pct}%` : "—" },
              { label: "No Record on File", value: d.no_record_on_file, highlight: d.no_record_on_file > 0 },
            ].map(({ label, value, highlight }) => (
              <Card key={label} className={highlight ? "border-amber-200 bg-amber-50" : ""}>
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

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

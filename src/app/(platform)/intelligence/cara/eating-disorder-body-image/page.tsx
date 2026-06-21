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

export default function EatingDisorderBodyImagePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["eating-disorder-body-image-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/eating-disorder-body-image-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d ? (RATING[d.overall_status] ?? RATING.adequate) : null;

  return (
    <PageShell title="Eating Disorder & Body Image Intelligence" description="ED history, specialist appointments, medication, and recent recording patterns">
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Children with ED History", value: d.children_with_ed_history, highlight: d.children_with_ed_history > 0 },
              { label: "Children with ED Appointments", value: d.children_with_ed_appointments },
              { label: "ED Appointments Total", value: d.ed_appointments },
              { label: "ED-Related Medications", value: d.ed_related_medications },
              { label: "Log References (60d)", value: d.recent_log_references_60d, highlight: d.recent_log_references_60d > 2 },
            ].map(({ label, value, highlight }) => (
              <Card key={label} className={highlight ? "border-amber-200 bg-amber-50" : ""}>
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-blue-100 bg-blue-50">
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-blue-800">Practice note</p>
              <p className="text-sm text-blue-700 mt-1">
                Eating disorders have the highest mortality rate of any mental health condition. Early specialist referral is critical. Mealtimes should be relational, not confrontational — a PACE-informed approach supports children to feel safe around food.
              </p>
            </CardContent>
          </Card>

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

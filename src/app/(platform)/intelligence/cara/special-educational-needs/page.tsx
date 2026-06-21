"use client";

import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertTriangle } from "lucide-react";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200"        },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200"     },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200"           },
};

function RateBar({ label, value, target = 80 }: { label: string; value: number; target?: number }) {
  const ok = value >= target;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${ok ? "text-emerald-600" : "text-amber-600"}`}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${ok ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function SpecialEducationalNeedsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["special-educational-needs-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/special-educational-needs-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d?.overall_rating ? RATING[d.overall_rating] : null;

  if (isLoading) return <PageShell title="Special Educational Needs" description="Analysing…"><div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading…</div></PageShell>;
  if (error || !d) return <PageShell title="Special Educational Needs" description="Unable to load."><div className="h-48 flex items-center justify-center text-destructive text-sm">Failed to load data.</div></PageShell>;

  return (
    <PageShell
      title="Special Educational Needs"
      description={d.headline ?? "EHCP currency, SEN support and exclusion tracking"}
    >
      <div className="space-y-6">
        {rating && (
          <Card className={`border-2 ${rating.cls}`}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <BookOpen className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{rating.label}</p>
                <p className="text-xs text-muted-foreground">{d.regulatory_ref}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {d.unsupported_sen > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4 pb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                {d.unsupported_sen} child{d.unsupported_sen !== 1 ? "ren" : ""} with diagnosed SEN without EHCP or formal support plan — review needed
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.with_sen}</p>
              <p className="text-xs text-muted-foreground mt-1">Children with SEN/EHCP</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.sen_prevalence_rate}%</p>
              <p className="text-xs text-muted-foreground mt-1">SEN prevalence</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.sen_meetings}</p>
              <p className="text-xs text-muted-foreground mt-1">SEN meetings attended</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${d.exclusions > 0 ? "text-red-600" : ""}`}>{d.exclusions}</p>
              <p className="text-xs text-muted-foreground mt-1">Exclusions recorded</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">EHCP & Support Quality</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <RateBar label="EHCP annual review currency" value={d.review_currency_rate} target={90} />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

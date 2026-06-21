"use client";

import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock } from "lucide-react";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200"        },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200"     },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200"           },
};

function RateBar({ label, value, target = 85 }: { label: string; value: number; target?: number }) {
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

export default function ComplaintsAdvocacyResponsePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["complaints-advocacy-response"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/complaints-advocacy-response-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d?.overall_rating ? RATING[d.overall_rating] : null;

  if (isLoading) return <PageShell title="Complaints & Advocacy Response" description="Analysing…"><div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading…</div></PageShell>;
  if (error || !d) return <PageShell title="Complaints & Advocacy Response" description="Unable to load."><div className="h-48 flex items-center justify-center text-destructive text-sm">Failed to load data.</div></PageShell>;

  return (
    <PageShell
      title="Complaints & Advocacy Response"
      description={d.headline ?? "Complaints timeliness, resolution quality and advocacy access"}
    >
      <div className="space-y-6">
        {rating && (
          <Card className={`border-2 ${rating.cls}`}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <MessageSquare className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{rating.label}</p>
                <p className="text-xs text-muted-foreground">{d.regulatory_ref}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {d.open_complaints > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4 pb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 font-medium">
                {d.open_complaints} open complaint{d.open_complaints !== 1 ? "s" : ""} in progress
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.total_complaints}</p>
              <p className="text-xs text-muted-foreground mt-1">Total complaints</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.by_child}</p>
              <p className="text-xs text-muted-foreground mt-1">Raised by children</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.by_family}</p>
              <p className="text-xs text-muted-foreground mt-1">Raised by families</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${d.upheld_rate > 30 ? "text-amber-600" : ""}`}>{d.upheld_rate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Upheld rate</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" /> Timeliness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RateBar label="Response rate" value={d.response_rate} target={95} />
            <RateBar label="In-time responses" value={d.timeliness_rate} target={85} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Stage Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold">{d.stage1}</p>
              <p className="text-xs text-muted-foreground">Stage 1 (5 days)</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{d.stage2}</p>
              <p className="text-xs text-muted-foreground">Stage 2 (25 days)</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{d.stage3}</p>
              <p className="text-xs text-muted-foreground">Stage 3 (65 days)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

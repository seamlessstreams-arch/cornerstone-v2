"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Filter, ArrowUpDown, ChevronDown, ChevronUp,
  Heart, ShieldAlert, MessageCircle, School, Globe, MapPin,
  Users, CheckCircle2, AlertTriangle, Sparkles, Activity, Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

type Context = "In the home" | "School" | "Online" | "Community" | "Travel";
type PerpetratorType =
  | "Peer in home"
  | "Peer at school"
  | "Older child"
  | "Online stranger"
  | "Group of peers"
  | "Online peer"
  | "Adult";
type BullyingType =
  | "Verbal"
  | "Physical"
  | "Online/Cyber"
  | "Exclusion/Social"
  | "Damage to property"
  | "Sexualised"
  | "Discriminatory";
type Status =
  | "Open - investigating"
  | "Closed - resolved"
  | "Monitoring"
  | "Escalated";

interface BullyingIncident {
  id: string;
  date: string;
  time: string;
  victim: string;
  context: Context;
  perpetratorType: PerpetratorType;
  bullyingType: BullyingType;
  description: string;
  childImpactObserved: string;
  childWordsUsed: string;
  reportedBy: string; // staff ID or "Child disclosed"
  childWantedReporting: boolean;
  externalAgenciesNotified: string[];
  schoolNotified: boolean;
  policeNotified: boolean;
  parentsInformed: boolean;
  restorativeApproachAttempted: string;
  supportProvided: string[];
  perpetratorOutcome: string;
  wellbeingPostIncident: string;
  followUpDate: string;
  status: Status;
  patternIndicator: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const CONTEXT_CLR: Record<Context, string> = {
  "In the home": "bg-amber-100 text-amber-800",
  "School": "bg-blue-100 text-blue-800",
  "Online": "bg-purple-100 text-purple-800",
  "Community": "bg-green-100 text-green-800",
  "Travel": "bg-orange-100 text-orange-800",
};

const CONTEXT_ICON: Record<Context, typeof Heart> = {
  "In the home": Heart,
  "School": School,
  "Online": Globe,
  "Community": MapPin,
  "Travel": MapPin,
};

const TYPE_CLR: Record<BullyingType, string> = {
  "Verbal": "bg-yellow-100 text-yellow-800",
  "Physical": "bg-red-100 text-red-800",
  "Online/Cyber": "bg-purple-100 text-purple-800",
  "Exclusion/Social": "bg-pink-100 text-pink-800",
  "Damage to property": "bg-orange-100 text-orange-800",
  "Sexualised": "bg-rose-100 text-rose-800",
  "Discriminatory": "bg-fuchsia-100 text-fuchsia-800",
};

const STATUS_CLR: Record<Status, string> = {
  "Open - investigating": "bg-blue-100 text-blue-800",
  "Closed - resolved": "bg-green-100 text-green-800",
  "Monitoring": "bg-amber-100 text-amber-800",
  "Escalated": "bg-red-100 text-red-800",
};

const BORDER_STATUS: Record<Status, string> = {
  "Open - investigating": "border-l-blue-400",
  "Closed - resolved": "border-l-green-500",
  "Monitoring": "border-l-amber-400",
  "Escalated": "border-l-red-600",
};

const CONTEXTS: Context[] = ["In the home", "School", "Online", "Community", "Travel"];
const TYPES: BullyingType[] = [
  "Verbal", "Physical", "Online/Cyber", "Exclusion/Social",
  "Damage to property", "Sexualised", "Discriminatory",
];
const STATUSES: Status[] = ["Open - investigating", "Closed - resolved", "Monitoring", "Escalated"];

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: BullyingIncident[] = [
  {
    id: "bul_1",
    date: d(-3),
    time: "16:40",
    victim: "yp_alex",
    context: "School",
    perpetratorType: "Group of peers",
    bullyingType: "Verbal",
    description: "Alex disclosed at key work session that three Year 10 boys had been making repeated comments about being a 'care kid' across the school week. Comments occurred at break times near the canteen. Alex described it as 'wearing me down'.",
    childImpactObserved: "Quieter at evening meal on day of disclosure. Reluctant to attend school the following morning. Visible relief after disclosure and plan agreed.",
    childWordsUsed: "I just want it to stop, but I don't want to be the snitchy kid either.",
    reportedBy: "staff_anna",
    childWantedReporting: true,
    externalAgenciesNotified: ["School Pastoral Lead"],
    schoolNotified: true,
    policeNotified: false,
    parentsInformed: false,
    restorativeApproachAttempted: "School arranged restorative meeting with Alex's agreement. Alex chose to attend with pastoral lead present. Boys offered written apology — Alex accepted.",
    supportProvided: ["Key work session", "Daily check-in for two weeks", "Pastoral support at school", "Choice of who walks Alex to school"],
    perpetratorOutcome: "School issued internal sanctions and ran a Year 10 PSHE session on language and stigma. Anonymised — Alex satisfied with response.",
    wellbeingPostIncident: "Settled within 10 days. Reports comments have stopped. Confidence rebuilt — applied for school council.",
    followUpDate: d(7),
    status: "Closed - resolved",
    patternIndicator: "First incident at this school. No pattern identified. Continue routine check-ins.",
  },
  {
    id: "bul_2",
    date: d(-6),
    time: "21:15",
    victim: "yp_jordan",
    context: "Online",
    perpetratorType: "Online peer",
    bullyingType: "Online/Cyber",
    description: "Jordan showed staff a series of unkind messages received via a gaming chat from a peer they sometimes play with. Messages mocked Jordan's gameplay and included one comment about Jordan 'not having a real family'. Screenshots taken with Jordan's consent.",
    childImpactObserved: "Tearful initially when sharing. Asked staff to sit with them. Wanted reassurance that being upset was okay.",
    childWordsUsed: "It's the family bit that hurt — the rest is just rubbish gaming chat.",
    reportedBy: "Child disclosed",
    childWantedReporting: true,
    externalAgenciesNotified: [],
    schoolNotified: false,
    policeNotified: false,
    parentsInformed: false,
    restorativeApproachAttempted: "Discussed options with Jordan. Jordan chose to block the user and report through the platform's reporting tool — staff supported with the steps.",
    supportProvided: ["Sat with Jordan to write platform report", "Reviewed online safety plan together", "Updated digital wellbeing agreement", "Reassurance about identity and belonging"],
    perpetratorOutcome: "Platform action pending. User blocked. Jordan led the response.",
    wellbeingPostIncident: "Bounced back within 48 hours. Has since chosen to play with a smaller trusted friends list. Felt heard and in control.",
    followUpDate: d(4),
    status: "Monitoring",
    patternIndicator: "Second online incident this term — different platform, different user. Online safety theme reinforced in key work.",
  },
  {
    id: "bul_3",
    date: d(-10),
    time: "15:20",
    victim: "yp_casey",
    context: "Travel",
    perpetratorType: "Older child",
    bullyingType: "Physical",
    description: "On the school bus, an older student pushed past Casey aggressively and elbowed them in the side. Casey sat down and did not retaliate. Reported to staff on arrival home.",
    childImpactObserved: "Bruise to left ribs (logged on body map). Quiet for the evening. Asked if they would have to use the bus the next day.",
    childWordsUsed: "He's done it before. I just kept quiet so it wouldn't get worse.",
    reportedBy: "staff_chervelle",
    childWantedReporting: true,
    externalAgenciesNotified: ["School Pastoral Lead", "Local authority bus liaison"],
    schoolNotified: true,
    policeNotified: false,
    parentsInformed: false,
    restorativeApproachAttempted: "Casey did not feel safe with face-to-face restorative work. Instead, school facilitated a written exchange via pastoral lead, which Casey contributed to with staff support.",
    supportProvided: ["Body map completed", "Staff drove Casey to school for one week", "Bus seating reviewed with school", "Therapeutic check-in with key worker"],
    perpetratorOutcome: "School escalated to head of year. Older child issued bus suspension for one week and engaged in reflective work. Anonymised.",
    wellbeingPostIncident: "Returned to bus after one week with confidence. Has since reported feeling safer. Knows the named adult to go to.",
    followUpDate: d(3),
    status: "Closed - resolved",
    patternIndicator: "Casey identified that this had happened twice previously without disclosing. Highlights importance of trust-building. Continued check-ins planned.",
  },
  {
    id: "bul_4",
    date: d(-15),
    time: "19:30",
    victim: "yp_alex",
    context: "Community",
    perpetratorType: "Group of peers",
    bullyingType: "Exclusion/Social",
    description: "At the local youth centre, a small group of peers deliberately excluded Alex from a group activity, made faces, and walked away when Alex approached. Alex disclosed during the drive home.",
    childImpactObserved: "Subdued on the journey. Said they did not want to return next week. Engaged well in conversation when invited to share.",
    childWordsUsed: "It just makes me feel invisible — like I'm not even worth being mean to properly.",
    reportedBy: "staff_edward",
    childWantedReporting: false,
    externalAgenciesNotified: [],
    schoolNotified: false,
    policeNotified: false,
    parentsInformed: false,
    restorativeApproachAttempted: "Respected Alex's wish not to formally report. Staff spoke informally with the youth centre lead (without naming peers) about inclusion practice.",
    supportProvided: ["Listening time", "Identified an alternative club Alex wanted to try", "Trial session at new club arranged", "Affirmation work in key session"],
    perpetratorOutcome: "Not directly addressed at Alex's request. Youth centre lead introduced inclusion ground rules for all sessions.",
    wellbeingPostIncident: "Alex chose to move to a different youth provision. Settled well, made two new connections. Self-esteem rebuilt.",
    followUpDate: d(10),
    status: "Closed - resolved",
    patternIndicator: "Pattern of social exclusion can be cumulative — log will be reviewed alongside school and online entries to identify any wider theme.",
  },
  {
    id: "bul_5",
    date: d(-1),
    time: "20:05",
    victim: "yp_jordan",
    context: "In the home",
    perpetratorType: "Peer in home",
    bullyingType: "Verbal",
    description: "During an evening film, Casey made a sharp comment about Jordan's accent that Jordan experienced as belittling. Both children were present. Tension visible. Staff intervened immediately and offered space to each child.",
    childImpactObserved: "Jordan went to bedroom and stayed there for an hour. Appeared hurt but not unsafe. Came down later for a hot drink and a chat.",
    childWordsUsed: "I know they didn't mean it the way it landed — but it landed.",
    reportedBy: "staff_darren",
    childWantedReporting: true,
    externalAgenciesNotified: [],
    schoolNotified: false,
    policeNotified: false,
    parentsInformed: false,
    restorativeApproachAttempted: "Both children agreed to a restorative conversation the following morning, supported by their key workers. Casey acknowledged impact and apologised genuinely. Jordan accepted.",
    supportProvided: ["Separate listening time for both children", "Restorative conversation next morning", "Reaffirmed house values around belonging", "Updated peer relationships entry"],
    perpetratorOutcome: "Casey reflected in key work — recognised the comment was hurtful, agreed an action (compliment jar contribution for the week). Anonymised in shared records.",
    wellbeingPostIncident: "Both children watched another film together two evenings later. Relationship repaired. House mood positive.",
    followUpDate: d(5),
    status: "Monitoring",
    patternIndicator: "Isolated comment, no prior pattern between these two children. Continue light-touch monitoring at house meetings.",
  },
];

/* ── page ──────────────────────────────────────────────────────────────────── */

export default function BullyingIncidentLogPage() {
  const [data] = useState(SEED);
  const [search, setSearch] = useState("");
  const [filterContext, setFilterContext] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((p) => (p === id ? null : id));

  /* ── derived ─────────────────────────────────────────────────────────────── */

  const filtered = useMemo(() => {
    let rows = data.filter((r) => {
      if (filterContext !== "all" && r.context !== filterContext) return false;
      if (filterType !== "all" && r.bullyingType !== filterType) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (filterYP !== "all" && r.victim !== filterYP) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.description.toLowerCase().includes(q) ||
          r.childImpactObserved.toLowerCase().includes(q) ||
          r.childWordsUsed.toLowerCase().includes(q) ||
          r.patternIndicator.toLowerCase().includes(q) ||
          getYPName(r.victim).toLowerCase().includes(q)
        );
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      switch (sortBy) {
        case "date-desc": return b.date.localeCompare(a.date);
        case "date-asc": return a.date.localeCompare(b.date);
        case "status": {
          const order: Status[] = ["Escalated", "Open - investigating", "Monitoring", "Closed - resolved"];
          return order.indexOf(a.status) - order.indexOf(b.status);
        }
        case "yp": return getYPName(a.victim).localeCompare(getYPName(b.victim));
        default: return 0;
      }
    });
    return rows;
  }, [data, search, filterContext, filterType, filterStatus, filterYP, sortBy]);

  /* ── stats ───────────────────────────────────────────────────────────────── */

  const thisTermCount = data.length;

  const topContext = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => { counts[r.context] = (counts[r.context] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : "—";
  }, [data]);

  const resolvedPct = useMemo(() => {
    if (data.length === 0) return 0;
    const resolved = data.filter((r) => r.status === "Closed - resolved").length;
    return Math.round((resolved / data.length) * 100);
  }, [data]);

  const patternsIdentified = useMemo(() => {
    return data.filter((r) =>
      r.patternIndicator.toLowerCase().includes("pattern") ||
      r.patternIndicator.toLowerCase().includes("second") ||
      r.patternIndicator.toLowerCase().includes("twice") ||
      r.patternIndicator.toLowerCase().includes("cumulative"),
    ).length;
  }, [data]);

  const yps = Array.from(new Set(data.map((r) => r.victim)));

  /* ── export ──────────────────────────────────────────────────────────────── */

  const exportCols: ExportColumn<BullyingIncident>[] = [
    { header: "Date", accessor: (r: BullyingIncident) => r.date },
    { header: "Time", accessor: (r: BullyingIncident) => r.time },
    { header: "Child Affected", accessor: (r: BullyingIncident) => getYPName(r.victim) },
    { header: "Context", accessor: (r: BullyingIncident) => r.context },
    { header: "Perpetrator Type", accessor: (r: BullyingIncident) => r.perpetratorType },
    { header: "Bullying Type", accessor: (r: BullyingIncident) => r.bullyingType },
    { header: "Description", accessor: (r: BullyingIncident) => r.description },
    { header: "Impact Observed", accessor: (r: BullyingIncident) => r.childImpactObserved },
    { header: "Child's Words", accessor: (r: BullyingIncident) => r.childWordsUsed },
    { header: "Reported By", accessor: (r: BullyingIncident) => r.reportedBy === "Child disclosed" ? "Child disclosed" : getStaffName(r.reportedBy) },
    { header: "Child Wanted Reporting", accessor: (r: BullyingIncident) => r.childWantedReporting ? "Yes" : "No" },
    { header: "External Agencies Notified", accessor: (r: BullyingIncident) => r.externalAgenciesNotified.join("; ") },
    { header: "School Notified", accessor: (r: BullyingIncident) => r.schoolNotified ? "Yes" : "No" },
    { header: "Police Notified", accessor: (r: BullyingIncident) => r.policeNotified ? "Yes" : "No" },
    { header: "Parents Informed", accessor: (r: BullyingIncident) => r.parentsInformed ? "Yes" : "No" },
    { header: "Restorative Approach", accessor: (r: BullyingIncident) => r.restorativeApproachAttempted },
    { header: "Support Provided", accessor: (r: BullyingIncident) => r.supportProvided.join("; ") },
    { header: "Perpetrator Outcome", accessor: (r: BullyingIncident) => r.perpetratorOutcome },
    { header: "Wellbeing Post-Incident", accessor: (r: BullyingIncident) => r.wellbeingPostIncident },
    { header: "Follow-Up Date", accessor: (r: BullyingIncident) => r.followUpDate },
    { header: "Status", accessor: (r: BullyingIncident) => r.status },
    { header: "Pattern Indicator", accessor: (r: BullyingIncident) => r.patternIndicator },
  ];

  /* ── render ──────────────────────────────────────────────────────────────── */

  return (
    <PageShell
      title="Bullying Incident Log"
      subtitle="Quality Standard 5 (Care planning) · Anti-bullying response · Sensitive record"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Bullying Incident Log" />
          <ExportButton data={filtered} columns={exportCols} filename="bullying-incident-log" />
        </div>
      }
    >
      <div id="print-area">
        {/* ── stat strip ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "This Term", value: thisTermCount, icon: Activity, clr: "text-blue-600" },
            { label: "Top Context", value: topContext, icon: MapPin, clr: "text-purple-600" },
            { label: "Resolved", value: `${resolvedPct}%`, icon: CheckCircle2, clr: "text-green-600" },
            { label: "Patterns Identified", value: patternsIdentified, icon: AlertTriangle, clr: "text-amber-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3 text-center">
                <s.icon className={cn("h-5 w-5 mx-auto mb-1", s.clr)} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── philosophy banner ────────────────────────────────────────────── */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Heart className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-rose-800 mb-1">Our anti-bullying philosophy</p>
            <p className="text-rose-700">
              Every child has the right to feel safe, valued and listened to. We take all bullying — peer-on-peer (in or out of the home), online,
              or directed at our children from outside — seriously and respond proportionately. The child&apos;s voice leads our response: we ask what
              they want to happen, support their choices wherever it is safe to do so, and keep them informed at every step. We use restorative
              approaches by default, escalate where needed, and never minimise what a child has experienced. Records here are sensitive and
              shared only with those who need to know.
            </p>
          </div>
        </div>

        {/* ── filters ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search description, child, words used…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterYP} onValueChange={setFilterYP}>
            <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {yps.map((y) => (<SelectItem key={y} value={y}>{getYPName(y)}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterContext} onValueChange={setFilterContext}>
            <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contexts</SelectItem>
              {CONTEXTS.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[170px]"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><ArrowUpDown className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="yp">By Child</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── records ──────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {filtered.map((r) => {
            const open = expandedId === r.id;
            const ContextIcon = CONTEXT_ICON[r.context];
            return (
              <Card
                key={r.id}
                className={cn(
                  "border-l-4",
                  BORDER_STATUS[r.status],
                )}
              >
                <CardHeader className="pb-2 cursor-pointer" onClick={() => toggle(r.id)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        {getYPName(r.victim)}
                        <Badge variant="outline" className={CONTEXT_CLR[r.context]}>
                          <ContextIcon className="h-3 w-3 mr-1" /> {r.context}
                        </Badge>
                        <Badge variant="outline" className={TYPE_CLR[r.bullyingType]}>{r.bullyingType}</Badge>
                        <Badge variant="outline" className={STATUS_CLR[r.status]}>{r.status}</Badge>
                        {r.childWantedReporting && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <Megaphone className="h-3 w-3 mr-1" /> Child-led
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {r.perpetratorType} · {r.date} at {r.time}
                      </p>
                    </div>
                    {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </CardHeader>
                {open && (
                  <CardContent className="pt-0 space-y-4 text-sm">
                    {/* child voice highlight */}
                    {r.childWordsUsed && (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                        <p className="font-semibold text-rose-800 flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" /> In the child&apos;s own words
                        </p>
                        <p className="italic text-rose-700 mt-1">&ldquo;{r.childWordsUsed}&rdquo;</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium mb-1">What happened</p>
                        <p className="text-muted-foreground">{r.description}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1 flex items-center gap-1"><Activity className="h-4 w-4" /> Impact observed</p>
                        <p className="text-muted-foreground">{r.childImpactObserved}</p>
                      </div>
                    </div>

                    {/* response strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-muted/40 rounded p-2">
                        <p className="font-medium text-xs">Child wanted reporting</p>
                        <p className="text-xs text-muted-foreground">{r.childWantedReporting ? "Yes" : "No — child-led pause"}</p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="font-medium text-xs">School notified</p>
                        <p className="text-xs text-muted-foreground">{r.schoolNotified ? "Yes" : "No"}</p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="font-medium text-xs">Police notified</p>
                        <p className="text-xs text-muted-foreground">{r.policeNotified ? "Yes" : "No"}</p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="font-medium text-xs">Parents informed</p>
                        <p className="text-xs text-muted-foreground">{r.parentsInformed ? "Yes" : "No"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium mb-1 flex items-center gap-1"><Users className="h-4 w-4" /> Restorative approach</p>
                        <p className="text-muted-foreground">{r.restorativeApproachAttempted}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1 flex items-center gap-1"><Sparkles className="h-4 w-4" /> Wellbeing post-incident</p>
                        <p className="text-muted-foreground">{r.wellbeingPostIncident}</p>
                      </div>
                    </div>

                    {/* support tags */}
                    {r.supportProvided.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Support provided</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.supportProvided.map((s, i) => (
                            <Badge key={i} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* perpetrator outcome (anonymised) */}
                    <div>
                      <p className="font-medium mb-1">Perpetrator outcome (anonymised)</p>
                      <p className="text-muted-foreground">{r.perpetratorOutcome}</p>
                    </div>

                    {/* pattern indicator */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="font-semibold text-amber-800 flex items-center gap-1">
                        <ShieldAlert className="h-4 w-4" /> Pattern review
                      </p>
                      <p className="text-amber-700 text-xs mt-1">{r.patternIndicator}</p>
                    </div>

                    {/* external agencies */}
                    {r.externalAgenciesNotified.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="text-muted-foreground">Agencies notified:</span>
                        {r.externalAgenciesNotified.map((a, i) => (
                          <Badge key={i} variant="outline" className="bg-slate-50">{a}</Badge>
                        ))}
                      </div>
                    )}

                    {/* footer */}
                    <div className="flex flex-wrap justify-between items-center pt-2 border-t text-xs text-muted-foreground gap-2">
                      <span>
                        Reported by: {r.reportedBy === "Child disclosed" ? "Child disclosed" : getStaffName(r.reportedBy)}
                      </span>
                      <span>Follow-up: {r.followUpDate}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* ── regulatory note ────────────────────────────────────────────── */}
        <div className="mt-6 bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Regulatory Framework</p>
          <p>
            Children&apos;s Homes (England) Regulations 2015, Quality Standard 5 (Care planning) and Standard 4 (Protection) — children must be helped to
            understand bullying, supported to disclose, and protected from harm. This log captures peer-on-peer bullying inside or outside the home,
            online bullying, and bullying directed at our children from outside. Records align with the home&apos;s Anti-Bullying Policy, Behaviour Support Plans,
            and Contextual Safeguarding considerations. Cross-reference with Behaviour Log, Online Safety records, and Key Work entries. Where a pattern,
            severity, or risk threshold is met, escalate to the Registered Manager and consider a safeguarding referral under Working Together to Safeguard
            Children 2018. Records are sensitive — access is limited to those with a legitimate need to know — and retained until the child&apos;s 25th birthday
            (or 75 years for looked-after children, per Reg 37).
          </p>
        </div>
      </div>
    </PageShell>
  );
}

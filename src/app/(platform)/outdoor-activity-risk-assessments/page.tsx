"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ArrowUpDown, MapPin, Shield, AlertTriangle, CheckCircle, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivityRA {
  id: string;
  activityName: string;
  activityType: "Walking/Hiking" | "Cycling" | "Water-based" | "Climbing" | "Sport spectator" | "Adventure park" | "Theme park" | "Beach" | "Wildlife/Zoo" | "Music/Festival" | "Public transport" | "City visit";
  youngPeopleAttending: string[];
  staffEscort: string[];
  date: string;
  durationHours: number;
  location: string;
  hazards: { hazard: string; severity: "Low" | "Medium" | "High"; control: string }[];
  childSpecificConsiderations: { youngPerson: string; consideration: string }[];
  behaviourRiskRating: "Low" | "Medium" | "High";
  missingFromCareRisk: "Low" | "Medium" | "High";
  supervisionRatio: string;
  equipmentRequired: string[];
  permissionsObtained: boolean;
  externalRiskAssessment: string;
  emergencyProcedures: string[];
  preActivityBriefing: string;
  reviewedBy: string;
  signedOffByRM: boolean;
}

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

const data: ActivityRA[] = [
  {
    id: "ra-001", activityName: "Theme park day trip — Alton Towers", activityType: "Theme park",
    youngPeopleAttending: ["yp_alex", "yp_jordan"], staffEscort: ["staff_lackson", "staff_ryan"],
    date: d(14), durationHours: 10, location: "Alton Towers, Staffordshire",
    hazards: [
      { hazard: "Crowds — getting separated", severity: "Medium", control: "Group photo at start; meeting points agreed; phone check-ins every 90 mins" },
      { hazard: "Long queues — frustration", severity: "Low", control: "Fast-track tickets purchased; alternative quiet zone identified" },
      { hazard: "Ride safety", severity: "Medium", control: "Age/height restrictions checked; Alex's glasses-friendly rides only" },
      { hazard: "Travel — long journey", severity: "Low", control: "Vehicle pre-checked; breaks every 2 hours" },
    ],
    childSpecificConsiderations: [
      { youngPerson: "yp_alex", consideration: "ADHD — overstimulation risk; agreed quiet breaks every 90 mins" },
      { youngPerson: "yp_jordan", consideration: "Familiar with theme parks; comfort confident; free to roam in agreed zones" },
    ],
    behaviourRiskRating: "Low", missingFromCareRisk: "Low", supervisionRatio: "1:1 in unfamiliar areas; 1:2 in agreed zones",
    equipmentRequired: ["First aid kit", "Phones charged", "Cash + card", "Sun cream", "Water"],
    permissionsObtained: true, externalRiskAssessment: "Park's own published RA reviewed",
    emergencyProcedures: ["999 if medical", "Park's own first aid stations", "RM on-call"],
    preActivityBriefing: "Group briefing at 09:00; phone numbers exchanged; agreed pickup point and time",
    reviewedBy: "staff_darren", signedOffByRM: true,
  },
  {
    id: "ra-002", activityName: "Casey's nature walk — Riverside woodland", activityType: "Walking/Hiking",
    youngPeopleAttending: ["yp_casey"], staffEscort: ["staff_anna"],
    date: d(7), durationHours: 2, location: "Riverside Nature Reserve",
    hazards: [
      { hazard: "Sensory overload (other visitors)", severity: "Low", control: "Mid-week quiet day chosen; ear defenders in bag" },
      { hazard: "Slips/trips on uneven ground", severity: "Low", control: "Familiar route; suitable footwear" },
      { hazard: "Weather changes", severity: "Low", control: "Layered clothing; weather checked" },
    ],
    childSpecificConsiderations: [{ youngPerson: "yp_casey", consideration: "ASD — sensory pace; familiar route preferred; sensory bag with otter, ear defenders, fidgets" }],
    behaviourRiskRating: "Low", missingFromCareRisk: "Low", supervisionRatio: "1:1 throughout",
    equipmentRequired: ["Sensory bag", "Water", "Snacks (Casey's safe foods)", "First aid kit", "Camera (Casey's interest)"],
    permissionsObtained: true, externalRiskAssessment: "Reserve's published guidance reviewed",
    emergencyProcedures: ["999 if needed", "Anna's phone with location sharing on", "RM on-call"],
    preActivityBriefing: "Visual schedule shared with Casey morning of; Casey set the pace",
    reviewedBy: "staff_anna", signedOffByRM: true,
  },
  {
    id: "ra-003", activityName: "Cycling outing — local cycle path", activityType: "Cycling",
    youngPeopleAttending: ["yp_alex", "yp_jordan"], staffEscort: ["staff_lackson"],
    date: d(21), durationHours: 3, location: "Riverside Greenway",
    hazards: [
      { hazard: "Road crossings", severity: "Medium", control: "Agreed route uses cycle paths and zebra crossings only; group cycling rules briefed" },
      { hazard: "Bike falls", severity: "Low", control: "Helmets compulsory; bikes serviced; first aid kit" },
      { hazard: "Group separation", severity: "Low", control: "Lackson rides at back; meeting points every 1 mile" },
    ],
    childSpecificConsiderations: [],
    behaviourRiskRating: "Low", missingFromCareRisk: "Low", supervisionRatio: "1:2 (Lackson)",
    equipmentRequired: ["Helmets", "Bike repair kit", "First aid", "Phones", "Water"],
    permissionsObtained: true, externalRiskAssessment: "Greenway operator guidelines reviewed",
    emergencyProcedures: ["999 if injury", "RM on-call", "Bike repair shop locations identified on route"],
    preActivityBriefing: "Cycling rules; helmet check; route shown",
    reviewedBy: "staff_lackson", signedOffByRM: true,
  },
  {
    id: "ra-004", activityName: "Cultural music festival — Manchester", activityType: "Music/Festival",
    youngPeopleAttending: ["yp_jordan"], staffEscort: ["staff_chervelle"],
    date: d(35), durationHours: 6, location: "Manchester city centre festival",
    hazards: [
      { hazard: "Crowds + missing", severity: "Medium", control: "Stay together; phone tracking on; meeting point if separated; plan agreed pre-trip" },
      { hazard: "Substance exposure", severity: "Medium", control: "Family-friendly festival selected; arrival/departure times limit late evening exposure" },
      { hazard: "Public transport", severity: "Low", control: "Pre-booked taxi return rather than late train" },
    ],
    childSpecificConsiderations: [{ youngPerson: "yp_jordan", consideration: "Cultural identity affirming event — significant. Chervelle culturally matched. Cousin Devon attending separately — meet up planned." }],
    behaviourRiskRating: "Low", missingFromCareRisk: "Medium", supervisionRatio: "1:1 (Chervelle)",
    equipmentRequired: ["Phones", "Cash", "Cousin Devon's contact", "Festival map"],
    permissionsObtained: true, externalRiskAssessment: "Festival operator's RA reviewed",
    emergencyProcedures: ["999 if needed", "Festival security", "RM on-call", "Pre-booked taxi for return"],
    preActivityBriefing: "Meeting points; phone check-ins every 60 mins; cousin Devon coordination",
    reviewedBy: "staff_chervelle", signedOffByRM: true,
  },
  {
    id: "ra-005", activityName: "Beach day — North Wales", activityType: "Beach",
    youngPeopleAttending: ["yp_alex", "yp_jordan", "yp_casey"], staffEscort: ["staff_darren", "staff_anna", "staff_chervelle"],
    date: d(60), durationHours: 8, location: "Llandudno beach",
    hazards: [
      { hazard: "Drowning/water risk", severity: "High", control: "Lifeguarded beach only; agreed water boundary; constant supervision; non-swimmer (Casey) stays at shore" },
      { hazard: "Sun/UV exposure", severity: "Medium", control: "SPF 50; hats; shaded breaks; hydration" },
      { hazard: "Sensory overload", severity: "Medium", control: "Quieter section; sensory bag; Anna with Casey throughout" },
    ],
    childSpecificConsiderations: [
      { youngPerson: "yp_casey", specialNeeds: "ASD + sensory + non-swimmer — Anna stays with Casey; sensory tools; quiet area; only paddles to ankles" } as any,
      { youngPerson: "yp_jordan", specialNeeds: "Confident swimmer; agreed boundary line; partner system with staff" } as any,
      { youngPerson: "yp_alex", specialNeeds: "Confident swimmer; partner system" } as any,
    ],
    behaviourRiskRating: "Low", missingFromCareRisk: "Low", supervisionRatio: "1:1 throughout",
    equipmentRequired: ["Beach kit", "First aid", "Sensory bag", "Sun protection", "Towels", "Water/snacks"],
    permissionsObtained: true, externalRiskAssessment: "Lifeguarded beach selected; council guidance reviewed",
    emergencyProcedures: ["999/lifeguard", "RM on-call", "Closest A&E identified"],
    preActivityBriefing: "Water rules; meeting points; partner system; Casey's plan",
    reviewedBy: "staff_darren", signedOffByRM: true,
  },
  {
    id: "ra-006", activityName: "Climbing wall — indoor", activityType: "Climbing",
    youngPeopleAttending: ["yp_alex", "yp_jordan"], staffEscort: ["staff_lackson"],
    date: d(28), durationHours: 2, location: "Riverside Indoor Climbing Centre",
    hazards: [
      { hazard: "Falls from height", severity: "Medium", control: "Centre's certified instructors; harnesses required; auto-belay or staff belay" },
      { hazard: "Equipment failure", severity: "Low", control: "Centre maintains equipment; certified daily" },
    ],
    childSpecificConsiderations: [{ youngPerson: "yp_alex", consideration: "Boxing fitness applicable; clear safety briefing important" }],
    behaviourRiskRating: "Low", missingFromCareRisk: "Low", supervisionRatio: "1:2 (instructor + Lackson)",
    equipmentRequired: ["Climbing kit (provided)", "Sportswear", "Water"],
    permissionsObtained: true, externalRiskAssessment: "Centre's full RA reviewed; instructors qualified",
    emergencyProcedures: ["Centre first aid", "999 if needed", "RM on-call"],
    preActivityBriefing: "Centre induction + Lackson reinforces",
    reviewedBy: "staff_lackson", signedOffByRM: true,
  },
];

const riskColour: Record<string, string> = { Low: "bg-green-100 text-green-800", Medium: "bg-amber-100 text-amber-800", High: "bg-red-100 text-red-800" };
const exportCols: ExportColumn<ActivityRA>[] = [
  { header: "Activity", accessor: (r: ActivityRA) => r.activityName },
  { header: "Type", accessor: (r: ActivityRA) => r.activityType },
  { header: "Date", accessor: (r: ActivityRA) => r.date },
  { header: "Children", accessor: (r: ActivityRA) => r.youngPeopleAttending.map(getYPName).join(", ") },
  { header: "Staff", accessor: (r: ActivityRA) => String(r.staffEscort.length) },
  { header: "Behaviour Risk", accessor: (r: ActivityRA) => r.behaviourRiskRating },
  { header: "Missing Risk", accessor: (r: ActivityRA) => r.missingFromCareRisk },
  { header: "Signed Off", accessor: (r: ActivityRA) => r.signedOffByRM ? "Yes" : "No" },
];

export default function OutdoorActivityRiskAssessmentsPage() {
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const filtered = useMemo(() => {
    let items = [...data];
    if (filterType !== "all") items = items.filter((a) => a.activityType === filterType);
    items.sort((a, b) => sortBy === "date" ? a.date.localeCompare(b.date) : 0);
    return items;
  }, [filterType, sortBy]);
  const total = data.length;
  const highRisk = data.filter((a) => a.behaviourRiskRating === "High" || a.missingFromCareRisk === "High" || a.hazards.some((h) => h.severity === "High")).length;
  const allSignedOff = data.every((a) => a.signedOffByRM);

  return (
    <PageShell title="Outdoor Activity Risk Assessments" subtitle="Activity-specific RAs — trips, outings, water, climbing, festivals, and city visits"
      actions={<div className="flex items-center gap-2"><ExportButton data={data} columns={exportCols} filename="outdoor-activity-risk-assessments" /><PrintButton title="Outdoor Activity Risk Assessments" /></div>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold">{total}</p><p className="text-xs text-muted-foreground">Active RAs</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-amber-600">{highRisk}</p><p className="text-xs text-muted-foreground">High-Risk Activities</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-green-600">{allSignedOff ? "100%" : `${data.filter((a) => a.signedOffByRM).length}/${total}`}</p><p className="text-xs text-muted-foreground">RM Signed Off</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-blue-600">3/3</p><p className="text-xs text-muted-foreground">Children Engaged</p></div>
      </div>
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-6 flex items-start gap-2">
        <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">Every outing has a written RA. Hazards identified, controls agreed, child-specific considerations included. Signed off by RM. Adventure happens — safely.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity Types</SelectItem>
            {(["Walking/Hiking","Cycling","Water-based","Climbing","Theme park","Beach","Music/Festival","Wildlife/Zoo","Adventure park","Sport spectator","City visit","Public transport"]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1"><ArrowUpDown className="h-4 w-4 text-muted-foreground" /><Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="date">Soonest First</SelectItem></SelectContent></Select></div>
      </div>
      <div className="space-y-3">
        {filtered.map((a) => {
          const isExpanded = expandedId === a.id;
          return (
            <div key={a.id} className="rounded-xl border bg-white overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : a.id)}>
                <div className="flex items-center gap-3 flex-1 min-w-0"><MapPin className="h-5 w-5 text-amber-600 shrink-0" /><div className="min-w-0"><p className="font-medium truncate">{a.activityName}</p><p className="text-xs text-muted-foreground mt-0.5">{a.date} &middot; {a.location} &middot; {a.youngPeopleAttending.length} children &middot; {a.durationHours}h</p></div></div>
                <div className="flex items-center gap-2 shrink-0 ml-3"><span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", riskColour[a.behaviourRiskRating])}>{a.behaviourRiskRating} risk</span>{a.signedOffByRM && <CheckCircle className="h-4 w-4 text-green-500" />}{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
              </button>
              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-3 text-sm">
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Children Attending</p><p>{a.youngPeopleAttending.map(getYPName).join(", ")}</p><p className="text-xs text-muted-foreground">Staff escort: {a.staffEscort.map(getStaffName).join(", ")} &middot; Ratio {a.supervisionRatio}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2"><AlertTriangle className="h-3 w-3 inline mr-1" />Hazards &amp; Controls</p><div className="space-y-1">{a.hazards.map((h, i) => (<div key={i} className="bg-white rounded-lg p-2 border"><div className="flex items-center justify-between"><span className="font-medium">{h.hazard}</span><span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", riskColour[h.severity])}>{h.severity}</span></div><p className="text-xs text-blue-700 mt-0.5">Control: {h.control}</p></div>))}</div></div>
                  {a.childSpecificConsiderations.length > 0 && <div className="bg-pink-50 rounded-lg p-3"><p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1"><Users className="h-3 w-3 inline mr-1" />Child-Specific Considerations</p><div className="space-y-1">{a.childSpecificConsiderations.map((c, i) => (<div key={i} className="text-sm"><strong>{getYPName(c.youngPerson)}:</strong> {c.consideration || (c as any).specialNeeds}</div>))}</div></div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div className="bg-white rounded-lg p-3 border"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Equipment</p><p>{a.equipmentRequired.join(", ")}</p></div><div className="bg-white rounded-lg p-3 border"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Emergency Procedures</p><p>{a.emergencyProcedures.join("; ")}</p></div></div>
                  <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Briefing</p><p>{a.preActivityBriefing}</p></div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t"><span>External RA: {a.externalRiskAssessment}</span><span>Reviewed by: {getStaffName(a.reviewedBy)}</span>{a.signedOffByRM && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Signed off by RM</span>}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-lg bg-muted/50 border p-4"><p className="text-xs text-muted-foreground"><strong>Regulatory Context:</strong> Activity RAs support Quality Standard 5 (protection), Quality Standard 25, and Reg 23. Linked to Transport Risk Assessments and Holiday Planning.</p></div>
    </PageShell>
  );
}

"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ArrowUpDown, UserCheck, CheckCircle, AlertTriangle, Star, Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgencyFeedback {
  id: string;
  agencyStaffName: string;
  agency: string;
  shiftDate: string;
  shiftType: "Early" | "Late" | "Sleep-in" | "Wake-night" | "Long day";
  inductionRecorded: boolean;
  permanentStaffOnShift: string;
  childrenInteractedWith: string[];
  observationsPositive: string[];
  observationsConstructive: string[];
  childFeedback: string;
  followsRoutines: boolean;
  followsBehaviourSupportPlans: boolean;
  followsSensoryProtocols: boolean;
  recordingQuality: "Excellent" | "Good" | "Adequate" | "Needs improvement";
  professionalismRating: number;
  relationalSkillsRating: number;
  overallVerdict: "Approved for repeat" | "Approved with development plan" | "Not approved for repeat" | "Conditional";
  feedbackToAgencyDate: string;
  feedbackSummary: string;
  followUpAction: string;
  reviewedBy: string;
  notes: string;
}

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

const data: AgencyFeedback[] = [
  {
    id: "af-001", agencyStaffName: "Karen Mitchell", agency: "Riverside Care Agency", shiftDate: d(-7), shiftType: "Late",
    inductionRecorded: true, permanentStaffOnShift: "staff_chervelle",
    childrenInteractedWith: ["yp_alex", "yp_jordan", "yp_casey"],
    observationsPositive: ["Calm presence — children responded well", "Followed Casey's sensory protocols correctly", "Excellent recording in shift notes", "Active listening — Alex commented she 'actually listened'", "Professional with Jordan during a small frustration moment"],
    observationsConstructive: ["Could be more proactive joining children's activities — slightly observer rather than participant"],
    childFeedback: "Alex: 'She was alright. Listened.' Jordan: 'Calm, didn't bother me.' Casey: [thumbs up]",
    followsRoutines: true, followsBehaviourSupportPlans: true, followsSensoryProtocols: true,
    recordingQuality: "Excellent", professionalismRating: 5, relationalSkillsRating: 4,
    overallVerdict: "Approved for repeat",
    feedbackToAgencyDate: d(-5), feedbackSummary: "Strong agency staff member. Children comfortable. Approved for repeat bookings. Coaching note: encourage more active engagement during free time.",
    followUpAction: "Approved for routine bookings; agency informed", reviewedBy: "staff_darren",
    notes: "Karen previously worked here — known quantity. Continued strong practice.",
  },
  {
    id: "af-002", agencyStaffName: "Tom Hartley", agency: "FastCover Children's Services", shiftDate: d(-14), shiftType: "Sleep-in",
    inductionRecorded: true, permanentStaffOnShift: "staff_lackson",
    childrenInteractedWith: ["yp_alex", "yp_jordan", "yp_casey"],
    observationsPositive: ["Reliable — turned up early", "Followed sleep-in protocol exactly", "Documentation accurate"],
    observationsConstructive: ["First time at our home — relational warmth still developing", "Did not engage with Casey's visual cards initially (corrected after permanent staff prompt)"],
    childFeedback: "Casey was uncertain in the morning — required Anna's reassurance. Alex didn't notice (asleep). Jordan said 'didn't see him much, slept fine'.",
    followsRoutines: true, followsBehaviourSupportPlans: true, followsSensoryProtocols: false,
    recordingQuality: "Good", professionalismRating: 4, relationalSkillsRating: 3,
    overallVerdict: "Approved with development plan",
    feedbackToAgencyDate: d(-12), feedbackSummary: "Conscientious. Needs additional briefing on Casey's specific sensory protocols before next sleep-in. Re-induction on Casey's profile required.",
    followUpAction: "Re-briefing scheduled before next booking; agency informed", reviewedBy: "staff_darren",
    notes: "First-time agency cover. Reasonable performance with clear development area.",
  },
  {
    id: "af-003", agencyStaffName: "Emma Roberts", agency: "Riverside Care Agency", shiftDate: d(-30), shiftType: "Long day",
    inductionRecorded: true, permanentStaffOnShift: "staff_anna",
    childrenInteractedWith: ["yp_alex", "yp_jordan", "yp_casey"],
    observationsPositive: ["Outstanding rapport with children", "Casey responded warmly — significant given Casey's profile", "Excellent restorative approach during a small Alex/Jordan disagreement", "Photo opportunity captured for Casey's album (with consent)"],
    observationsConstructive: [],
    childFeedback: "Alex: 'She's class. Hope she comes back.' Jordan: 'She's solid.' Casey: [showed her artwork — significant trust].",
    followsRoutines: true, followsBehaviourSupportPlans: true, followsSensoryProtocols: true,
    recordingQuality: "Excellent", professionalismRating: 5, relationalSkillsRating: 5,
    overallVerdict: "Approved for repeat",
    feedbackToAgencyDate: d(-28), feedbackSummary: "Exceptional agency cover. Approved for priority repeat booking. Emma is requested by name where possible.",
    followUpAction: "Added to preferred-agency-staff list; agency thanked", reviewedBy: "staff_darren",
    notes: "Emma is the gold standard — agency-employed practice can match permanent quality.",
  },
  {
    id: "af-004", agencyStaffName: "[Agency staff name held]", agency: "FlexiCare Solutions", shiftDate: d(-90), shiftType: "Late",
    inductionRecorded: true, permanentStaffOnShift: "staff_ryan",
    childrenInteractedWith: ["yp_alex", "yp_jordan"],
    observationsPositive: ["Punctual"],
    observationsConstructive: ["Did not follow consequence framework — used sanction language with Jordan", "Recording fell short of standard", "Did not engage with sensory tool when Casey self-initiated", "Defensive when offered constructive feedback in handover"],
    childFeedback: "Jordan said: 'Felt like a teacher. Not in a good way.' Alex didn't connect.",
    followsRoutines: true, followsBehaviourSupportPlans: false, followsSensoryProtocols: false,
    recordingQuality: "Adequate", professionalismRating: 3, relationalSkillsRating: 2,
    overallVerdict: "Not approved for repeat",
    feedbackToAgencyDate: d(-88), feedbackSummary: "Practice does not align with our model. Not approved for repeat at this home. Constructive feedback shared with agency for development.",
    followUpAction: "Agency informed; not booked again. Documented decline.", reviewedBy: "staff_darren",
    notes: "Important to act on misalignment quickly. Children's experience is the test.",
  },
];

const verdictColour: Record<string, string> = {
  "Approved for repeat": "bg-green-100 text-green-800",
  "Approved with development plan": "bg-blue-100 text-blue-800",
  "Conditional": "bg-amber-100 text-amber-800",
  "Not approved for repeat": "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<AgencyFeedback>[] = [
  { header: "Agency Staff", accessor: (r: AgencyFeedback) => r.agencyStaffName },
  { header: "Agency", accessor: (r: AgencyFeedback) => r.agency },
  { header: "Date", accessor: (r: AgencyFeedback) => r.shiftDate },
  { header: "Shift", accessor: (r: AgencyFeedback) => r.shiftType },
  { header: "Verdict", accessor: (r: AgencyFeedback) => r.overallVerdict },
  { header: "Professionalism", accessor: (r: AgencyFeedback) => `${r.professionalismRating}/5` },
  { header: "Relational", accessor: (r: AgencyFeedback) => `${r.relationalSkillsRating}/5` },
  { header: "Recording", accessor: (r: AgencyFeedback) => r.recordingQuality },
];

export default function AgencyStaffFeedbackPage() {
  const [filterVerdict, setFilterVerdict] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterVerdict !== "all") items = items.filter((f) => f.overallVerdict === filterVerdict);
    items.sort((a, b) => sortBy === "date" ? b.shiftDate.localeCompare(a.shiftDate) : 0);
    return items;
  }, [filterVerdict, sortBy]);

  const total = data.length;
  const approved = data.filter((f) => f.overallVerdict === "Approved for repeat").length;
  const declined = data.filter((f) => f.overallVerdict === "Not approved for repeat").length;
  const avgProf = (data.reduce((sum, f) => sum + f.professionalismRating, 0) / data.length).toFixed(1);

  return (
    <PageShell title="Agency Staff Feedback" subtitle="Performance feedback after agency staff cover shifts — approval, development, and repeat-booking decisions"
      actions={<div className="flex items-center gap-2"><ExportButton data={data} columns={exportCols} filename="agency-staff-feedback" /><PrintButton title="Agency Staff Feedback" /></div>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold">{total}</p><p className="text-xs text-muted-foreground">Reviews</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-green-600">{approved}</p><p className="text-xs text-muted-foreground">Approved Repeat</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className={cn("text-2xl font-bold", declined > 0 ? "text-red-600" : "text-green-600")}>{declined}</p><p className="text-xs text-muted-foreground">Declined</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-blue-600">{avgProf}/5</p><p className="text-xs text-muted-foreground">Avg Professionalism</p></div>
      </div>
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-6 flex items-start gap-2">
        <UserCheck className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">Every agency shift is followed by a formal review. Children&apos;s feedback included. Practice alignment with our model is the standard. Approved staff added to preferred list; misalignment results in non-booking — children&apos;s experience is the test.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterVerdict} onValueChange={setFilterVerdict}><SelectTrigger className="w-[200px]"><SelectValue placeholder="All Verdicts" /></SelectTrigger><SelectContent><SelectItem value="all">All Verdicts</SelectItem><SelectItem value="Approved for repeat">Approved Repeat</SelectItem><SelectItem value="Approved with development plan">Development Plan</SelectItem><SelectItem value="Conditional">Conditional</SelectItem><SelectItem value="Not approved for repeat">Not Approved</SelectItem></SelectContent></Select>
        <div className="flex items-center gap-1"><ArrowUpDown className="h-4 w-4 text-muted-foreground" /><Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="date">Most Recent</SelectItem></SelectContent></Select></div>
      </div>
      <div className="space-y-3">
        {filtered.map((f) => {
          const isExpanded = expandedId === f.id;
          return (
            <div key={f.id} className="rounded-xl border bg-white overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : f.id)}>
                <div className="flex items-center gap-3 flex-1 min-w-0"><UserCheck className="h-5 w-5 text-blue-600 shrink-0" /><div className="min-w-0"><p className="font-medium truncate">{f.agencyStaffName} ({f.agency})</p><p className="text-xs text-muted-foreground mt-0.5">{f.shiftDate} &middot; {f.shiftType} &middot; with {getStaffName(f.permanentStaffOnShift)}</p></div></div>
                <div className="flex items-center gap-2 shrink-0 ml-3"><span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", verdictColour[f.overallVerdict])}>{f.overallVerdict}</span>{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
              </button>
              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3"><p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1"><Star className="h-3 w-3 inline mr-1" />Positive Observations</p><ul className="space-y-1">{f.observationsPositive.map((o, i) => <li key={i} className="flex items-start gap-1"><CheckCircle className="h-3 w-3 text-emerald-500 mt-1 shrink-0" /><span>{o}</span></li>)}</ul></div>
                    {f.observationsConstructive.length > 0 && <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1"><AlertTriangle className="h-3 w-3 inline mr-1" />Constructive Observations</p><ul className="space-y-1">{f.observationsConstructive.map((o, i) => <li key={i} className="flex items-start gap-1"><span className="text-amber-600 mt-0.5">•</span><span>{o}</span></li>)}</ul></div>}
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3"><p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1"><Heart className="h-3 w-3 inline mr-1" />Children&apos;s Feedback</p><p className="italic">{f.childFeedback}</p></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2"><div className="bg-white rounded-lg p-2 border text-center"><p className="text-xs text-muted-foreground">Professionalism</p><p className="font-bold">{f.professionalismRating}/5</p></div><div className="bg-white rounded-lg p-2 border text-center"><p className="text-xs text-muted-foreground">Relational</p><p className="font-bold">{f.relationalSkillsRating}/5</p></div><div className="bg-white rounded-lg p-2 border text-center"><p className="text-xs text-muted-foreground">Recording</p><p className="font-bold">{f.recordingQuality}</p></div></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div className={cn("rounded p-2 text-center", f.followsRoutines ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800")}>Routines: {f.followsRoutines ? "✓" : "Action"}</div>
                    <div className={cn("rounded p-2 text-center", f.followsBehaviourSupportPlans ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800")}>BSP: {f.followsBehaviourSupportPlans ? "✓" : "Action"}</div>
                    <div className={cn("rounded p-2 text-center", f.followsSensoryProtocols ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800")}>Sensory: {f.followsSensoryProtocols ? "✓" : "Action"}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Feedback Summary</p><p>{f.feedbackSummary}</p></div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t"><span>Feedback to agency: {f.feedbackToAgencyDate}</span><span>Reviewed: {getStaffName(f.reviewedBy)}</span><span>Action: {f.followUpAction}</span></div>
                  {f.notes && <div className="bg-slate-50 rounded-lg p-3 border"><p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p><p>{f.notes}</p></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-lg bg-muted/50 border p-4"><p className="text-xs text-muted-foreground"><strong>Regulatory Context:</strong> Agency staff feedback supports Quality Standard 13 (workforce), Reg 32 (fitness of workers — extends to agency cover), and consistent practice standards. Linked to Agency Staff Induction and Staff Recognition Log.</p></div>
    </PageShell>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  Shield,
  AlertTriangle,
  FileText,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Phone,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── types ─────────────────────────────────────────────────────────────── */

interface PoliceRecord {
  id: string;
  youngPerson: string;
  contactDate: string;
  contactType:
    | "Missing-from-care report"
    | "Voluntary attendance — interview"
    | "Arrest"
    | "Victim of crime"
    | "Witness — voluntary"
    | "Stop and search"
    | "Restorative resolution"
    | "Welfare check by police"
    | "Information sharing only"
    | "Other";
  reportedBy:
    | "Home"
    | "Child"
    | "School"
    | "Member of public"
    | "Police-initiated"
    | "Other agency";
  officersInvolved?: string;
  policeRefNumber?: string;
  reasonContext: string;
  homeProtocolFollowed: boolean;
  concordatPrinciplesApplied: string[];
  appropriateAdultPresent?: string;
  legalRepPresent?: string;
  outcome:
    | "No further action"
    | "Voluntary interview only"
    | "Restorative justice"
    | "Caution"
    | "Charged"
    | "Bail"
    | "Released no charge"
    | "Returned to home"
    | "Other";
  restorativeOpportunity: boolean;
  restorativeOutcome?: string;
  childVoice: string;
  staffObservation: string;
  followUpRequired: boolean;
  followUpAction?: string;
  flagsConcerns: string[];
  reviewDate: string;
  recordedBy: string;
}

/* ── seed ──────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const SEED: PoliceRecord[] = [
  {
    id: "pol1",
    youngPerson: "yp_jordan",
    contactDate: d(-12),
    contactType: "Voluntary attendance — interview",
    reportedBy: "Child",
    officersInvolved: "PC Khalid Ahmed (4521), DC Sarah Whitmore (3098) — Nottinghamshire Police",
    policeRefNumber: "NTS/2026/04/22-V12",
    reasonContext:
      "Jordan witnessed an altercation outside the mosque on Friday evening after prayers. Two adults began arguing and one was assaulted. Jordan voluntarily came forward to staff and asked to give a statement to the police because, in his words, 'it's the right thing to do'. Mum was contacted, came to the home, and expressed clear pride in Jordan's decision. Voluntary witness attendance arranged at Radford Road station with appropriate adult support.",
    homeProtocolFollowed: true,
    concordatPrinciplesApplied: [
      "Child is treated as a witness, not a suspect",
      "Voluntary attendance — not arrested or detained",
      "Appropriate adult present throughout despite witness (not suspect) status",
      "Interview kept short, child-paced, with breaks offered",
      "Cultural and religious context discussed (Friday prayers)",
      "Family informed and welcomed in line with Jordan's wishes",
    ],
    appropriateAdultPresent: "staff_anna",
    legalRepPresent: "Not required — witness only. Right to legal advice explained and declined.",
    outcome: "No further action",
    restorativeOpportunity: true,
    restorativeOutcome:
      "Restorative process was already happening organically — Jordan spoke with the imam at the mosque about what he'd seen and how it had affected him. The home supported a follow-up conversation. Jordan reported feeling that his community had supported him and that he had done something good.",
    childVoice:
      "I knew I had to say what I saw. Mum was proud of me — that's the bit I won't forget. The police officer was nice, she let me have water and we took a break. Anna stayed with me the whole time. I'd do it again.",
    staffObservation:
      "Jordan handled this with maturity beyond his years. He was clear about wanting to give a statement and was supported, not pushed. Mum's pride was visibly important to him. We monitored for any post-statement anxiety — none observed. This is exactly the kind of pro-social engagement the home wants to nurture.",
    followUpRequired: false,
    flagsConcerns: [],
    reviewDate: d(18),
    recordedBy: "staff_anna",
  },
  {
    id: "pol2",
    youngPerson: "yp_casey",
    contactDate: d(-26),
    contactType: "Missing-from-care report",
    reportedBy: "Home",
    officersInvolved: "PC Daniel Hartley (5612) — Derbyshire Constabulary, Missing Persons Unit",
    policeRefNumber: "DCY/2026/04/08-MP-117",
    reasonContext:
      "Casey left the home at 19:40 without permission to go to her friend Ellie's house in town. The home applied the missing-from-care protocol — staff phoned Ellie's mother first (no answer), then Casey's mobile (no answer), then completed a risk-proportionate report to police at 20:15 once protocols indicated. Casey was located at Ellie's house at 21:10 — under 90 minutes from leaving. Police debrief took place at the home with Anna and Casey present. No formal interview, no return-home interview by external party required because debrief was proportionate and home-led.",
    homeProtocolFollowed: true,
    concordatPrinciplesApplied: [
      "Proportionate response — risk-graded protocol followed before reporting",
      "No formal police interview — informal debrief at home, child-led",
      "Treated as a child, not a suspect — language of 'where were you' avoided",
      "Independent return-home interview offer made and discussed with Casey",
      "Restorative conversation between Casey and home prioritised over sanction",
      "No criminal record or reference number attached to Casey personally",
    ],
    appropriateAdultPresent: "staff_anna",
    legalRepPresent: undefined,
    outcome: "Returned to home",
    restorativeOpportunity: true,
    restorativeOutcome:
      "Casey and her key worker had a restorative conversation the following morning. Casey explained she'd wanted to see Ellie because she'd had a hard day at school and didn't think the home would let her go that late. The home reflected on this — the conversation became about how Casey can ask for what she needs, and a 'late visit on agreement' option was added to her care plan. Casey wrote a short note to staff thanking them for not 'making it big'.",
    childVoice:
      "I just wanted to see Ellie, I didn't think. I felt bad when I got back because Anna had been worrying. The police man wasn't scary, he just asked if I was okay. I wasn't told off properly, we talked about it instead. I'd say next time if I needed to go.",
    staffObservation:
      "Casey was located quickly because the home knew her associates and routines. The police response was proportionate and Concordat-aligned. Casey's emotional regulation post-incident was good — she was tearful but engaged in the restorative conversation. Care plan updated to reflect a more flexible 'agreed late visit' option. No criminalisation, no escalation.",
    followUpRequired: true,
    followUpAction:
      "Care plan updated with 'agreed late visit' option. Key work sessions to continue exploring how Casey communicates needs before acting on them. Independent return-home interview declined by Casey but offer logged.",
    flagsConcerns: [],
    reviewDate: d(4),
    recordedBy: "staff_chervelle",
  },
  {
    id: "pol3",
    youngPerson: "yp_alex",
    contactDate: d(-94),
    contactType: "Stop and search",
    reportedBy: "Police-initiated",
    officersInvolved: "PC Mark Riddell (7841), PC Joanne Carter (7902) — Derby City",
    policeRefNumber: "DBY/2026/01/30-SS-0044",
    reasonContext:
      "Alex was stopped and searched by two officers as he walked away from the boxing gym on Osmaston Road at 20:30. Officers' grounds: 'wearing a dark hoodie up, walking quickly, area associated with drug supply'. Alex had his gym bag and a protein shake. Search found nothing. Alex was visibly distressed and rang the home from outside the gym. Anna attended within 15 minutes. Alex's account, the officers' badge numbers and the search receipt were collected on-scene.",
    homeProtocolFollowed: true,
    concordatPrinciplesApplied: [
      "Child treated as a child — not a suspect to be processed",
      "Right to challenge use of police powers explained",
      "Cultural and racial context of stop-and-search disparity acknowledged with Alex",
      "Independent advocacy offered (NYAS) and accepted",
      "Formal complaint route supported by the home",
      "Re-traumatisation watched for over weeks following",
    ],
    appropriateAdultPresent: undefined,
    legalRepPresent: "Solicitor consulted post-incident re complaint — Coram Children's Legal Centre.",
    outcome: "No further action",
    restorativeOpportunity: false,
    restorativeOutcome: undefined,
    childVoice:
      "I was just walking home from boxing. They didn't believe me when I said it was a protein shake. They made me empty my bag on the floor in front of people. I felt like everyone was staring. I'm not doing nothing wrong and I still got stopped. Anna believed me straight away — that mattered.",
    staffObservation:
      "Alex was visibly shaken on collection. The home documented the incident in detail, including officer numbers and the search receipt reference. A formal complaint was submitted to Derbyshire Constabulary's Professional Standards Department by the Registered Manager, with Alex's full involvement and consent. Alex was offered independent advocacy and accepted. Re-traumatisation has been monitored — Alex avoided that route home for two weeks but is now using it again. Boxing remains a positive routine.",
    followUpRequired: true,
    followUpAction:
      "Formal complaint to PSD submitted (ref: PSD/2026/0044). Complaint outcome pending. NYAS advocate Marcus Brown supporting Alex through the process. Key work to continue monitoring for trauma-related avoidance or hyper-vigilance. Recorded as a safeguarding-adjacent concern re profiling.",
    flagsConcerns: [
      "Disproportionality — stop-and-search of Black and racialised young people",
      "Profiling on basis of clothing, area and pace",
      "Watch for trauma response and avoidance behaviours",
    ],
    reviewDate: d(-30),
    recordedBy: "staff_darren",
  },
];

/* ── constants ─────────────────────────────────────────────────────────── */

const CONTACT_TYPES = [
  "Missing-from-care report",
  "Voluntary attendance — interview",
  "Arrest",
  "Victim of crime",
  "Witness — voluntary",
  "Stop and search",
  "Restorative resolution",
  "Welfare check by police",
  "Information sharing only",
  "Other",
] as const;

const TYPE_COLOURS: Record<string, string> = {
  "Missing-from-care report": "bg-sky-100 text-sky-800",
  "Voluntary attendance — interview": "bg-blue-100 text-blue-800",
  "Arrest": "bg-amber-100 text-amber-800",
  "Victim of crime": "bg-rose-100 text-rose-800",
  "Witness — voluntary": "bg-blue-100 text-blue-800",
  "Stop and search": "bg-amber-100 text-amber-800",
  "Restorative resolution": "bg-emerald-100 text-emerald-800",
  "Welfare check by police": "bg-sky-100 text-sky-800",
  "Information sharing only": "bg-slate-100 text-slate-800",
  "Other": "bg-slate-100 text-slate-800",
};

const OUTCOME_COLOURS: Record<string, string> = {
  "No further action": "bg-emerald-100 text-emerald-800",
  "Voluntary interview only": "bg-sky-100 text-sky-800",
  "Restorative justice": "bg-emerald-100 text-emerald-800",
  "Caution": "bg-amber-100 text-amber-800",
  "Charged": "bg-rose-100 text-rose-800",
  "Bail": "bg-amber-100 text-amber-800",
  "Released no charge": "bg-emerald-100 text-emerald-800",
  "Returned to home": "bg-sky-100 text-sky-800",
  "Other": "bg-slate-100 text-slate-800",
};

/* ── helpers ───────────────────────────────────────────────────────────── */

function isThisYTD(iso: string): boolean {
  const dt = new Date(iso);
  const now = new Date();
  return dt.getFullYear() === now.getFullYear() && dt <= now;
}

/* ── component ─────────────────────────────────────────────────────────── */

export default function ChildPoliceContactRecordsPage() {
  const [data] = useState<PoliceRecord[]>(SEED);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "yp" | "type">("date");

  const stats = useMemo(() => {
    const ytd = data.filter((r) => isThisYTD(r.contactDate)).length;
    const restorative = data.filter(
      (r) =>
        r.restorativeOpportunity ||
        r.contactType === "Restorative resolution" ||
        r.outcome === "Restorative justice",
    ).length;
    const missing = data.filter((r) => r.contactType === "Missing-from-care report").length;
    const flags = data.reduce((s, r) => s + r.flagsConcerns.length, 0);
    return { ytd, restorative, missing, flags };
  }, [data]);

  const filtered = useMemo(() => {
    let list = [...data];
    if (filterType !== "all") list = list.filter((r) => r.contactType === filterType);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.reasonContext.toLowerCase().includes(q) ||
          r.outcome.toLowerCase().includes(q) ||
          (r.officersInvolved ?? "").toLowerCase().includes(q) ||
          (r.policeRefNumber ?? "").toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "yp":
          return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "type":
          return a.contactType.localeCompare(b.contactType);
        default:
          return b.contactDate.localeCompare(a.contactDate);
      }
    });
    return list;
  }, [data, filterType, search, sortBy]);

  const exportCols: ExportColumn<PoliceRecord>[] = [
    { header: "Young Person", accessor: (r: PoliceRecord) => getYPName(r.youngPerson) },
    { header: "Contact Date", accessor: (r: PoliceRecord) => r.contactDate },
    { header: "Contact Type", accessor: (r: PoliceRecord) => r.contactType },
    { header: "Reported By", accessor: (r: PoliceRecord) => r.reportedBy },
    { header: "Officers", accessor: (r: PoliceRecord) => r.officersInvolved ?? "" },
    { header: "Police Ref", accessor: (r: PoliceRecord) => r.policeRefNumber ?? "" },
    { header: "Reason / Context", accessor: (r: PoliceRecord) => r.reasonContext },
    { header: "Home Protocol Followed", accessor: (r: PoliceRecord) => (r.homeProtocolFollowed ? "Yes" : "No") },
    { header: "Concordat Principles Applied", accessor: (r: PoliceRecord) => r.concordatPrinciplesApplied.join("; ") },
    { header: "Appropriate Adult", accessor: (r: PoliceRecord) => (r.appropriateAdultPresent ? getStaffName(r.appropriateAdultPresent) : "") },
    { header: "Legal Rep", accessor: (r: PoliceRecord) => r.legalRepPresent ?? "" },
    { header: "Outcome", accessor: (r: PoliceRecord) => r.outcome },
    { header: "Restorative Opportunity", accessor: (r: PoliceRecord) => (r.restorativeOpportunity ? "Yes" : "No") },
    { header: "Restorative Outcome", accessor: (r: PoliceRecord) => r.restorativeOutcome ?? "" },
    { header: "Child Voice", accessor: (r: PoliceRecord) => r.childVoice },
    { header: "Staff Observation", accessor: (r: PoliceRecord) => r.staffObservation },
    { header: "Follow-Up Required", accessor: (r: PoliceRecord) => (r.followUpRequired ? "Yes" : "No") },
    { header: "Follow-Up Action", accessor: (r: PoliceRecord) => r.followUpAction ?? "" },
    { header: "Flags / Concerns", accessor: (r: PoliceRecord) => r.flagsConcerns.join("; ") },
    { header: "Review Date", accessor: (r: PoliceRecord) => r.reviewDate },
    { header: "Recorded By", accessor: (r: PoliceRecord) => getStaffName(r.recordedBy) },
  ];

  return (
    <PageShell
      title="Child Police Contact Records"
      subtitle="Concordat on Children in Care — proportionate response, advocacy, restorative practice"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="police-contact-records" />
          <PrintButton title="Police Contact Records" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: "Contacts YTD", v: stats.ytd, icon: Phone, c: "text-sky-600" },
            { l: "Restorative Resolutions", v: stats.restorative, icon: Shield, c: "text-emerald-600" },
            { l: "Missing-Related", v: stats.missing, icon: FileText, c: "text-blue-600" },
            { l: "Flags / Concerns", v: stats.flags, icon: AlertTriangle, c: "text-amber-600" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border bg-white p-3 text-center">
              <s.icon className={cn("mx-auto h-5 w-5 mb-1", s.c)} />
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search child, context, outcome, ref…"
              className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Contact Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contact Types</SelectItem>
              {CONTACT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "yp" | "type")}
              className="rounded border px-2 py-1.5 text-sm"
            >
              <option value="date">Contact Date</option>
              <option value="yp">Young Person</option>
              <option value="type">Contact Type</option>
            </select>
          </div>
        </div>

        {/* records */}
        {filtered.map((rec) => {
          const isOpen = expanded === rec.id;
          const concordatTotal = rec.concordatPrinciplesApplied.length;
          return (
            <div key={rec.id} className="rounded-lg border bg-white overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : rec.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-sky-50/50 text-left"
              >
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{getYPName(rec.youngPerson)}</h3>
                      <span className="text-xs text-muted-foreground">{rec.contactDate}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", TYPE_COLOURS[rec.contactType])}>
                        {rec.contactType}
                      </span>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", OUTCOME_COLOURS[rec.outcome])}>
                        {rec.outcome}
                      </span>
                      {concordatTotal > 0 && (
                        <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium border border-blue-200">
                          {concordatTotal} Concordat principle{concordatTotal === 1 ? "" : "s"} applied
                        </span>
                      )}
                      {rec.flagsConcerns.length > 0 && (
                        <span className="rounded-full bg-amber-50 text-amber-800 px-2 py-0.5 text-xs font-medium border border-amber-200 inline-flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {rec.flagsConcerns.length} flag{rec.flagsConcerns.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reported by {rec.reportedBy} · Recorded by {getStaffName(rec.recordedBy)}
                      {rec.policeRefNumber ? ` · Ref ${rec.policeRefNumber}` : ""}
                    </p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 shrink-0" /> : <ChevronDown className="h-5 w-5 shrink-0" />}
              </button>

              {isOpen && (
                <div className="border-t p-4 space-y-4 bg-sky-50/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Contact date:</span> {rec.contactDate}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reported by:</span> {rec.reportedBy}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Police ref:</span> {rec.policeRefNumber ?? "—"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Review:</span> {rec.reviewDate}
                    </div>
                  </div>

                  {rec.officersInvolved && (
                    <div className="rounded-lg bg-white border p-3">
                      <h4 className="text-sm font-semibold mb-1 flex items-center gap-1">
                        <Phone className="h-4 w-4 text-sky-600" /> Officers Involved
                      </h4>
                      <p className="text-sm text-muted-foreground">{rec.officersInvolved}</p>
                    </div>
                  )}

                  <div className="rounded-lg bg-white border p-3">
                    <h4 className="text-sm font-semibold mb-1">Reason / Context</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{rec.reasonContext}</p>
                  </div>

                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1">
                      <Shield className="h-4 w-4" /> Concordat Principles Applied
                    </h4>
                    {rec.concordatPrinciplesApplied.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-900">
                        {rec.concordatPrinciplesApplied.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-blue-900/70 italic">None recorded.</p>
                    )}
                    <p className="text-xs text-blue-800/80 mt-2">
                      Home protocol followed: {rec.homeProtocolFollowed ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white border p-3">
                      <h4 className="text-sm font-semibold mb-1">Appropriate Adult</h4>
                      <p className="text-sm text-muted-foreground">
                        {rec.appropriateAdultPresent ? getStaffName(rec.appropriateAdultPresent) : "Not applicable / not present"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white border p-3">
                      <h4 className="text-sm font-semibold mb-1">Legal Representation</h4>
                      <p className="text-sm text-muted-foreground">{rec.legalRepPresent ?? "Not applicable"}</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white border p-3">
                    <h4 className="text-sm font-semibold mb-1">Outcome</h4>
                    <p className="text-sm text-muted-foreground">{rec.outcome}</p>
                  </div>

                  {rec.restorativeOpportunity && (
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                      <h4 className="text-sm font-semibold text-emerald-900 mb-1">Restorative Opportunity</h4>
                      {rec.restorativeOutcome ? (
                        <p className="text-sm text-emerald-900">{rec.restorativeOutcome}</p>
                      ) : (
                        <p className="text-sm text-emerald-900/70 italic">Identified — outcome to be recorded.</p>
                      )}
                    </div>
                  )}

                  <div className="rounded-lg bg-pink-50 border border-pink-200 p-3">
                    <h4 className="text-sm font-semibold text-pink-800 mb-1">Child&apos;s Voice</h4>
                    <p className="text-sm text-pink-900 italic">&ldquo;{rec.childVoice}&rdquo;</p>
                  </div>

                  <div className="rounded-lg bg-slate-50 border p-3">
                    <h4 className="text-sm font-semibold mb-1">Staff Observation</h4>
                    <p className="text-sm text-muted-foreground">{rec.staffObservation}</p>
                  </div>

                  {rec.followUpRequired && (
                    <div className="rounded-lg bg-sky-50 border border-sky-200 p-3">
                      <h4 className="text-sm font-semibold text-sky-900 mb-1">Follow-Up</h4>
                      <p className="text-sm text-sky-900">{rec.followUpAction ?? "Required — action to be agreed."}</p>
                    </div>
                  )}

                  {rec.flagsConcerns.length > 0 && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                      <h4 className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" /> Flags / Concerns
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-amber-900">
                        {rec.flagsConcerns.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* regulatory footer */}
        <div className="rounded-lg border-l-4 border-sky-400 bg-sky-50 p-4 text-sm text-sky-900">
          <strong>Concordat on Children in Care (NPCC + ADCS, 2018)</strong> — Children in care must not be criminalised
          for behaviour that would not result in police involvement in a family home. The home applies the Concordat,
          PACE Codes of Practice (Codes C and G), Children Act 1989, Restorative Justice Council standards, Child First
          principles, Children&apos;s Homes Regs Quality Standard 9 (Protection of Children) and UNCRC Articles 12, 37 and 40.
          Every police contact is logged to evidence proportionate response, appropriate adult support, advocacy and
          restorative practice.
        </div>
      </div>
    </PageShell>
  );
}

"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Flower,
  Calendar,
  Heart,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FuneralRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  deceasedName: string;
  relationshipToChild: string;
  childWasInformedBy: string;
  dateOfDeath: string;
  funeralDate: string;
  funeralType:
    | "Burial"
    | "Cremation"
    | "Memorial service"
    | "Wake/celebration of life"
    | "Religious ceremony"
    | "Direct cremation (no service)"
    | "Other";
  faithTradition?: string;
  attendanceDecision: "Attended" | "Did not attend (chose not to)" | "Did not attend (not invited)" | "Attended remotely" | "Pending";
  decisionMaker: "Child-led" | "Birth family decided" | "Social worker decided" | "Court direction" | "Joint decision";
  preFuneralPreparation: string[];
  whoAttendedWithChild: string[];
  travelArrangements?: string;
  socialWorkerInformed: boolean;
  birthFamilyContact?: string;
  ritualsObserved: string[];
  childRoleAtFuneral?: string;
  postFuneralSupport: string[];
  childVoice: string;
  staffObservation: string;
  followUpDate: string;
  flagsConcerns: string[];
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const records: FuneralRecord[] = [
  {
    id: "fun_001",
    youngPerson: "yp_casey",
    recordedDate: d(-90),
    deceasedName: "Tom (paternal grandfather)",
    relationshipToChild: "Grandad — primary loving figure pre-care, weekly contact",
    childWasInformedBy: "Anna (key worker), with social worker present, in Casey's room with Eeyore",
    dateOfDeath: d(-100),
    funeralDate: d(-92),
    funeralType: "Cremation",
    faithTradition: "Church of England (light)",
    attendanceDecision: "Attended",
    decisionMaker: "Child-led",
    preFuneralPreparation: [
      "3 sessions with Anna using social story 'Saying goodbye to someone we love'",
      "Visited the chapel with Anna 2 days before — quiet, no ceremony, just sitting",
      "Discussed what would happen, who would be there, what people would wear",
      "Casey chose her outfit — grandad's favourite cardigan plus blue dress he liked",
      "Wrote a letter to grandad to put in coffin (decision made with social worker — approved)",
      "Practised what to say if asked questions",
      "Identified safe person at funeral (Anna) to find if overwhelmed",
    ],
    whoAttendedWithChild: ["Anna (key worker)", "Casey's social worker", "Casey's mum (supervised)", "Aunt Sarah"],
    travelArrangements: "Home transport with Anna driving, child seat, plans to leave any time Casey wished",
    socialWorkerInformed: true,
    birthFamilyContact: "Mum present (Casey's choice — she had said she wanted mum there if mum was sober)",
    ritualsObserved: [
      "Carrying flowers Casey had chosen (yellow tulips, grandad's favourite)",
      "Reading by aunt — Casey held Anna's hand",
      "Hymn 'All Things Bright and Beautiful' (grandad's request)",
      "Casey placed her letter on the coffin during committal",
    ],
    childRoleAtFuneral: "Carried flowers and placed letter — chose this herself, supported but not led",
    postFuneralSupport: [
      "Quiet evening — Casey's choice not to do anything special",
      "Memory box started the next week (photo, cardigan, peppermint tin)",
      "Anna offered grief sessions — Casey took up after 2 weeks",
      "Bereavement support recorded in bereavement-loss-support",
      "Anniversary planned for one year — visit grandad's tree at the crematorium",
    ],
    childVoice:
      "I'm glad I went. I was scared but Anna was there. I gave him my letter. Mum didn't speak to me but it was OK. I want to go back when the tree he chose has flowers.",
    staffObservation:
      "Casey was extraordinarily brave. Composed during the service, tearful during the committal — held Anna's hand throughout. Chose to leave during the wake (2 hours) when noise increased, which was right for her. Sleep disrupted for 2 weeks after. Gradual return. Memory work taken up willingly. The decision to attend was hers and the right one.",
    followUpDate: d(280),
    flagsConcerns: [],
    keyWorker: "staff_anna",
  },
  {
    id: "fun_002",
    youngPerson: "yp_alex",
    recordedDate: d(-30),
    deceasedName: "Auntie Lucy (maternal great aunt)",
    relationshipToChild:
      "Maternal great-aunt — distant but had been kind during difficult time when Alex came out",
    childWasInformedBy: "Mum on contact call (Alex distressed mum told them on the phone without warning)",
    dateOfDeath: d(-40),
    funeralDate: d(-32),
    funeralType: "Burial",
    faithTradition: "Roman Catholic",
    attendanceDecision: "Did not attend (chose not to)",
    decisionMaker: "Child-led",
    preFuneralPreparation: [
      "1:1 with Anna — explored options to attend, attend remotely, or not",
      "Discussed what would be at the funeral (church, family Alex's parents not OK with their identity)",
      "Risk-assessed: extended family who may not respect Alex's pronouns",
      "Discussed sending flowers and a card instead",
      "Alex chose flowers + card with poem they wrote",
      "Plan for the day of the funeral — quiet, gym session, evening 1:1",
    ],
    whoAttendedWithChild: [],
    socialWorkerInformed: true,
    birthFamilyContact: "Mum invited Alex but accepted Alex's decision",
    ritualsObserved: [
      "Card and poem sent in advance",
      "Yellow chrysanthemums (Auntie Lucy's favourite)",
      "Alex lit a candle at home at the time of the service",
      "Listened to Auntie Lucy's favourite song (Vera Lynn) at home",
    ],
    childRoleAtFuneral: "Remote ritual at home",
    postFuneralSupport: [
      "Anna present for candle lighting",
      "Quiet check-in over evening meal",
      "Alex chose to talk it over the next day, not on the day",
      "Letter to mum saying thank you for understanding (Alex sent unprompted)",
      "Bereavement work continued",
    ],
    childVoice:
      "If I went I'd have spent the day worrying about my dad and what they'd say. Auntie Lucy wouldn't want that. I lit a candle. I read my poem. That was my goodbye.",
    staffObservation:
      "Alex's decision was thoughtful and appropriate. The remote ritual worked — the candle lighting was significant, dignified. Sleep affected for 1 week. Has returned to baseline. Cards from extended family (one positive) shared with Alex post-funeral. Mum's acceptance of Alex's choice was a relational win.",
    followUpDate: d(60),
    flagsConcerns: ["Watch for delayed grief — Alex didn't have a closing ritual at the graveside"],
    keyWorker: "staff_anna",
  },
  {
    id: "fun_003",
    youngPerson: "yp_jordan",
    recordedDate: d(-200),
    deceasedName: "Uncle Tariq (paternal uncle, Pakistan)",
    relationshipToChild: "Paternal uncle — known mostly via WhatsApp video calls, twice in person",
    childWasInformedBy: "Mum on contact call, with mosque imam present",
    dateOfDeath: d(-205),
    funeralDate: d(-204),
    funeralType: "Religious ceremony",
    faithTradition: "Islam (Janazah)",
    attendanceDecision: "Attended remotely",
    decisionMaker: "Child-led",
    preFuneralPreparation: [
      "Imam Yusuf at local mosque guided Jordan through Islamic mourning practice",
      "Janazah prayer attended at local mosque (in absentia)",
      "Discussed 3-day mourning period and 40-day remembrance",
      "Travel to Pakistan not possible at short notice",
      "Family WhatsApp group set up with Jordan's mum to share photos and updates",
    ],
    whoAttendedWithChild: ["Imam Yusuf", "Anna at mosque (sat at back respectfully)"],
    socialWorkerInformed: true,
    birthFamilyContact: "Mum and brother in Pakistan — daily WhatsApp through mourning period",
    ritualsObserved: [
      "Janazah prayer at local mosque",
      "Recitation of Quran",
      "Dua for uncle",
      "3-day mourning observed at home",
      "40-day remembrance planned (food shared with mosque community on day 40)",
      "Charity given in uncle's name (£20 to mosque)",
    ],
    childRoleAtFuneral: "Attended Janazah at local mosque, prayed, gave charity in uncle's name",
    postFuneralSupport: [
      "Imam Yusuf weekly check-in for 6 weeks",
      "Anna supported 40-day food preparation (Jordan helped)",
      "Mum sent photo of grave for Jordan to keep",
      "Plan to visit grave on first family trip to Pakistan",
    ],
    childVoice:
      "I couldn't go to the burial but I could pray. Imam Yusuf said the prayer here works the same as there. I gave charity. I'll visit when I can.",
    staffObservation:
      "Faith framework supported Jordan strongly. Mosque was crucial. Mum's inclusion in process important. Jordan's resilience and identity-rooted grief work was a credit to him and to the mosque community.",
    followUpDate: d(-160),
    flagsConcerns: [],
    keyWorker: "staff_anna",
  },
];

const exportCols: ExportColumn<FuneralRecord>[] = [
  { header: "Young Person", accessor: (r: FuneralRecord) => getYPName(r.youngPerson) },
  { header: "Recorded", accessor: (r: FuneralRecord) => r.recordedDate },
  { header: "Deceased", accessor: (r: FuneralRecord) => r.deceasedName },
  { header: "Relationship", accessor: (r: FuneralRecord) => r.relationshipToChild },
  { header: "Date of Death", accessor: (r: FuneralRecord) => r.dateOfDeath },
  { header: "Funeral Date", accessor: (r: FuneralRecord) => r.funeralDate },
  { header: "Funeral Type", accessor: (r: FuneralRecord) => r.funeralType },
  { header: "Faith Tradition", accessor: (r: FuneralRecord) => r.faithTradition ?? "—" },
  { header: "Attendance", accessor: (r: FuneralRecord) => r.attendanceDecision },
  { header: "Decision Maker", accessor: (r: FuneralRecord) => r.decisionMaker },
  { header: "Attended With", accessor: (r: FuneralRecord) => r.whoAttendedWithChild.join("; ") },
  { header: "SW Informed", accessor: (r: FuneralRecord) => (r.socialWorkerInformed ? "Yes" : "No") },
  { header: "Child Voice", accessor: (r: FuneralRecord) => r.childVoice },
  { header: "Follow-up", accessor: (r: FuneralRecord) => r.followUpDate },
  { header: "Key Worker", accessor: (r: FuneralRecord) => getStaffName(r.keyWorker) },
];

const decisionColour: Record<FuneralRecord["attendanceDecision"], string> = {
  Attended: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Did not attend (chose not to)": "bg-blue-100 text-blue-800 border-blue-200",
  "Did not attend (not invited)": "bg-slate-100 text-slate-800 border-slate-200",
  "Attended remotely": "bg-purple-100 text-purple-800 border-purple-200",
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function FuneralAttendanceRecordsPage() {
  const [search, setSearch] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "funeral">("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = records.filter((rec) => {
      const matchesSearch =
        !search ||
        getYPName(rec.youngPerson).toLowerCase().includes(search.toLowerCase()) ||
        rec.deceasedName.toLowerCase().includes(search.toLowerCase()) ||
        rec.relationshipToChild.toLowerCase().includes(search.toLowerCase());
      const matchesDecision = decisionFilter === "all" || rec.attendanceDecision === decisionFilter;
      return matchesSearch && matchesDecision;
    });
    r = [...r].sort((a, b) => {
      if (sortBy === "name") return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
      if (sortBy === "funeral") return b.funeralDate.localeCompare(a.funeralDate);
      return b.recordedDate.localeCompare(a.recordedDate);
    });
    return r;
  }, [search, decisionFilter, sortBy]);

  const stats = useMemo(() => {
    const attended = records.filter((r) => r.attendanceDecision === "Attended" || r.attendanceDecision === "Attended remotely").length;
    const childLed = records.filter((r) => r.decisionMaker === "Child-led").length;
    const flagged = records.filter((r) => r.flagsConcerns.length > 0).length;
    const followUpsDue = records.filter((r) => r.followUpDate <= d(60) && r.followUpDate >= d(-7)).length;
    return { attended, childLed, flagged, followUpsDue };
  }, []);

  return (
    <PageShell
      title="Funeral Attendance Records"
      subtitle="Sensitive record of children's involvement in funerals — child-led decision-making, preparation, ritual, faith tradition, post-funeral support. Honours dignity, grief, and the right to say goodbye in the way that's right for each child."
      actions={
        <div className="flex gap-2">
          <ExportButton data={filtered} columns={exportCols} filename="funeral-attendance-records" />
          <PrintButton title="Funeral Attendance Records" />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Flower className="h-4 w-4" />
            <span>Funerals attended</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.attended}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Heart className="h-4 w-4" />
            <span>Child-led decisions</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.childLed}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Users className="h-4 w-4" />
            <span>Flagged for follow-up</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.flagged}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Calendar className="h-4 w-4" />
            <span>Follow-ups due (60d)</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.followUpsDue}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search young person, deceased, relationship..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select value={decisionFilter} onValueChange={setDecisionFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Attendance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All decisions</SelectItem>
            <SelectItem value="Attended">Attended</SelectItem>
            <SelectItem value="Attended remotely">Attended remotely</SelectItem>
            <SelectItem value="Did not attend (chose not to)">Chose not to</SelectItem>
            <SelectItem value="Did not attend (not invited)">Not invited</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-48">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most recent recorded</SelectItem>
            <SelectItem value="funeral">Funeral date</SelectItem>
            <SelectItem value="name">Young person A→Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isOpen = expandedId === r.id;
          return (
            <div key={r.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : r.id)}
                className="w-full p-4 flex items-start justify-between gap-3 hover:bg-slate-50 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-slate-900">{getYPName(r.youngPerson)}</span>
                    <span className="text-slate-700">— {r.deceasedName}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", decisionColour[r.attendanceDecision])}>
                      {r.attendanceDecision}
                    </span>
                    {r.decisionMaker === "Child-led" ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-pink-100 text-pink-800 border-pink-200">
                        Child-led
                      </span>
                    ) : null}
                    {r.faithTradition ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-200">
                        {r.faithTradition}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-slate-600">
                    {r.relationshipToChild} · Funeral {r.funeralDate} · {getStaffName(r.keyWorker)}
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </button>
              {isOpen ? (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-md border border-rose-200 bg-rose-50 p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-rose-700 uppercase mb-2">Child Voice</div>
                      <p className="text-sm text-rose-900 italic">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Staff Observation</div>
                      <p className="text-sm text-slate-700">{r.staffObservation}</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Pre-funeral preparation</div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.preFuneralPreparation.map((t, i) => (
                          <li key={i} className="flex gap-2"><span className="text-slate-400">·</span><span>{t}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Rituals observed</div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.ritualsObserved.map((t, i) => (
                          <li key={i} className="flex gap-2"><span className="text-emerald-500">·</span><span>{t}</span></li>
                        ))}
                      </ul>
                    </div>
                    {r.whoAttendedWithChild.length ? (
                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Who attended with child</div>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {r.whoAttendedWithChild.map((t, i) => (
                            <li key={i} className="flex gap-2"><span className="text-slate-400">·</span><span>{t}</span></li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                      <div className="text-xs font-semibold text-blue-800 uppercase mb-2">Post-funeral support</div>
                      <ul className="text-sm text-blue-900 space-y-1">
                        {r.postFuneralSupport.map((t, i) => (
                          <li key={i} className="flex gap-2"><span>·</span><span>{t}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Context</div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                        <div><span className="text-slate-500">Informed by:</span> {r.childWasInformedBy}</div>
                        <div><span className="text-slate-500">Decision-maker:</span> {r.decisionMaker}</div>
                        <div><span className="text-slate-500">Date of death:</span> {r.dateOfDeath}</div>
                        <div><span className="text-slate-500">Funeral type:</span> {r.funeralType}</div>
                        {r.travelArrangements ? (
                          <div className="col-span-2"><span className="text-slate-500">Travel:</span> {r.travelArrangements}</div>
                        ) : null}
                        {r.childRoleAtFuneral ? (
                          <div className="col-span-2"><span className="text-slate-500">Child&rsquo;s role:</span> {r.childRoleAtFuneral}</div>
                        ) : null}
                        {r.birthFamilyContact ? (
                          <div className="col-span-2"><span className="text-slate-500">Birth family:</span> {r.birthFamilyContact}</div>
                        ) : null}
                        <div><span className="text-slate-500">SW informed:</span> {r.socialWorkerInformed ? "Yes" : "No"}</div>
                        <div><span className="text-slate-500">Follow-up:</span> {r.followUpDate}</div>
                      </div>
                    </div>
                    {r.flagsConcerns.length ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 lg:col-span-2">
                        <div className="text-xs font-semibold text-amber-800 uppercase mb-2">Flags / concerns</div>
                        <ul className="text-sm text-amber-900 space-y-1">
                          {r.flagsConcerns.map((f, i) => (
                            <li key={i} className="flex gap-2"><span>!</span><span>{f}</span></li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
        <div className="font-semibold mb-1">Regulatory framework</div>
        <p>
          A child&rsquo;s right to say goodbye is a right, not a permission. Decisions about funeral attendance are
          child-led and supported, not imposed. Practice is grounded in Quality Standards 6 (Enjoyment & Achievement)
          and 7 (Positive Relationships), Working Together 2023, UNCRC Articles 12 (voice), 14 (freedom of religion)
          and 30 (cultural identity), and NICE NG196 bereavement guidance. Faith tradition is observed where the child
          wishes. Risks of attendance (unsafe family contact, identity disrespect, safeguarding) are weighed honestly
          with the child. Where the child cannot or chooses not to attend, alternative ritual is supported.
          Bereavement support continues afterwards in the bereavement-loss-support record.
        </p>
      </div>
    </PageShell>
  );
}

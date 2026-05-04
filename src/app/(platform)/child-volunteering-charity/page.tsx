"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Heart,
  Users,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Award,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VolunteerRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  activity: string;
  category:
    | "Charity fundraising"
    | "Community volunteering"
    | "Mosque/temple/church"
    | "Sport — coaching/refereeing"
    | "Animal welfare"
    | "Environmental"
    | "Befriending/mentoring"
    | "Youth advocacy"
    | "School / peer support"
    | "Other";
  organisation?: string;
  startDate: string;
  ongoing: boolean;
  endDate?: string;
  hoursThisMonth: number;
  hoursTotal: number;
  childInitiated: boolean;
  motivationStated: string;
  skillsBuilt: string[];
  fundsRaised?: number;
  beneficiariesReached?: string;
  recognitionReceived: string[];
  riskAssessmentDone: boolean;
  safeguardingChecked: boolean;
  childVoice: string;
  staffObservation: string;
  cvAddedTo: boolean;
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const records: VolunteerRecord[] = [
  {
    id: "vol_001",
    youngPerson: "yp_jordan",
    recordedDate: d(-7),
    activity: "Football coaching assistant — under-9s team",
    category: "Sport — coaching/refereeing",
    organisation: "Local Junior Football Club (FA-affiliated)",
    startDate: d(-180),
    ongoing: true,
    hoursThisMonth: 12,
    hoursTotal: 64,
    childInitiated: true,
    motivationStated:
      "I had a coach who believed in me — I want to do that for younger kids. And it pays now too which is nice.",
    skillsBuilt: [
      "Leadership",
      "Communication with children + parents",
      "FA Level 1 coaching qualification (working towards)",
      "Time management",
      "Safeguarding (FA Safeguarding Children certificate completed)",
      "Conflict de-escalation",
    ],
    beneficiariesReached: "~22 young players each session",
    recognitionReceived: [
      "Coach of the Month — Junior Section (March)",
      "Letter of recommendation from head coach",
      "Featured in club newsletter (with consent)",
    ],
    riskAssessmentDone: true,
    safeguardingChecked: true,
    childVoice:
      "These kids look up to me. One of them, Mo, lives with his nan — single carer family. I told him I was in care too and now we joke about it. Not sad. Just real.",
    staffObservation:
      "Jordan has built genuine leadership identity through this role. The transition from coaching as volunteer to part-paid role has been handled well. Coach Mike (chosen-family) is a brilliant mentor. FA Level 1 attainment will be a tangible achievement.",
    cvAddedTo: true,
    reviewDate: d(60),
    keyWorker: "staff_anna",
  },
  {
    id: "vol_002",
    youngPerson: "yp_jordan",
    recordedDate: d(-30),
    activity: "Mosque youth committee — event volunteering",
    category: "Mosque/temple/church",
    organisation: "Local mosque",
    startDate: d(-365),
    ongoing: true,
    hoursThisMonth: 6,
    hoursTotal: 48,
    childInitiated: true,
    motivationStated: "Mosque is family for me. Helping at events is just what you do — give back.",
    skillsBuilt: [
      "Event organisation",
      "Working alongside community elders respectfully",
      "Cultural-religious literacy",
      "Hospitality",
    ],
    beneficiariesReached: "Mosque community ~200 attendees at Eid event",
    recognitionReceived: ["Imam Yusuf wrote a personal note for Jordan's college portfolio"],
    riskAssessmentDone: true,
    safeguardingChecked: true,
    childVoice: "It's not really volunteering, it's just family stuff.",
    staffObservation:
      "Jordan's casual framing of mosque service belies its identity-anchoring effect. This is faith-rooted civic participation. Should be valued formally for college applications.",
    cvAddedTo: true,
    reviewDate: d(120),
    keyWorker: "staff_anna",
  },
  {
    id: "vol_003",
    youngPerson: "yp_alex",
    recordedDate: d(-14),
    activity: "Proud Trust youth advocacy — peer support volunteer",
    category: "Youth advocacy",
    organisation: "The Proud Trust",
    startDate: d(-90),
    ongoing: true,
    hoursThisMonth: 4,
    hoursTotal: 14,
    childInitiated: true,
    motivationStated:
      "When I came out, I had no one who understood. I want to be that person for the next kid.",
    skillsBuilt: [
      "Active listening",
      "Group facilitation (co-facilitated with adult worker)",
      "LGBTQ+ rights literacy",
      "Boundaries and self-care",
    ],
    beneficiariesReached: "~12 young people in fortnightly peer group",
    recognitionReceived: [
      "Invited to contribute to Children's Commissioner LGBTQ+ care leavers consultation (testimonial)",
    ],
    riskAssessmentDone: true,
    safeguardingChecked: true,
    childVoice:
      "Last week a kid told me they're trans and not out. I just listened. I didn't fix it. They thanked me. That meant a lot.",
    staffObservation:
      "Alex is using lived experience generatively. Anna does post-session debriefs to watch for vicarious trauma. Self-care plan in place. Transformative for Alex's identity.",
    cvAddedTo: true,
    reviewDate: d(60),
    keyWorker: "staff_anna",
  },
  {
    id: "vol_004",
    youngPerson: "yp_alex",
    recordedDate: d(-60),
    activity: "Charity sparring night — fundraised for boxing club youth fund",
    category: "Charity fundraising",
    organisation: "Local boxing club",
    startDate: d(-90),
    ongoing: false,
    endDate: d(-60),
    hoursThisMonth: 0,
    hoursTotal: 18,
    childInitiated: true,
    motivationStated: "The club gave me free training when I started. I wanted to give back.",
    skillsBuilt: [
      "Event organising",
      "Sponsorship asks (local businesses)",
      "Public speaking — said a few words at the event",
      "Promotion via social media (with safeguarding controls)",
    ],
    fundsRaised: 870,
    beneficiariesReached: "Boxing club youth fund — ~30 future young people",
    recognitionReceived: ["Trophy from club", "Photo in local paper (face cropped at Alex's request)"],
    riskAssessmentDone: true,
    safeguardingChecked: true,
    childVoice: "Eight hundred and seventy quid. I'm not boasting but I am.",
    staffObservation: "A landmark for Alex's confidence and visibility on Alex's terms.",
    cvAddedTo: true,
    reviewDate: d(180),
    keyWorker: "staff_anna",
  },
  {
    id: "vol_005",
    youngPerson: "yp_casey",
    recordedDate: d(-21),
    activity: "Animal shelter weekend visiting (dog walking + grooming)",
    category: "Animal welfare",
    organisation: "Local RSPCA branch",
    startDate: d(-60),
    ongoing: true,
    hoursThisMonth: 6,
    hoursTotal: 18,
    childInitiated: true,
    motivationStated:
      "I want to be a vet. The dogs at the shelter need calm people. I'm calm with animals.",
    skillsBuilt: [
      "Animal handling — safe approach to nervous dogs",
      "Grooming basics",
      "Following safety protocols",
      "Working alongside adult volunteers",
    ],
    beneficiariesReached: "5-6 shelter dogs each visit",
    recognitionReceived: [
      "Kennel manager Sarah wrote 'Casey is a natural with anxious dogs'",
      "Featured in shelter newsletter — Casey's choice (she said yes carefully)",
    ],
    riskAssessmentDone: true,
    safeguardingChecked: true,
    childVoice:
      "There was a Staffie called Trixie and she was so scared she wouldn't come out. I sat outside her kennel for ages and she came out and put her head on my knee. I cried a bit. Sarah said it was OK to cry.",
    staffObservation:
      "Casey's affinity with anxious dogs is striking. The shelter has been excellent at safeguarding and respecting Casey's pace. Anna attends first 30 mins each shift then leaves Casey to volunteer independently. Identity-affirming for vet aspiration.",
    cvAddedTo: false,
    reviewDate: d(30),
    keyWorker: "staff_anna",
  },
];

const exportCols: ExportColumn<VolunteerRecord>[] = [
  { header: "Young Person", accessor: (r: VolunteerRecord) => getYPName(r.youngPerson) },
  { header: "Activity", accessor: (r: VolunteerRecord) => r.activity },
  { header: "Category", accessor: (r: VolunteerRecord) => r.category },
  { header: "Organisation", accessor: (r: VolunteerRecord) => r.organisation ?? "—" },
  { header: "Start", accessor: (r: VolunteerRecord) => r.startDate },
  { header: "Ongoing", accessor: (r: VolunteerRecord) => (r.ongoing ? "Yes" : "No") },
  { header: "Hours This Month", accessor: (r: VolunteerRecord) => `${r.hoursThisMonth}` },
  { header: "Hours Total", accessor: (r: VolunteerRecord) => `${r.hoursTotal}` },
  { header: "Child Initiated", accessor: (r: VolunteerRecord) => (r.childInitiated ? "Yes" : "No") },
  { header: "Skills Built", accessor: (r: VolunteerRecord) => r.skillsBuilt.join("; ") },
  { header: "Funds Raised", accessor: (r: VolunteerRecord) => (r.fundsRaised ? `£${r.fundsRaised.toFixed(2)}` : "—") },
  { header: "Recognition", accessor: (r: VolunteerRecord) => r.recognitionReceived.join("; ") },
  { header: "Risk Assessed", accessor: (r: VolunteerRecord) => (r.riskAssessmentDone ? "Yes" : "No") },
  { header: "Safeguarding Checked", accessor: (r: VolunteerRecord) => (r.safeguardingChecked ? "Yes" : "No") },
  { header: "On CV", accessor: (r: VolunteerRecord) => (r.cvAddedTo ? "Yes" : "No") },
  { header: "Child Voice", accessor: (r: VolunteerRecord) => r.childVoice },
  { header: "Review", accessor: (r: VolunteerRecord) => r.reviewDate },
  { header: "Key Worker", accessor: (r: VolunteerRecord) => getStaffName(r.keyWorker) },
];

const categoryColour: Record<VolunteerRecord["category"], string> = {
  "Charity fundraising": "bg-pink-100 text-pink-800 border-pink-200",
  "Community volunteering": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Mosque/temple/church": "bg-amber-100 text-amber-800 border-amber-200",
  "Sport — coaching/refereeing": "bg-blue-100 text-blue-800 border-blue-200",
  "Animal welfare": "bg-teal-100 text-teal-800 border-teal-200",
  Environmental: "bg-green-100 text-green-800 border-green-200",
  "Befriending/mentoring": "bg-violet-100 text-violet-800 border-violet-200",
  "Youth advocacy": "bg-purple-100 text-purple-800 border-purple-200",
  "School / peer support": "bg-sky-100 text-sky-800 border-sky-200",
  Other: "bg-slate-100 text-slate-800 border-slate-200",
};

export default function ChildVolunteeringCharityPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "hours" | "category">("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = records.filter((rec) => {
      const matchesSearch =
        !search ||
        getYPName(rec.youngPerson).toLowerCase().includes(search.toLowerCase()) ||
        rec.activity.toLowerCase().includes(search.toLowerCase()) ||
        (rec.organisation ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === "all" || rec.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
    r = [...r].sort((a, b) => {
      if (sortBy === "name") return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
      if (sortBy === "hours") return b.hoursTotal - a.hoursTotal;
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return b.recordedDate.localeCompare(a.recordedDate);
    });
    return r;
  }, [search, categoryFilter, sortBy]);

  const stats = useMemo(() => {
    const ongoing = records.filter((r) => r.ongoing).length;
    const totalHours = records.reduce((acc, r) => acc + r.hoursTotal, 0);
    const totalRaised = records.reduce((acc, r) => acc + (r.fundsRaised ?? 0), 0);
    const childInitiated = records.filter((r) => r.childInitiated).length;
    return { ongoing, totalHours, totalRaised, childInitiated };
  }, []);

  return (
    <PageShell
      title="Volunteering & Charity Activity"
      subtitle="Per-child volunteering and community contribution — sport coaching, faith community, animal welfare, peer advocacy, charity fundraising. Children in care give as much as they receive — this evidences it. Builds CV, identity, and citizenship."
      actions={
        <div className="flex gap-2">
          <ExportButton data={filtered} columns={exportCols} filename="child-volunteering-charity" />
          <PrintButton title="Volunteering & Charity Activity" />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Heart className="h-4 w-4" />
            <span>Ongoing roles</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.ongoing}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Calendar className="h-4 w-4" />
            <span>Total hours</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.totalHours}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Award className="h-4 w-4" />
            <span>Funds raised</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">£{stats.totalRaised.toFixed(0)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Child-initiated</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.childInitiated}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search young person, activity, organisation..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Charity fundraising">Charity fundraising</SelectItem>
            <SelectItem value="Community volunteering">Community volunteering</SelectItem>
            <SelectItem value="Mosque/temple/church">Faith community</SelectItem>
            <SelectItem value="Sport — coaching/refereeing">Sport coaching</SelectItem>
            <SelectItem value="Animal welfare">Animal welfare</SelectItem>
            <SelectItem value="Environmental">Environmental</SelectItem>
            <SelectItem value="Befriending/mentoring">Befriending</SelectItem>
            <SelectItem value="Youth advocacy">Youth advocacy</SelectItem>
            <SelectItem value="School / peer support">School / peer support</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-48">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most recent</SelectItem>
            <SelectItem value="name">Young person A→Z</SelectItem>
            <SelectItem value="hours">Total hours</SelectItem>
            <SelectItem value="category">Category</SelectItem>
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
                    <span className="text-slate-700">{r.activity}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", categoryColour[r.category])}>
                      {r.category}
                    </span>
                    {r.ongoing ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200">
                        Ongoing
                      </span>
                    ) : null}
                    {r.fundsRaised ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-pink-100 text-pink-800 border-pink-200">
                        £{r.fundsRaised.toFixed(0)} raised
                      </span>
                    ) : null}
                    {r.childInitiated ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-100 text-purple-800 border-purple-200">
                        Child-initiated
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-slate-600">
                    {r.organisation ?? "—"} · {r.hoursTotal} hours total · {getStaffName(r.keyWorker)}
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </button>
              {isOpen ? (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-md border border-pink-200 bg-pink-50 p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-pink-700 uppercase mb-2">Why I do this</div>
                      <p className="text-sm text-pink-900 italic">&ldquo;{r.motivationStated}&rdquo;</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Child Voice</div>
                      <p className="text-sm text-slate-700 italic">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Staff Observation</div>
                      <p className="text-sm text-slate-700">{r.staffObservation}</p>
                    </div>
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                      <div className="text-xs font-semibold text-emerald-700 uppercase mb-2">Skills built</div>
                      <ul className="text-sm text-emerald-900 space-y-1">
                        {r.skillsBuilt.map((s, i) => (
                          <li key={i} className="flex gap-2"><span>+</span><span>{s}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                      <div className="text-xs font-semibold text-amber-800 uppercase mb-2">Recognition received</div>
                      <ul className="text-sm text-amber-900 space-y-1">
                        {r.recognitionReceived.map((s, i) => (
                          <li key={i} className="flex gap-2"><span>★</span><span>{s}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Context</div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                        <div><span className="text-slate-500">Started:</span> {r.startDate}</div>
                        <div><span className="text-slate-500">Hours this month:</span> {r.hoursThisMonth}</div>
                        <div><span className="text-slate-500">Hours total:</span> {r.hoursTotal}</div>
                        <div><span className="text-slate-500">Status:</span> {r.ongoing ? "Ongoing" : `Ended ${r.endDate ?? ""}`}</div>
                        {r.beneficiariesReached ? (
                          <div className="col-span-2"><span className="text-slate-500">Beneficiaries:</span> {r.beneficiariesReached}</div>
                        ) : null}
                        <div><span className="text-slate-500">Risk assessed:</span> {r.riskAssessmentDone ? "Yes" : "No"}</div>
                        <div><span className="text-slate-500">Safeguarding checked:</span> {r.safeguardingChecked ? "Yes" : "No"}</div>
                        <div><span className="text-slate-500">CV added to:</span> {r.cvAddedTo ? "Yes" : "Not yet"}</div>
                        <div><span className="text-slate-500">Review:</span> {r.reviewDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-pink-200 bg-pink-50 p-4 text-sm text-pink-900">
        <div className="font-semibold mb-1">Regulatory framework</div>
        <p>
          Children in care give as much as they receive. Practice is grounded in Quality Standards 5 (Education),
          6 (Enjoyment & Achievement) and 7 (Positive Relationships), the Pathway Plan duty for over-16s,
          UNCRC Articles 12 (voice), 13 (expression), 15 (freedom of association), and 31 (rest, play, leisure).
          Volunteering activities are risk-assessed, the host organisation safeguarding-checked, and the child&rsquo;s
          consent and pace are central. Recognition is logged formally for college / job applications.
        </p>
      </div>
    </PageShell>
  );
}

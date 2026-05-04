"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  GraduationCap,
  CheckCircle,
  Clock,
  BookOpen,
  Star,
  Heart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HomeworkSession {
  id: string;
  youngPerson: string;
  date: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  supportingStaff: string;
  externalTutor: string;
  setBySchool: string;
  childInitiation: "Self-started" | "Reminded" | "Resisted then engaged" | "Refused (logged)";
  workCompleted: boolean;
  qualityOfWork: "Strong effort" | "Adequate" | "Hurried" | "Stuck — needed more help";
  childMoodDuring: "Engaged" | "Frustrated but persisted" | "Distracted" | "Overwhelmed";
  challengesFaced: string[];
  strategiesUsed: string[];
  childUnderstanding: string;
  parentalLikeSupport: string;
  feedbackToSchool: string;
  homeworkSubmittedToSchool: boolean;
  pepGoalProgress: string;
  recordedBy: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: HomeworkSession[] = [
  {
    id: "hw-001",
    youngPerson: "yp_alex",
    date: d(-1),
    subject: "Maths",
    topic: "Algebra basics",
    durationMinutes: 35,
    supportingStaff: "staff_edward",
    externalTutor: "",
    setBySchool: "Year 9 Maths — homework due Wednesday",
    childInitiation: "Reminded",
    workCompleted: true,
    qualityOfWork: "Strong effort",
    childMoodDuring: "Engaged",
    challengesFaced: [
      "ADHD focus drift after 20 mins — break taken",
      "Algebra concepts initially confusing — broke into steps",
    ],
    strategiesUsed: [
      "Pomodoro 20min/5min break",
      "Step-by-step worked example with Edward",
      "Praise on effort, not outcome",
    ],
    childUnderstanding: "Good. Alex got it after worked example. Wanted to try last 3 questions independently.",
    parentalLikeSupport: "Edward stayed nearby but didn't hover. Snack provided mid-break.",
    feedbackToSchool: "Engaged well; some support needed; should be praised for effort.",
    homeworkSubmittedToSchool: true,
    pepGoalProgress: "Maths confidence target — small step forward",
    recordedBy: "staff_edward",
  },
  {
    id: "hw-002",
    youngPerson: "yp_jordan",
    date: d(-2),
    subject: "English",
    topic: "Persuasive writing — letter draft",
    durationMinutes: 45,
    supportingStaff: "staff_chervelle",
    externalTutor: "",
    setBySchool: "Year 9 English — letter to MP about a chosen topic",
    childInitiation: "Self-started",
    workCompleted: true,
    qualityOfWork: "Strong effort",
    childMoodDuring: "Engaged",
    challengesFaced: [
      "Choosing topic — Jordan landed on 'children in care voice in policy'",
    ],
    strategiesUsed: [
      "Talking through ideas first",
      "Drafted by hand then typed",
      "Chervelle read draft and reflected back what was strong",
    ],
    childUnderstanding: "Excellent. Jordan's letter is genuinely powerful.",
    parentalLikeSupport: "Chervelle excited about the topic; engaged genuinely; offered to help post.",
    feedbackToSchool: "Outstanding work; reflects Jordan's authentic voice.",
    homeworkSubmittedToSchool: true,
    pepGoalProgress: "English engagement target — significant achievement",
    recordedBy: "staff_chervelle",
  },
  {
    id: "hw-003",
    youngPerson: "yp_casey",
    date: d(-3),
    subject: "Art",
    topic: "Watercolour piece — woodland scene",
    durationMinutes: 90,
    supportingStaff: "staff_anna",
    externalTutor: "",
    setBySchool: "Specialist provision — themed art piece",
    childInitiation: "Self-started",
    workCompleted: true,
    qualityOfWork: "Strong effort",
    childMoodDuring: "Engaged",
    challengesFaced: [],
    strategiesUsed: [
      "Anna present but quiet",
      "Casey's preferred materials and lighting set up",
      "Took breaks self-directed",
    ],
    childUnderstanding: "Casey's strength. Self-directed throughout.",
    parentalLikeSupport: "Anna admired Casey's choices. Didn't direct or comment unsolicited.",
    feedbackToSchool: "Beautiful piece — Casey's signature style and depth.",
    homeworkSubmittedToSchool: true,
    pepGoalProgress: "Art identity strong",
    recordedBy: "staff_anna",
  },
  {
    id: "hw-004",
    youngPerson: "yp_alex",
    date: d(-4),
    subject: "Science",
    topic: "Photosynthesis worksheet",
    durationMinutes: 25,
    supportingStaff: "staff_edward",
    externalTutor: "",
    setBySchool: "Year 9 Biology",
    childInitiation: "Reminded",
    workCompleted: true,
    qualityOfWork: "Adequate",
    childMoodDuring: "Distracted",
    challengesFaced: [
      "Boxing tomorrow — Alex distracted",
      "Worksheet feels repetitive",
    ],
    strategiesUsed: [
      "Got minimum done first",
      "Discussed concept in conversation rather than worksheet only",
    ],
    childUnderstanding: "Concept solid; worksheet not best format for Alex.",
    parentalLikeSupport: "Edward acknowledged the distraction was understandable; got the work done in 25 mins not battle.",
    feedbackToSchool: "Done; Alex understands concept though worksheet format challenging.",
    homeworkSubmittedToSchool: true,
    pepGoalProgress: "Science engagement adequate — note format preference",
    recordedBy: "staff_edward",
  },
  {
    id: "hw-005",
    youngPerson: "yp_jordan",
    date: d(-5),
    subject: "Geography",
    topic: "Climate change impacts research",
    durationMinutes: 50,
    supportingStaff: "staff_lackson",
    externalTutor: "",
    setBySchool: "Year 9 Geography",
    childInitiation: "Self-started",
    workCompleted: true,
    qualityOfWork: "Strong effort",
    childMoodDuring: "Engaged",
    challengesFaced: [],
    strategiesUsed: [
      "Independent research with Lackson nearby",
      "Linked to football team kit sustainability — Jordan's interest",
    ],
    childUnderstanding: "Strong. Jordan made his own connections.",
    parentalLikeSupport: "Lackson interested in topic; brief conversation expanded learning.",
    feedbackToSchool: "Excellent independent work.",
    homeworkSubmittedToSchool: true,
    pepGoalProgress: "Independent learning target met",
    recordedBy: "staff_lackson",
  },
  {
    id: "hw-006",
    youngPerson: "yp_alex",
    date: d(-7),
    subject: "Maths",
    topic: "Worksheet — fractions",
    durationMinutes: 15,
    supportingStaff: "staff_edward",
    externalTutor: "",
    setBySchool: "Year 9 Maths",
    childInitiation: "Resisted then engaged",
    workCompleted: false,
    qualityOfWork: "Stuck — needed more help",
    childMoodDuring: "Frustrated but persisted",
    challengesFaced: [
      "Fractions topic — Alex's weak area",
      "Frustration mounted after 10 mins",
    ],
    strategiesUsed: [
      "Pause taken when frustration mounted",
      "Offered to revisit tomorrow with school's catch-up support",
      "Logged for SENCO awareness",
    ],
    childUnderstanding: "Concept not landing. Needs school-side support.",
    parentalLikeSupport: "Edward validated frustration. Didn't push. Agreed plan for tomorrow.",
    feedbackToSchool: "Alex stuck on fractions — please offer catch-up support.",
    homeworkSubmittedToSchool: false,
    pepGoalProgress: "Maths confidence — flag concept as area needing more work",
    recordedBy: "staff_edward",
  },
  {
    id: "hw-007",
    youngPerson: "yp_jordan",
    date: d(-8),
    subject: "Tutor session — Maths",
    topic: "Algebra tutoring",
    durationMinutes: 60,
    supportingStaff: "staff_chervelle",
    externalTutor: "Sarah Mitchell (external maths tutor — funded)",
    setBySchool: "Self-led tuition — preparing for Y10",
    childInitiation: "Self-started",
    workCompleted: true,
    qualityOfWork: "Strong effort",
    childMoodDuring: "Engaged",
    challengesFaced: [],
    strategiesUsed: [
      "External tutor — different voice",
      "Jordan opened up to tutor about Y10 worry",
      "Goal-setting structure used",
    ],
    childUnderstanding: "Strong. External tutor adds value beyond home support.",
    parentalLikeSupport: "Chervelle present briefly to introduce; left tutor and Jordan to it.",
    feedbackToSchool: "External tutoring continues. Jordan engaged.",
    homeworkSubmittedToSchool: true,
    pepGoalProgress: "Y10 prep — on track",
    recordedBy: "staff_chervelle",
  },
];

const moodColour: Record<string, string> = {
  Engaged: "bg-green-100 text-green-800",
  "Frustrated but persisted": "bg-amber-100 text-amber-800",
  Distracted: "bg-blue-100 text-blue-800",
  Overwhelmed: "bg-red-100 text-red-800",
};

const initiationColour: Record<string, string> = {
  "Self-started": "bg-emerald-100 text-emerald-800",
  Reminded: "bg-blue-100 text-blue-800",
  "Resisted then engaged": "bg-amber-100 text-amber-800",
  "Refused (logged)": "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<HomeworkSession>[] = [
  { header: "Young Person", accessor: (r: HomeworkSession) => getYPName(r.youngPerson) },
  { header: "Date", accessor: (r: HomeworkSession) => r.date },
  { header: "Subject", accessor: (r: HomeworkSession) => r.subject },
  { header: "Topic", accessor: (r: HomeworkSession) => r.topic },
  { header: "Duration", accessor: (r: HomeworkSession) => `${r.durationMinutes}m` },
  { header: "Initiation", accessor: (r: HomeworkSession) => r.childInitiation },
  { header: "Completed", accessor: (r: HomeworkSession) => r.workCompleted ? "Yes" : "No" },
  { header: "Submitted", accessor: (r: HomeworkSession) => r.homeworkSubmittedToSchool ? "Yes" : "No" },
  { header: "Quality", accessor: (r: HomeworkSession) => r.qualityOfWork },
];

export default function HomeworkSupportLogPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((h) => h.youngPerson === filterYP);
    if (filterSubject !== "all") items = items.filter((h) => h.subject === filterSubject);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "duration":
          return b.durationMinutes - a.durationMinutes;
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, filterSubject, sortBy]);

  const total = data.length;
  const completed = data.filter((h) => h.workCompleted).length;
  const submitted = data.filter((h) => h.homeworkSubmittedToSchool).length;
  const totalMinutes = data.reduce((sum, h) => sum + h.durationMinutes, 0);

  const subjects = Array.from(new Set(data.map((h) => h.subject)));

  return (
    <PageShell
      title="Homework Support Log"
      subtitle="Per-child homework engagement, support strategies, school feedback, and PEP target progress"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="homework-support-log" />
          <PrintButton title="Homework Support Log" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Recent Sessions</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{Math.round((completed / total) * 100)}%</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{submitted}/{total}</p>
          <p className="text-xs text-muted-foreground">Submitted to School</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{Math.round(totalMinutes / 60)}h</p>
          <p className="text-xs text-muted-foreground">Total Time</p>
        </div>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-6 flex items-start gap-2">
        <BookOpen className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          Homework is more than tasks — it&apos;s building learning habits, focus tolerance, and self-belief.
          We support without taking over. Frustration is okay; refusal is logged and addressed; effort is
          praised over outcome.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterYP} onValueChange={setFilterYP}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Children" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            <SelectItem value="yp_alex">{getYPName("yp_alex")}</SelectItem>
            <SelectItem value="yp_jordan">{getYPName("yp_jordan")}</SelectItem>
            <SelectItem value="yp_casey">{getYPName("yp_casey")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Subjects" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="duration">Longest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((h) => {
          const isExpanded = expandedId === h.id;

          return (
            <div key={h.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : h.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <GraduationCap className="h-5 w-5 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(h.youngPerson)} &middot; {h.subject}: {h.topic}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {h.date} &middot; {h.durationMinutes} mins &middot; Supported by {getStaffName(h.supportingStaff)}{h.externalTutor && ` + ${h.externalTutor.split(" (")[0]}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", initiationColour[h.childInitiation])}>
                    {h.childInitiation}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", moodColour[h.childMoodDuring])}>
                    {h.childMoodDuring}
                  </span>
                  {h.workCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Set By School</p>
                    <p className="text-sm">{h.setBySchool}</p>
                  </div>

                  {h.challengesFaced.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Challenges Faced</p>
                      <ul className="space-y-1">
                        {h.challengesFaced.map((c, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Strategies Used</p>
                    <ul className="space-y-1">
                      {h.strategiesUsed.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Star className="h-3 w-3 text-blue-500 mt-1 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Child&apos;s Understanding</p>
                    <p className="text-sm">{h.childUnderstanding}</p>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">
                      <Heart className="h-3 w-3 inline mr-1" />Parental-Like Support
                    </p>
                    <p className="text-sm">{h.parentalLikeSupport}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Feedback to School</p>
                    <p className="text-sm">{h.feedbackToSchool}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">PEP Goal Progress</p>
                    <p className="text-sm">{h.pepGoalProgress}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Clock className="h-3 w-3 inline mr-1" />{h.durationMinutes} mins</span>
                    <span>Quality: {h.qualityOfWork}</span>
                    <span>Submitted: {h.homeworkSubmittedToSchool ? "Yes" : "No"}</span>
                    <span>Recorded: {getStaffName(h.recordedBy)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Homework support records support Quality Standard 8 (education),
          Personal Education Plan (PEP) target tracking, and Virtual School Head oversight. Linked to
          Education Attendance, PEP Tracker, and Annual Outcomes Report.
        </p>
      </div>
    </PageShell>
  );
}

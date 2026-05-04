"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  ChefHat,
  Utensils,
  Flame,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Award,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CookingRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  skill: string;
  category:
    | "Knife skills"
    | "Hob/cooking"
    | "Oven/baking"
    | "Microwave"
    | "Recipe planning"
    | "Shopping list"
    | "Budgeting"
    | "Food hygiene"
    | "Allergens awareness"
    | "Cultural cooking";
  competencyLevel: "Not yet introduced" | "Observed staff" | "Assisted" | "Did with prompts" | "Did independently" | "Can teach others";
  firstAttemptDate?: string;
  achievedIndependentlyDate?: string;
  recipesAttempted: { name: string; date: string; outcome: "Burnt" | "Edible" | "Good" | "Excellent" | "Showed off to others" }[];
  cuisinesExplored: string[];
  childVoice: string;
  staffObservation: string;
  hygieneCertificate: boolean;
  ledFamilyMeal: boolean;
  flagsRisks: string[];
  nextSkillToBuild: string;
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const records: CookingRecord[] = [
  {
    id: "cook_001",
    youngPerson: "yp_jordan",
    recordedDate: d(-7),
    skill: "Caribbean rice & peas",
    category: "Cultural cooking",
    competencyLevel: "Can teach others",
    firstAttemptDate: d(-180),
    achievedIndependentlyDate: d(-90),
    recipesAttempted: [
      { name: "Rice & peas (mum's recipe)", date: d(-180), outcome: "Edible" },
      { name: "Rice & peas (mum's recipe)", date: d(-150), outcome: "Good" },
      { name: "Rice & peas (mum's recipe)", date: d(-90), outcome: "Excellent" },
      { name: "Rice & peas + jerk chicken", date: d(-30), outcome: "Showed off to others" },
      { name: "Sunday Caribbean dinner for whole home", date: d(-7), outcome: "Showed off to others" },
    ],
    cuisinesExplored: ["Caribbean", "Pakistani (mum's heritage)", "British"],
    childVoice:
      "Mum taught me on the phone the first time, then I made it for everyone here. Casey said it was better than takeaway. I taught Anna how to do it.",
    staffObservation:
      "Jordan owns this skill — confident, methodical, proud. Heritage food connection is significant. He's now teaching Casey and Anna. This is identity work as much as cooking.",
    hygieneCertificate: true,
    ledFamilyMeal: true,
    flagsRisks: [],
    nextSkillToBuild: "Pakistani biryani — wants to do it for Eid, has mum's recipe",
    reviewDate: d(60),
    keyWorker: "staff_anna",
  },
  {
    id: "cook_002",
    youngPerson: "yp_jordan",
    recordedDate: d(-14),
    skill: "Knife skills — full vegetable prep",
    category: "Knife skills",
    competencyLevel: "Did independently",
    firstAttemptDate: d(-200),
    achievedIndependentlyDate: d(-120),
    recipesAttempted: [],
    cuisinesExplored: [],
    childVoice: "I can do onions without crying now. Joke. Sort of.",
    staffObservation:
      "Holds knife properly, claw grip, controlled. Has progressed from peeler-only to full knife confidence. Could teach Casey.",
    hygieneCertificate: true,
    ledFamilyMeal: true,
    flagsRisks: [],
    nextSkillToBuild: "Filleting fish (with Anna)",
    reviewDate: d(60),
    keyWorker: "staff_anna",
  },
  {
    id: "cook_003",
    youngPerson: "yp_alex",
    recordedDate: d(-10),
    skill: "Vegetarian wellington",
    category: "Oven/baking",
    competencyLevel: "Did with prompts",
    firstAttemptDate: d(-130),
    recipesAttempted: [
      { name: "Veggie wellington (Christmas trial run)", date: d(-130), outcome: "Edible" },
      { name: "Veggie wellington (Christmas Day main)", date: d(-130), outcome: "Good" },
      { name: "Mushroom wellington (own recipe variation)", date: d(-30), outcome: "Excellent" },
    ],
    cuisinesExplored: ["British", "Italian", "Mediterranean"],
    childVoice:
      "I like that I can cook for myself and not just eat what others make. Vegetarian cooking is mine. I'm getting better at pastry.",
    staffObservation:
      "Alex is finding cooking grounding — quiet, focused, methodical. Pastry was new. Took ownership of being the home's vegetarian cook.",
    hygieneCertificate: false,
    ledFamilyMeal: false,
    flagsRisks: ["Hot oven safety — supervised first 3 attempts, now confident with prompts"],
    nextSkillToBuild: "Bread making — Alex curious",
    reviewDate: d(45),
    keyWorker: "staff_anna",
  },
  {
    id: "cook_004",
    youngPerson: "yp_alex",
    recordedDate: d(-21),
    skill: "Meal planning & shopping list for 5 people for 3 days",
    category: "Recipe planning",
    competencyLevel: "Did independently",
    firstAttemptDate: d(-90),
    achievedIndependentlyDate: d(-30),
    recipesAttempted: [],
    cuisinesExplored: [],
    childVoice: "I planned the weekend menu. I forgot the cheese. Otherwise it worked.",
    staffObservation:
      "Alex now plans, lists, budgets — strong life skill. Forgetting cheese is normal. Confident at supermarket too.",
    hygieneCertificate: false,
    ledFamilyMeal: false,
    flagsRisks: [],
    nextSkillToBuild: "Budgeting under £30 for 4-person dinner",
    reviewDate: d(45),
    keyWorker: "staff_anna",
  },
  {
    id: "cook_005",
    youngPerson: "yp_casey",
    recordedDate: d(-5),
    skill: "Visual recipe cards — pasta with sauce",
    category: "Hob/cooking",
    competencyLevel: "Did with prompts",
    firstAttemptDate: d(-60),
    recipesAttempted: [
      { name: "Pasta with sauce (visual recipe)", date: d(-60), outcome: "Edible" },
      { name: "Pasta with sauce (visual recipe)", date: d(-30), outcome: "Good" },
      { name: "Pasta with cheese for Ellie's visit", date: d(-5), outcome: "Excellent" },
    ],
    cuisinesExplored: ["Italian (basic)", "British"],
    childVoice:
      "I made it for Ellie when she came round and she said it was nice. I want to learn pizza next.",
    staffObservation:
      "Visual recipe cards adapted for Casey's processing — pictures + 5-step instructions. Casey followed independently with one-word prompts. Pride in feeding Ellie was huge.",
    hygieneCertificate: false,
    ledFamilyMeal: false,
    flagsRisks: ["Hob safety — staff present, will not yet leave Casey unattended at hob"],
    nextSkillToBuild: "Homemade pizza (visual recipe)",
    reviewDate: d(30),
    keyWorker: "staff_anna",
  },
  {
    id: "cook_006",
    youngPerson: "yp_casey",
    recordedDate: d(-18),
    skill: "Food hygiene basics — handwashing, raw/cooked separation, fridge temps",
    category: "Food hygiene",
    competencyLevel: "Did with prompts",
    firstAttemptDate: d(-90),
    recipesAttempted: [],
    cuisinesExplored: [],
    childVoice: "Wash hands. Don't touch raw chicken then bread. I know.",
    staffObservation: "Solid basics. Visual fridge thermometer placed at Casey's eye level. Will progress to Level 1 hygiene workbook over summer.",
    hygieneCertificate: false,
    ledFamilyMeal: false,
    flagsRisks: [],
    nextSkillToBuild: "Level 1 Food Hygiene certificate (online, with Anna)",
    reviewDate: d(60),
    keyWorker: "staff_anna",
  },
];

const exportCols: ExportColumn<CookingRecord>[] = [
  { header: "Young Person", accessor: (r: CookingRecord) => getYPName(r.youngPerson) },
  { header: "Date", accessor: (r: CookingRecord) => r.recordedDate },
  { header: "Skill", accessor: (r: CookingRecord) => r.skill },
  { header: "Category", accessor: (r: CookingRecord) => r.category },
  { header: "Competency", accessor: (r: CookingRecord) => r.competencyLevel },
  { header: "First Attempt", accessor: (r: CookingRecord) => r.firstAttemptDate ?? "—" },
  { header: "Independent", accessor: (r: CookingRecord) => r.achievedIndependentlyDate ?? "—" },
  { header: "Cuisines", accessor: (r: CookingRecord) => r.cuisinesExplored.join("; ") },
  { header: "Hygiene Cert", accessor: (r: CookingRecord) => (r.hygieneCertificate ? "Yes" : "No") },
  { header: "Led Family Meal", accessor: (r: CookingRecord) => (r.ledFamilyMeal ? "Yes" : "No") },
  { header: "Child Voice", accessor: (r: CookingRecord) => r.childVoice },
  { header: "Next Skill", accessor: (r: CookingRecord) => r.nextSkillToBuild },
  { header: "Review", accessor: (r: CookingRecord) => r.reviewDate },
  { header: "Key Worker", accessor: (r: CookingRecord) => getStaffName(r.keyWorker) },
];

const competencyColour: Record<CookingRecord["competencyLevel"], string> = {
  "Not yet introduced": "bg-slate-100 text-slate-800 border-slate-200",
  "Observed staff": "bg-blue-100 text-blue-800 border-blue-200",
  Assisted: "bg-sky-100 text-sky-800 border-sky-200",
  "Did with prompts": "bg-amber-100 text-amber-800 border-amber-200",
  "Did independently": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Can teach others": "bg-purple-100 text-purple-800 border-purple-200",
};

const outcomeColour: Record<CookingRecord["recipesAttempted"][number]["outcome"], string> = {
  Burnt: "bg-red-100 text-red-800 border-red-200",
  Edible: "bg-amber-100 text-amber-800 border-amber-200",
  Good: "bg-blue-100 text-blue-800 border-blue-200",
  Excellent: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Showed off to others": "bg-purple-100 text-purple-800 border-purple-200",
};

export default function ChildCookingBakingSkillsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "competency" | "category">("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = records.filter((rec) => {
      const matchesSearch =
        !search ||
        getYPName(rec.youngPerson).toLowerCase().includes(search.toLowerCase()) ||
        rec.skill.toLowerCase().includes(search.toLowerCase()) ||
        rec.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === "all" || rec.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
    r = [...r].sort((a, b) => {
      if (sortBy === "name") return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
      if (sortBy === "competency") return a.competencyLevel.localeCompare(b.competencyLevel);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return b.recordedDate.localeCompare(a.recordedDate);
    });
    return r;
  }, [search, categoryFilter, sortBy]);

  const stats = useMemo(() => {
    const skillsTracked = records.length;
    const independentSkills = records.filter(
      (r) => r.competencyLevel === "Did independently" || r.competencyLevel === "Can teach others"
    ).length;
    const hygieneCerts = records.filter((r) => r.hygieneCertificate).length;
    const ledMeals = records.filter((r) => r.ledFamilyMeal).length;
    return { skillsTracked, independentSkills, hygieneCerts, ledMeals };
  }, []);

  return (
    <PageShell
      title="Cooking & Baking Skills"
      subtitle="Per-child progression of cooking and baking skills — knife work, hob/oven, recipe planning, hygiene, cultural cooking. Heritage food connection, family meals led, and the journey from observed → assisted → independent → can teach others."
      actions={
        <div className="flex gap-2">
          <ExportButton data={filtered} columns={exportCols} filename="child-cooking-baking-skills" />
          <PrintButton title="Cooking & Baking Skills" />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <ChefHat className="h-4 w-4" />
            <span>Skills tracked</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.skillsTracked}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Award className="h-4 w-4" />
            <span>Independent or teaching</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.independentSkills}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Flame className="h-4 w-4" />
            <span>Hygiene certificates</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.hygieneCerts}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Utensils className="h-4 w-4" />
            <span>Family meals led</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.ledMeals}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search young person, skill, category..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Knife skills">Knife skills</SelectItem>
            <SelectItem value="Hob/cooking">Hob/cooking</SelectItem>
            <SelectItem value="Oven/baking">Oven/baking</SelectItem>
            <SelectItem value="Microwave">Microwave</SelectItem>
            <SelectItem value="Recipe planning">Recipe planning</SelectItem>
            <SelectItem value="Shopping list">Shopping list</SelectItem>
            <SelectItem value="Budgeting">Budgeting</SelectItem>
            <SelectItem value="Food hygiene">Food hygiene</SelectItem>
            <SelectItem value="Allergens awareness">Allergens awareness</SelectItem>
            <SelectItem value="Cultural cooking">Cultural cooking</SelectItem>
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
            <SelectItem value="competency">Competency</SelectItem>
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
                    <span className="text-slate-700">{r.skill}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", competencyColour[r.competencyLevel])}>
                      {r.competencyLevel}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                      {r.category}
                    </span>
                    {r.ledFamilyMeal ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200">
                        Led family meal
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-slate-600">
                    Recorded {r.recordedDate} · Review {r.reviewDate} · {getStaffName(r.keyWorker)}
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </button>
              {isOpen ? (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Child Voice</div>
                      <p className="text-sm text-slate-700 italic">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Staff Observation</div>
                      <p className="text-sm text-slate-700">{r.staffObservation}</p>
                    </div>
                    {r.recipesAttempted.length ? (
                      <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Attempts & outcomes</div>
                        <div className="space-y-1.5">
                          {r.recipesAttempted.map((a, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                              <span className="text-slate-500 w-24 shrink-0">{a.date}</span>
                              <span className="flex-1 text-slate-700">{a.name}</span>
                              <span className={cn("text-xs px-2 py-0.5 rounded-full border", outcomeColour[a.outcome])}>
                                {a.outcome}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {r.cuisinesExplored.length ? (
                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Cuisines explored</div>
                        <div className="flex flex-wrap gap-1.5">
                          {r.cuisinesExplored.map((c, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Progress dates</div>
                      <div className="text-sm text-slate-700 space-y-1">
                        <div><span className="text-slate-500">First attempt:</span> {r.firstAttemptDate ?? "—"}</div>
                        <div><span className="text-slate-500">Independent:</span> {r.achievedIndependentlyDate ?? "—"}</div>
                        <div><span className="text-slate-500">Hygiene cert:</span> {r.hygieneCertificate ? "Yes" : "Not yet"}</div>
                      </div>
                    </div>
                    {r.flagsRisks.length ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 lg:col-span-2">
                        <div className="text-xs font-semibold text-amber-800 uppercase mb-2">Flags & risks</div>
                        <ul className="text-sm text-amber-900 space-y-1">
                          {r.flagsRisks.map((f, i) => (
                            <li key={i} className="flex gap-2"><span>!</span><span>{f}</span></li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-blue-800 uppercase mb-2">Next skill to build</div>
                      <p className="text-sm text-blue-900">{r.nextSkillToBuild}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-semibold mb-1">Regulatory framework</div>
        <p>
          Cooking is a core independence skill and a powerful identity / family / culture connector. Practice is
          grounded in Quality Standard 6 (Enjoyment & Achievement) and the Pathway Plan for over-16s. Heritage food
          work supports UNCRC Article 30 (cultural identity). Food hygiene aligns with Level 1 / 2 standards. Knife
          and hob safety follow the home&rsquo;s individual risk assessment for each young person.
        </p>
      </div>
    </PageShell>
  );
}

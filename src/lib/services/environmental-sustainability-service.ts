// ==============================================================================
// CORNERSTONE -- HOME ENVIRONMENTAL SUSTAINABILITY SERVICE
// Tracks environmental sustainability audits and initiatives within
// children's residential homes including carbon footprint reviews, water
// conservation, biodiversity, sustainable procurement, plastic reduction,
// low carbon transport, sustainable food sourcing, food waste reduction,
// young people education, staff awareness training, community environmental
// projects, green energy tariffs, renewable installations, and insulation
// upgrades.
//
// Covers: Environmental audit scheduling and completion, carbon saving
// estimation and tracking, cost saving and investment tracking, ROI
// calculation, young people involvement in sustainability initiatives,
// educational component delivery, community benefit assessment, evidence
// documentation, responsible person assignment, target and completion
// date management, and status progression tracking.
//
// UK Regulatory Framework:
// CHR 2015 Reg 25 (premises),
// Climate Change Act 2008,
// Environment Act 2021,
// Streamlined Energy and Carbon Reporting (SECR),
// SCCIF: premises modelling good practice for children —
// environmental awareness as educational opportunity.
// ==============================================================================

"use client";

import { createServerClient, isSupabaseEnabled } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any;

export type ServiceResult<T> = { ok: boolean; data?: T; error?: string };

// -- Enums (const arrays + types) ---------------------------------------------

export const FOCUS_AREAS = [
  "Carbon Footprint Review",
  "Water Conservation",
  "Biodiversity — Garden/Wildlife",
  "Sustainable Procurement",
  "Plastic Reduction",
  "Transport — Low Carbon",
  "Food — Sustainable Sourcing",
  "Food — Waste Reduction",
  "Young People Education",
  "Staff Awareness Training",
  "Community Environmental Project",
  "Green Energy Tariff",
  "Renewable Installation",
  "Insulation Upgrade",
] as const;
export type FocusArea = (typeof FOCUS_AREAS)[number];

export const CURRENT_STATUSES = [
  "Not Started",
  "Planned",
  "In Progress",
  "Achieved",
  "Maintained",
  "Regressed",
] as const;
export type CurrentStatus = (typeof CURRENT_STATUSES)[number];

// -- Derived enum subsets for domain logic ------------------------------------

export const ENERGY_FOCUS_AREAS: FocusArea[] = [
  "Carbon Footprint Review",
  "Green Energy Tariff",
  "Renewable Installation",
  "Insulation Upgrade",
];

export const FOOD_FOCUS_AREAS: FocusArea[] = [
  "Food — Sustainable Sourcing",
  "Food — Waste Reduction",
];

export const EDUCATION_FOCUS_AREAS: FocusArea[] = [
  "Young People Education",
  "Staff Awareness Training",
];

export const INFRASTRUCTURE_FOCUS_AREAS: FocusArea[] = [
  "Green Energy Tariff",
  "Renewable Installation",
  "Insulation Upgrade",
];

// -- Label maps ---------------------------------------------------------------

export const FOCUS_AREA_LABELS: { area: FocusArea; label: string }[] = [
  { area: "Carbon Footprint Review", label: "Carbon Footprint Review" },
  { area: "Water Conservation", label: "Water Conservation" },
  { area: "Biodiversity — Garden/Wildlife", label: "Biodiversity — Garden / Wildlife" },
  { area: "Sustainable Procurement", label: "Sustainable Procurement" },
  { area: "Plastic Reduction", label: "Plastic Reduction" },
  { area: "Transport — Low Carbon", label: "Transport — Low Carbon" },
  { area: "Food — Sustainable Sourcing", label: "Food — Sustainable Sourcing" },
  { area: "Food — Waste Reduction", label: "Food — Waste Reduction" },
  { area: "Young People Education", label: "Young People Education" },
  { area: "Staff Awareness Training", label: "Staff Awareness Training" },
  { area: "Community Environmental Project", label: "Community Environmental Project" },
  { area: "Green Energy Tariff", label: "Green Energy Tariff" },
  { area: "Renewable Installation", label: "Renewable Installation" },
  { area: "Insulation Upgrade", label: "Insulation Upgrade" },
];

export const CURRENT_STATUS_LABELS: { status: CurrentStatus; label: string }[] = [
  { status: "Not Started", label: "Not Started" },
  { status: "Planned", label: "Planned" },
  { status: "In Progress", label: "In Progress" },
  { status: "Achieved", label: "Achieved" },
  { status: "Maintained", label: "Maintained" },
  { status: "Regressed", label: "Regressed" },
];

// -- Row type -----------------------------------------------------------------

export interface EnvironmentalSustainabilityRow {
  id: string;
  home_id: string;
  audit_date: string;
  auditor_name: string;
  focus_area: FocusArea;
  current_status: CurrentStatus;
  target_date: string | null;
  actual_completion_date: string | null;
  estimated_carbon_saving_kg: number | null;
  estimated_cost_saving: number | null;
  investment_required: number | null;
  young_people_involved: boolean;
  educational_component: boolean;
  community_benefit: boolean;
  evidence_attached: boolean;
  responsible_person: string;
  review_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// -- Validation ---------------------------------------------------------------

export function validateEnvironmentalSustainability(input: {
  auditDate?: string;
  auditorName?: string;
  focusArea?: string;
  currentStatus?: string;
  targetDate?: string | null;
  actualCompletionDate?: string | null;
  estimatedCarbonSavingKg?: number | null;
  estimatedCostSaving?: number | null;
  investmentRequired?: number | null;
  responsiblePerson?: string;
  reviewDate?: string | null;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.auditDate) {
    errors.push("Audit date is required");
  } else {
    const dateObj = new Date(input.auditDate);
    if (isNaN(dateObj.getTime())) {
      errors.push("Audit date must be a valid date");
    } else if (dateObj > new Date()) {
      errors.push("Audit date cannot be in the future");
    }
  }

  if (!input.auditorName || input.auditorName.trim().length === 0) {
    errors.push("Auditor name is required");
  }

  if (!input.focusArea || !(FOCUS_AREAS as readonly string[]).includes(input.focusArea)) {
    errors.push(`Focus area must be one of: ${FOCUS_AREAS.join(", ")}`);
  }

  if (!input.currentStatus || !(CURRENT_STATUSES as readonly string[]).includes(input.currentStatus)) {
    errors.push(`Current status must be one of: ${CURRENT_STATUSES.join(", ")}`);
  }

  if (!input.responsiblePerson || input.responsiblePerson.trim().length === 0) {
    errors.push("Responsible person is required");
  }

  // Business rule: carbon saving should be non-negative
  if (input.estimatedCarbonSavingKg !== undefined && input.estimatedCarbonSavingKg !== null) {
    if (input.estimatedCarbonSavingKg < 0) {
      errors.push("Estimated carbon saving cannot be negative");
    }
  }

  // Business rule: cost saving should be non-negative
  if (input.estimatedCostSaving !== undefined && input.estimatedCostSaving !== null) {
    if (input.estimatedCostSaving < 0) {
      errors.push("Estimated cost saving cannot be negative");
    }
  }

  // Business rule: investment should be non-negative
  if (input.investmentRequired !== undefined && input.investmentRequired !== null) {
    if (input.investmentRequired < 0) {
      errors.push("Investment required cannot be negative");
    }
  }

  // Business rule: achieved/maintained status should have completion date
  if (
    input.currentStatus &&
    (input.currentStatus === "Achieved" || input.currentStatus === "Maintained") &&
    !input.actualCompletionDate
  ) {
    errors.push("Actual completion date is required when status is Achieved or Maintained");
  }

  // Business rule: completion date should not be before audit date
  if (input.actualCompletionDate && input.auditDate) {
    const compDate = new Date(input.actualCompletionDate);
    const auditDate = new Date(input.auditDate);
    if (!isNaN(compDate.getTime()) && !isNaN(auditDate.getTime()) && compDate < auditDate) {
      errors.push("Actual completion date cannot be before the audit date");
    }
  }

  // Business rule: target date validation
  if (input.targetDate) {
    const tgtDate = new Date(input.targetDate);
    if (isNaN(tgtDate.getTime())) {
      errors.push("Target date must be a valid date");
    }
  }

  // Business rule: review date must not be in the past
  if (input.reviewDate) {
    const revDate = new Date(input.reviewDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(revDate.getTime())) {
      errors.push("Review date must be a valid date");
    } else if (revDate < today) {
      errors.push("Review date should not be in the past");
    }
  }

  // Business rule: infrastructure focus areas should have investment figure
  if (
    input.focusArea &&
    (INFRASTRUCTURE_FOCUS_AREAS as string[]).includes(input.focusArea) &&
    (input.investmentRequired === null || input.investmentRequired === undefined)
  ) {
    errors.push("Investment required should be specified for infrastructure initiatives (Green Energy Tariff, Renewable Installation, Insulation Upgrade)");
  }

  // Business rule: regressed status should have notes explaining why
  if (input.currentStatus === "Regressed") {
    // This is a soft validation — we can't check notes here since it's not in the validation input
    // The alert system will catch this
  }

  return { valid: errors.length === 0, errors };
}

// -- Pure functions (no DB) ---------------------------------------------------

export function computeMetrics(
  rows: EnvironmentalSustainabilityRow[],
): {
  total_records: number;
  by_focus_area: Record<string, number>;
  by_current_status: Record<string, number>;
  achieved_rate: number;
  young_people_involvement_rate: number;
  educational_rate: number;
  community_rate: number;
  total_carbon_saving: number;
  total_cost_saving: number;
  total_investment: number;
  roi: number;
  in_progress_count: number;
  overdue_count: number;
} {
  const total = rows.length;

  const boolRate = (field: keyof EnvironmentalSustainabilityRow) => {
    const count = rows.filter((r) => r[field] === true).length;
    return total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
  };

  // Focus area breakdown
  const byFocusArea: Record<string, number> = {};
  for (const fa of FOCUS_AREAS) byFocusArea[fa] = 0;
  for (const r of rows) byFocusArea[r.focus_area] = (byFocusArea[r.focus_area] || 0) + 1;

  // Current status breakdown
  const byCurrentStatus: Record<string, number> = {};
  for (const cs of CURRENT_STATUSES) byCurrentStatus[cs] = 0;
  for (const r of rows) byCurrentStatus[r.current_status] = (byCurrentStatus[r.current_status] || 0) + 1;

  // Achieved rate (Achieved + Maintained as proportion of total)
  const achievedRate = total > 0
    ? Math.round(
        (rows.filter((r) => r.current_status === "Achieved" || r.current_status === "Maintained").length / total) * 1000,
      ) / 10
    : 0;

  // Financial and carbon totals
  const totalCarbonSaving = rows.reduce(
    (sum, r) => sum + (r.estimated_carbon_saving_kg ?? 0),
    0,
  );
  const totalCostSaving = rows.reduce(
    (sum, r) => sum + (r.estimated_cost_saving ?? 0),
    0,
  );
  const totalInvestment = rows.reduce(
    (sum, r) => sum + (r.investment_required ?? 0),
    0,
  );

  // ROI: (total cost saving / total investment) as percentage
  const roi = totalInvestment > 0
    ? Math.round((totalCostSaving / totalInvestment) * 1000) / 10
    : 0;

  // In progress count
  const inProgressCount = rows.filter((r) => r.current_status === "In Progress").length;

  // Overdue count — target date passed but not achieved
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueCount = rows.filter((r) => {
    if (!r.target_date) return false;
    if (r.current_status === "Achieved" || r.current_status === "Maintained") return false;
    const tgtDate = new Date(r.target_date);
    return tgtDate < today;
  }).length;

  return {
    total_records: total,
    by_focus_area: byFocusArea,
    by_current_status: byCurrentStatus,
    achieved_rate: achievedRate,
    young_people_involvement_rate: boolRate("young_people_involved"),
    educational_rate: boolRate("educational_component"),
    community_rate: boolRate("community_benefit"),
    total_carbon_saving: Math.round(totalCarbonSaving * 100) / 100,
    total_cost_saving: Math.round(totalCostSaving * 100) / 100,
    total_investment: Math.round(totalInvestment * 100) / 100,
    roi,
    in_progress_count: inProgressCount,
    overdue_count: overdueCount,
  };
}

export function computeAlerts(
  rows: EnvironmentalSustainabilityRow[],
): {
  type: string;
  severity: "critical" | "high" | "medium";
  message: string;
  record_id?: string;
}[] {
  const alerts: {
    type: string;
    severity: "critical" | "high" | "medium";
    message: string;
    record_id?: string;
  }[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // High: Regressed status — initiative has gone backwards
  for (const r of rows) {
    if (r.current_status === "Regressed") {
      alerts.push({
        type: "regressed_initiative",
        severity: "high",
        message: `${r.focus_area} initiative has regressed — review root cause and develop recovery plan. Environmental sustainability requires consistent progress per Environment Act 2021`,
        record_id: r.id,
      });
    }
  }

  // High: Overdue initiatives with significant investment
  for (const r of rows) {
    if (
      r.target_date &&
      r.current_status !== "Achieved" &&
      r.current_status !== "Maintained" &&
      new Date(r.target_date) < today &&
      r.investment_required &&
      r.investment_required > 1000
    ) {
      alerts.push({
        type: "overdue_high_investment",
        severity: "high",
        message: `${r.focus_area} initiative with £${r.investment_required} investment is overdue (target: ${r.target_date}) — review progress and barriers to completion`,
        record_id: r.id,
      });
    }
  }

  // High: Infrastructure initiative not started past target date
  for (const r of rows) {
    if (
      (INFRASTRUCTURE_FOCUS_AREAS as string[]).includes(r.focus_area) &&
      r.current_status === "Not Started" &&
      r.target_date &&
      new Date(r.target_date) < today
    ) {
      alerts.push({
        type: "infrastructure_not_started",
        severity: "high",
        message: `${r.focus_area} initiative has not started despite target date of ${r.target_date} having passed — this may impact SECR reporting obligations`,
        record_id: r.id,
      });
    }
  }

  // Medium: Overdue target dates
  for (const r of rows) {
    if (
      r.target_date &&
      r.current_status !== "Achieved" &&
      r.current_status !== "Maintained" &&
      new Date(r.target_date) < today
    ) {
      alerts.push({
        type: "overdue_target",
        severity: "medium",
        message: `${r.focus_area} initiative target date of ${r.target_date} has passed — current status is "${r.current_status}". Review and update target or accelerate delivery`,
        record_id: r.id,
      });
    }
  }

  // Medium: Overdue review dates
  for (const r of rows) {
    if (r.review_date && new Date(r.review_date) < today) {
      alerts.push({
        type: "overdue_review",
        severity: "medium",
        message: `${r.focus_area} initiative was due for review on ${r.review_date} and is now overdue — schedule review promptly`,
        record_id: r.id,
      });
    }
  }

  // Medium: No young people involvement across educational initiatives
  const educationalRows = rows.filter((r) => (EDUCATION_FOCUS_AREAS as string[]).includes(r.focus_area));
  const noYPInvolvement = educationalRows.filter((r) => !r.young_people_involved);
  if (noYPInvolvement.length > 0) {
    for (const r of noYPInvolvement) {
      alerts.push({
        type: "education_no_yp",
        severity: "medium",
        message: `${r.focus_area} initiative on ${r.audit_date} does not involve young people — SCCIF expects the home to model good practice and provide environmental education opportunities`,
        record_id: r.id,
      });
    }
  }

  // Medium: No educational component for initiatives involving young people
  for (const r of rows) {
    if (r.young_people_involved && !r.educational_component) {
      alerts.push({
        type: "yp_no_education",
        severity: "medium",
        message: `${r.focus_area} initiative involves young people but has no educational component — maximise learning opportunities per SCCIF premises standards`,
        record_id: r.id,
      });
    }
  }

  // Medium: No evidence attached for achieved initiatives
  for (const r of rows) {
    if (
      (r.current_status === "Achieved" || r.current_status === "Maintained") &&
      !r.evidence_attached
    ) {
      alerts.push({
        type: "achieved_no_evidence",
        severity: "medium",
        message: `${r.focus_area} initiative marked as ${r.current_status} but no evidence is attached — document outcomes for SECR reporting and inspection evidence`,
        record_id: r.id,
      });
    }
  }

  return alerts;
}

export function generateAriaInsights(
  rows: EnvironmentalSustainabilityRow[],
): string[] {
  const metrics = computeMetrics(rows);
  const alerts = computeAlerts(rows);
  const insights: string[] = [];

  // Insight 1: Summary overview
  const areaBreakdown = Object.entries(metrics.by_focus_area)
    .filter(([, count]) => count > 0)
    .map(([area, count]) => `${area}: ${count}`)
    .join(", ");

  const statusBreakdown = Object.entries(metrics.by_current_status)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${status}: ${count}`)
    .join(", ");

  insights.push(
    `[sky] ${metrics.total_records} environmental sustainability ${metrics.total_records === 1 ? "initiative" : "initiatives"}. ` +
      `Focus areas: ${areaBreakdown || "none recorded"}. ` +
      `Status: ${statusBreakdown || "none recorded"}. ` +
      `Achieved rate: ${metrics.achieved_rate}%. ` +
      `Total estimated carbon saving: ${metrics.total_carbon_saving}kg. ` +
      `Total estimated cost saving: £${metrics.total_cost_saving}. ` +
      `Total investment: £${metrics.total_investment}. ` +
      `ROI: ${metrics.roi}%.`,
  );

  // Insight 2: Priority concerns or progress indicators
  const highAlerts = alerts.filter((a) => a.severity === "high");
  const mediumAlerts = alerts.filter((a) => a.severity === "medium");

  if (highAlerts.length > 0) {
    insights.push(
      `[amber] ${highAlerts.length} high-priority and ${mediumAlerts.length} medium-priority sustainability alerts active. ` +
        `In progress: ${metrics.in_progress_count}. ` +
        `Overdue: ${metrics.overdue_count}. ` +
        `Young people involvement: ${metrics.young_people_involvement_rate}%. ` +
        `Educational component rate: ${metrics.educational_rate}%. ` +
        `Community benefit rate: ${metrics.community_rate}%.`,
    );
  } else {
    insights.push(
      `[amber] No high-priority sustainability alerts currently active. ` +
        `In progress: ${metrics.in_progress_count}. ` +
        `Overdue: ${metrics.overdue_count}. ` +
        `Young people involvement: ${metrics.young_people_involvement_rate}%. ` +
        `Educational component rate: ${metrics.educational_rate}%. ` +
        `Community benefit rate: ${metrics.community_rate}%. ` +
        `Continue progressing environmental initiatives per Climate Change Act 2008 and Environment Act 2021.`,
    );
  }

  // Insight 3: Reflective question
  if (metrics.young_people_involvement_rate < 50 && metrics.total_records > 0) {
    insights.push(
      `[reflect] Only ${metrics.young_people_involvement_rate}% of sustainability initiatives involve young people. ` +
        `Environmental sustainability offers rich educational opportunities — are young people being ` +
        `actively engaged in understanding and contributing to the home's environmental impact? ` +
        `SCCIF expects homes to model good practice and the Environment Act 2021 creates duties ` +
        `that can be used as learning opportunities about civic responsibility, science, and ` +
        `sustainable living skills that young people will need as they transition to independence.`,
    );
  } else if (metrics.overdue_count > 0) {
    insights.push(
      `[reflect] ${metrics.overdue_count} sustainability ${metrics.overdue_count === 1 ? "initiative is" : "initiatives are"} overdue. ` +
        `Is the home maintaining momentum on its environmental commitments? The Climate Change Act 2008 ` +
        `sets legally binding targets, and SECR requires organisations to report on energy use and ` +
        `carbon emissions. Falling behind on sustainability targets may affect both regulatory ` +
        `compliance and the home's ability to model responsible environmental behaviour for children.`,
    );
  } else if (metrics.educational_rate < 50 && metrics.total_records > 0) {
    insights.push(
      `[reflect] Only ${metrics.educational_rate}% of sustainability initiatives include an educational ` +
        `component. Are environmental projects being used as learning opportunities for young people? ` +
        `Gardening, recycling, energy monitoring, and food waste reduction are practical activities ` +
        `that build life skills, promote wellbeing, and develop environmental awareness. SCCIF ` +
        `expects the premises to support positive outcomes, and environmental education contributes ` +
        `to preparing young people for independent and responsible adult living.`,
    );
  } else {
    insights.push(
      `[reflect] Is the home taking a whole-system approach to environmental sustainability? ` +
        `Beyond individual initiatives, are energy use, water consumption, waste generation, and ` +
        `transport emissions being monitored holistically? CHR 2015 Reg 25 requires premises to be ` +
        `well-maintained, and a sustainable approach to building management — including insulation, ` +
        `renewable energy, and efficient heating — directly supports both environmental goals and ` +
        `the comfort and wellbeing of children living in the home.`,
    );
  }

  return insights;
}

// -- CRUD ---------------------------------------------------------------------

export async function listRecords(
  homeId: string,
  filters?: {
    focusArea?: FocusArea;
    currentStatus?: CurrentStatus;
    responsiblePerson?: string;
    limit?: number;
  },
): Promise<ServiceResult<EnvironmentalSustainabilityRow[]>> {
  if (!isSupabaseEnabled()) return { ok: true, data: [] };

  const client = await createServerClient();
  if (!client) return { ok: true, data: [] };

  let q = (client.from("cs_environmental_sustainability") as SB)
    .select("*")
    .eq("home_id", homeId);

  if (filters?.focusArea) q = q.eq("focus_area", filters.focusArea);
  if (filters?.currentStatus) q = q.eq("current_status", filters.currentStatus);
  if (filters?.responsiblePerson) q = q.eq("responsible_person", filters.responsiblePerson);

  q = q.order("audit_date", { ascending: false }).limit(filters?.limit ?? 200);

  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function getRecord(
  id: string,
): Promise<ServiceResult<EnvironmentalSustainabilityRow>> {
  if (!isSupabaseEnabled()) return { ok: false, error: "Supabase not configured" };

  const client = await createServerClient();
  if (!client) return { ok: false, error: "Supabase not configured" };

  const { data, error } = await (client.from("cs_environmental_sustainability") as SB)
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function createRecord(input: {
  homeId: string;
  auditDate: string;
  auditorName: string;
  focusArea: FocusArea;
  currentStatus: CurrentStatus;
  targetDate?: string | null;
  actualCompletionDate?: string | null;
  estimatedCarbonSavingKg?: number | null;
  estimatedCostSaving?: number | null;
  investmentRequired?: number | null;
  youngPeopleInvolved?: boolean;
  educationalComponent?: boolean;
  communityBenefit?: boolean;
  evidenceAttached?: boolean;
  responsiblePerson: string;
  reviewDate?: string | null;
  notes?: string | null;
}): Promise<ServiceResult<EnvironmentalSustainabilityRow>> {
  if (!isSupabaseEnabled()) return { ok: false, error: "Supabase not configured" };

  const validation = validateEnvironmentalSustainability({
    auditDate: input.auditDate,
    auditorName: input.auditorName,
    focusArea: input.focusArea,
    currentStatus: input.currentStatus,
    targetDate: input.targetDate,
    actualCompletionDate: input.actualCompletionDate,
    estimatedCarbonSavingKg: input.estimatedCarbonSavingKg,
    estimatedCostSaving: input.estimatedCostSaving,
    investmentRequired: input.investmentRequired,
    responsiblePerson: input.responsiblePerson,
    reviewDate: input.reviewDate,
  });
  if (!validation.valid) {
    return { ok: false, error: validation.errors.join("; ") };
  }

  const client = await createServerClient();
  if (!client) return { ok: false, error: "Supabase not configured" };

  const { data, error } = await (client.from("cs_environmental_sustainability") as SB)
    .insert({
      home_id: input.homeId,
      audit_date: input.auditDate,
      auditor_name: input.auditorName,
      focus_area: input.focusArea,
      current_status: input.currentStatus,
      target_date: input.targetDate ?? null,
      actual_completion_date: input.actualCompletionDate ?? null,
      estimated_carbon_saving_kg: input.estimatedCarbonSavingKg ?? null,
      estimated_cost_saving: input.estimatedCostSaving ?? null,
      investment_required: input.investmentRequired ?? null,
      young_people_involved: input.youngPeopleInvolved ?? false,
      educational_component: input.educationalComponent ?? false,
      community_benefit: input.communityBenefit ?? false,
      evidence_attached: input.evidenceAttached ?? false,
      responsible_person: input.responsiblePerson,
      review_date: input.reviewDate ?? null,
      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function updateRecord(
  id: string,
  updates: Partial<{
    auditDate: string;
    auditorName: string;
    focusArea: FocusArea;
    currentStatus: CurrentStatus;
    targetDate: string | null;
    actualCompletionDate: string | null;
    estimatedCarbonSavingKg: number | null;
    estimatedCostSaving: number | null;
    investmentRequired: number | null;
    youngPeopleInvolved: boolean;
    educationalComponent: boolean;
    communityBenefit: boolean;
    evidenceAttached: boolean;
    responsiblePerson: string;
    reviewDate: string | null;
    notes: string | null;
  }>,
): Promise<ServiceResult<EnvironmentalSustainabilityRow>> {
  if (!isSupabaseEnabled()) return { ok: false, error: "Supabase not configured" };

  const client = await createServerClient();
  if (!client) return { ok: false, error: "Supabase not configured" };

  const mapped: Record<string, unknown> = {};
  if (updates.auditDate !== undefined) mapped.audit_date = updates.auditDate;
  if (updates.auditorName !== undefined) mapped.auditor_name = updates.auditorName;
  if (updates.focusArea !== undefined) mapped.focus_area = updates.focusArea;
  if (updates.currentStatus !== undefined) mapped.current_status = updates.currentStatus;
  if (updates.targetDate !== undefined) mapped.target_date = updates.targetDate;
  if (updates.actualCompletionDate !== undefined) mapped.actual_completion_date = updates.actualCompletionDate;
  if (updates.estimatedCarbonSavingKg !== undefined) mapped.estimated_carbon_saving_kg = updates.estimatedCarbonSavingKg;
  if (updates.estimatedCostSaving !== undefined) mapped.estimated_cost_saving = updates.estimatedCostSaving;
  if (updates.investmentRequired !== undefined) mapped.investment_required = updates.investmentRequired;
  if (updates.youngPeopleInvolved !== undefined) mapped.young_people_involved = updates.youngPeopleInvolved;
  if (updates.educationalComponent !== undefined) mapped.educational_component = updates.educationalComponent;
  if (updates.communityBenefit !== undefined) mapped.community_benefit = updates.communityBenefit;
  if (updates.evidenceAttached !== undefined) mapped.evidence_attached = updates.evidenceAttached;
  if (updates.responsiblePerson !== undefined) mapped.responsible_person = updates.responsiblePerson;
  if (updates.reviewDate !== undefined) mapped.review_date = updates.reviewDate;
  if (updates.notes !== undefined) mapped.notes = updates.notes;

  mapped.updated_at = new Date().toISOString();

  const { data, error } = await (client.from("cs_environmental_sustainability") as SB)
    .update(mapped)
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function deleteRecord(
  id: string,
): Promise<ServiceResult<null>> {
  if (!isSupabaseEnabled()) return { ok: false, error: "Supabase not configured" };

  const client = await createServerClient();
  if (!client) return { ok: false, error: "Supabase not configured" };

  const { error } = await (client.from("cs_environmental_sustainability") as SB)
    .delete()
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}

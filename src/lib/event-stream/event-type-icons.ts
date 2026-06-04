// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EVENT TYPE ICONS
// Per-CornerstoneEvent-type lucide icon, so the unified timeline is scannable by
// domain (it already colours by risk). Exhaustive Record so a new event type is
// forced to declare an icon. Pure data module (no JSX) — call sites render the
// returned component: `const Icon = eventTypeIcon(e.eventType); <Icon ... />`.
// ══════════════════════════════════════════════════════════════════════════════

import type { LucideIcon } from "lucide-react";
import {
  BookOpen, AlertTriangle, ShieldAlert, Pill, MapPin, Hand, MessageSquare, GraduationCap,
  Stethoscope, MessageCircle, Heart, ClipboardList, Gavel, Bell, Activity, CalendarX,
  Clock, Users, Wrench, CheckSquare, Eye, FileText, Layers,
} from "lucide-react";
import type { CornerstoneEventType } from "@/types/cornerstone-event";

export const EVENT_TYPE_ICON: Record<CornerstoneEventType, LucideIcon> = {
  daily_log: BookOpen,
  incident: AlertTriangle,
  safeguarding: ShieldAlert,
  medication: Pill,
  missing: MapPin,
  physical_intervention: Hand,
  keywork: MessageSquare,
  education: GraduationCap,
  health: Stethoscope,
  complaint: MessageCircle,
  family_contact: Heart,
  risk_assessment: ClipboardList,
  lac_review: Gavel,
  notifiable_event: Bell,
  behaviour_support_plan: Activity,
  staff_absence: CalendarX,
  overtime: Clock,
  supervision: Users,
  maintenance: Wrench,
  qa_check: CheckSquare,
  reg44: Eye,
  reg45: FileText,
};

/** The icon for an event type; falls back to a generic layers glyph for unknown types. */
export function eventTypeIcon(type: string): LucideIcon {
  return EVENT_TYPE_ICON[type as CornerstoneEventType] ?? Layers;
}

// ── Domain category → icon colour (so the timeline groups visually by area, while
//    the card ring/badge still signals risk). Exhaustive: a new type must pick one.
export type EventCategory = "safeguarding" | "risk" | "child_family" | "health_education" | "governance";

export const EVENT_TYPE_CATEGORY: Record<CornerstoneEventType, EventCategory> = {
  incident: "safeguarding",
  safeguarding: "safeguarding",
  missing: "safeguarding",
  physical_intervention: "safeguarding",
  notifiable_event: "safeguarding",
  risk_assessment: "risk",
  behaviour_support_plan: "risk",
  daily_log: "child_family",
  keywork: "child_family",
  family_contact: "child_family",
  complaint: "child_family",
  medication: "health_education",
  health: "health_education",
  education: "health_education",
  lac_review: "governance",
  reg44: "governance",
  reg45: "governance",
  qa_check: "governance",
  supervision: "governance",
  staff_absence: "governance",
  overtime: "governance",
  maintenance: "governance",
};

const CATEGORY_ICON_CLASS: Record<EventCategory, string> = {
  safeguarding: "text-red-500",
  risk: "text-orange-500",
  child_family: "text-blue-500",
  health_education: "text-teal-500",
  governance: "text-slate-500",
};

/** Tailwind text-colour class for an event type's domain category (icon tint). */
export function eventTypeIconClass(type: string): string {
  const cat = EVENT_TYPE_CATEGORY[type as CornerstoneEventType];
  return cat ? CATEGORY_ICON_CLASS[cat] : "text-[var(--cs-text-muted)]";
}

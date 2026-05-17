// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone House Meetings & Children's Council — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateMeetingsCompliance,
  calculateHomeMeetingsMetrics,
  getMeetingTypeLabel,
  getActionStatusLabel,
} from "./house-meetings-engine";

export type {
  MeetingType,
  AgendaSource,
  ActionStatus,
  AttendanceStatus,
  AgendaItem,
  MeetingAction,
  MeetingAttendance,
  HouseMeeting,
  HomeMeetingsProfile,
  MeetingsComplianceResult,
  HomeMeetingsMetrics,
} from "./house-meetings-engine";

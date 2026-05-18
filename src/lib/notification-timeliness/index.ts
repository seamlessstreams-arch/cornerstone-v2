// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Notification Timeliness Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateEventTimeliness,
  calculateTimelinessMetrics,
  calculateScore,
  generateStrengths,
  generateAreasForImprovement,
  generateActions,
  generateNotificationTimelinessIntelligence,
  getDeadlineHours,
  getNotificationTypeCategory,
  getRequiredRecipients,
  getNotificationTypeLabel,
  getRecipientLabel,
  getRating,
  getRatingLabel,
} from "./notification-timeliness-engine";

export type {
  NotificationCategory,
  NotificationType,
  NotificationRecipient,
  NotificationStatus,
  NotifiableEvent,
  NotificationRecord,
  NotificationPolicy,
  NotificationAudit,
  EventTimelinessResult,
  TimelinessMetrics,
  TimelinessScoreBreakdown,
  Rating,
  NotificationTimelinessIntelligence,
} from "./notification-timeliness-engine";

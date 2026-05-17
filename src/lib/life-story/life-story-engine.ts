// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Life Story & Identity Work Engine
//
// Deterministic engine for evaluating life story work quality, identity
// support, cultural needs, and memory-keeping compliance.
//
// Aligned to:
//   - CHR 2015 Reg 5 — Quality and purpose of care (identity)
//   - CHR 2015 Reg 7 — Children's wishes and feelings
//   - CHR 2015 Reg 14 — Care planning (life story work in care plan)
//   - SCCIF — Identity and belonging, life story work
//   - UNCRC Article 8 — Right to identity
//   - UNCRC Article 30 — Right to culture, language, religion
//   - Children Act 1989 s.22(5)(c) — Cultural background
//
// Key requirements:
//   - Life story work accessible to every child
//   - Cultural identity supported (heritage, language, religion, food)
//   - Memory box/book maintained and regularly updated
//   - Identity needs in care plan and reviewed
//   - Child's wishes about identity respected
//   - Connections to birth family supported where safe
//   - Photographs and mementos preserved
//   - Age-appropriate life story tools used
//   - Regular sessions scheduled and attended
//   - Child's voice central to their narrative
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type IdentityCategory =
  | "heritage_culture"
  | "language"
  | "religion_faith"
  | "ethnicity"
  | "gender_identity"
  | "sexuality"
  | "disability"
  | "interests_talents"
  | "family_connections"
  | "community_belonging";

export type SessionType =
  | "life_story_book"
  | "memory_box"
  | "photograph_session"
  | "family_tree"
  | "timeline_work"
  | "identity_discussion"
  | "cultural_activity"
  | "letter_writing"
  | "creative_expression"
  | "other";

export type SessionStatus = "completed" | "scheduled" | "cancelled" | "child_declined";

export type EngagementLevel = "high" | "moderate" | "low" | "refused";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface LifeStorySession {
  id: string;
  childId: string;
  date: string;
  type: SessionType;
  status: SessionStatus;
  duration?: number;                       // minutes
  facilitatedBy: string;
  // Content
  topicsCovered: string[];
  childLedContent: boolean;
  childEngagement: EngagementLevel;
  childFeedback?: string;
  // Outputs
  addedToLifeStoryBook: boolean;
  addedToMemoryBox: boolean;
  photographsTaken: boolean;
  // Notes
  staffNotes?: string;
  followUpNeeded?: string;
}

export interface IdentityNeed {
  category: IdentityCategory;
  description: string;
  importance: "essential" | "important" | "desirable";
  currentlyMet: boolean;
  supportInPlace: string[];
  gaps: string[];
  childView?: string;
}

export interface FamilyConnection {
  id: string;
  relationship: string;                    // e.g. "Birth mother", "Maternal grandmother"
  contactArranged: boolean;
  contactFrequency?: string;               // e.g. "Monthly supervised", "Letters quarterly"
  safeToMaintain: boolean;
  childWishesToMaintain?: boolean;
  notes?: string;
}

export interface ChildLifeStoryProfile {
  childId: string;
  childName: string;
  homeId: string;
  dateOfBirth: string;
  // Life story work
  lifeStoryBookExists: boolean;
  lifeStoryBookLastUpdated?: string;
  memoryBoxExists: boolean;
  memoryBoxLastUpdated?: string;
  sessions: LifeStorySession[];
  // Identity
  identityNeeds: IdentityNeed[];
  identityInCarePlan: boolean;
  identityLastReviewed?: string;
  // Family
  familyConnections: FamilyConnection[];
  familyTreeCompleted: boolean;
  // Cultural
  culturalBackgroundRecorded: boolean;
  primaryLanguage: string;
  additionalLanguages: string[];
  religionOrFaith?: string;
  dietaryNeeds?: string;
  culturalActivitiesProvided: string[];
  // Photographs
  recentPhotographs: boolean;              // photos taken in last 3 months
  photoConsentObtained: boolean;
  // Child's voice
  childContributesToNarrative: boolean;
  childHasAccessToMaterials: boolean;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface LifeStoryComplianceResult {
  childId: string;
  childName: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  // Scores
  overallScore: number;                    // 0-100
  engagementScore: number;                 // 0-100
  identityScore: number;                   // 0-100
  memoryKeepingScore: number;              // 0-100
  // Life story work
  lifeStoryBookExists: boolean;
  lifeStoryBookCurrent: boolean;           // updated in last 3 months
  memoryBoxExists: boolean;
  sessionsLast3Months: number;
  averageEngagement: string;
  // Identity
  identityNeedsMet: number;                // % of needs currently met
  identityGaps: string[];
  culturalNeedsSupported: boolean;
  // Connections
  familyConnectionsActive: number;
  familyConnectionsSafe: number;
  familyTreeCompleted: boolean;
  // Timing
  daysSinceLastSession: number;
  sessionFrequencyAdequate: boolean;       // at least monthly
}

export interface HomeLifeStoryMetrics {
  homeId: string;
  // Coverage
  childrenWithLifeStoryBook: number;
  childrenWithMemoryBox: number;
  childrenWithRecentSession: number;       // in last month
  totalChildren: number;
  // Quality
  averageOverallScore: number;
  averageEngagementScore: number;
  sessionCompletionRate: number;           // completed vs scheduled
  childLedRate: number;                    // % child-led sessions
  // Identity
  identityInCarePlanRate: number;
  culturalNeedsSupportedRate: number;
  familyTreeCompletionRate: number;
  // Activity
  totalSessionsLast3Months: number;
  averageSessionsPerChild: number;
  mostCommonSessionType: string;
  // Issues
  complianceIssues: string[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const BOOK_CURRENCY_DAYS = 90;             // Life story book "current" if updated in 90 days
const SESSION_FREQUENCY_DAYS = 30;         // At least one session per month
const PHOTO_CURRENCY_DAYS = 90;

// ── Core: Evaluate Child Life Story Compliance ────────────────────────────

export function evaluateChildLifeStoryCompliance(
  profile: ChildLifeStoryProfile,
  now?: string,
): LifeStoryComplianceResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const ninetyDaysAgo = currentTime - BOOK_CURRENCY_DAYS * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = currentTime - SESSION_FREQUENCY_DAYS * 24 * 60 * 60 * 1000;

  const issues: string[] = [];
  const warnings: string[] = [];

  // Life story book
  const lifeStoryBookExists = profile.lifeStoryBookExists;
  if (!lifeStoryBookExists) {
    issues.push("Life story book not in place for child");
  }

  const lifeStoryBookCurrent = lifeStoryBookExists && !!profile.lifeStoryBookLastUpdated &&
    new Date(profile.lifeStoryBookLastUpdated).getTime() > ninetyDaysAgo;
  if (lifeStoryBookExists && !lifeStoryBookCurrent) {
    warnings.push("Life story book not updated in over 3 months");
  }

  // Memory box
  const memoryBoxExists = profile.memoryBoxExists;
  if (!memoryBoxExists) {
    warnings.push("Memory box not in place for child");
  }

  // Sessions
  const completedSessions = profile.sessions.filter(s => s.status === "completed");
  const threeMonthSessions = completedSessions.filter(
    s => new Date(s.date).getTime() > ninetyDaysAgo
  );
  const sessionsLast3Months = threeMonthSessions.length;

  // Days since last session
  const sortedSessions = completedSessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastSessionDate = sortedSessions[0]?.date;
  const daysSinceLastSession = lastSessionDate
    ? Math.round((currentTime - new Date(lastSessionDate).getTime()) / (24 * 60 * 60 * 1000))
    : 999;

  const sessionFrequencyAdequate = daysSinceLastSession <= SESSION_FREQUENCY_DAYS;
  if (!sessionFrequencyAdequate && completedSessions.length > 0) {
    warnings.push(`No life story session in ${daysSinceLastSession} days (target: monthly)`);
  }
  if (completedSessions.length === 0) {
    issues.push("No life story sessions recorded");
  }

  // Engagement
  const engagementMap: Record<EngagementLevel, number> = { high: 100, moderate: 70, low: 40, refused: 0 };
  const engagementScores = threeMonthSessions.map(s => engagementMap[s.childEngagement]);
  const engagementScore = engagementScores.length > 0
    ? Math.round(engagementScores.reduce((a, b) => a + b, 0) / engagementScores.length)
    : 0;

  const avgEngagementValues = threeMonthSessions.map(s => s.childEngagement);
  const averageEngagement = avgEngagementValues.length > 0
    ? getMostCommon(avgEngagementValues)
    : "none";

  // Identity needs
  const totalNeeds = profile.identityNeeds.length;
  const metNeeds = profile.identityNeeds.filter(n => n.currentlyMet).length;
  const identityNeedsMet = totalNeeds > 0
    ? Math.round((metNeeds / totalNeeds) * 100)
    : 100;

  const identityGaps = profile.identityNeeds
    .filter(n => !n.currentlyMet)
    .flatMap(n => n.gaps);

  if (!profile.identityInCarePlan) {
    issues.push("Identity needs not included in care plan");
  }

  // Cultural needs
  const culturalNeed = profile.identityNeeds.find(n => n.category === "heritage_culture");
  const culturalNeedsSupported = profile.culturalBackgroundRecorded &&
    (culturalNeed ? culturalNeed.currentlyMet : true);

  if (!profile.culturalBackgroundRecorded) {
    issues.push("Cultural background not recorded");
  }

  // Family connections
  const safeConnections = profile.familyConnections.filter(f => f.safeToMaintain);
  const activeConnections = safeConnections.filter(f => f.contactArranged);
  const familyConnectionsActive = activeConnections.length;
  const familyConnectionsSafe = safeConnections.length;

  if (safeConnections.length > 0 && activeConnections.length === 0) {
    warnings.push("No active family contact despite safe connections existing");
  }

  // Family tree
  if (!profile.familyTreeCompleted) {
    warnings.push("Family tree not completed");
  }

  // Photographs
  if (!profile.recentPhotographs) {
    warnings.push("No photographs taken in last 3 months");
  }

  // Child's voice
  if (!profile.childContributesToNarrative) {
    warnings.push("Child not contributing to their own narrative");
  }
  if (!profile.childHasAccessToMaterials) {
    issues.push("Child does not have access to their life story materials");
  }

  // Calculate scores
  const memoryKeepingScore = calculateMemoryKeepingScore(profile, lifeStoryBookCurrent);
  const identityScore = calculateIdentityScore(profile, identityNeedsMet, culturalNeedsSupported);
  const overallScore = Math.round(
    engagementScore * 0.25 +
    identityScore * 0.3 +
    memoryKeepingScore * 0.25 +
    (sessionFrequencyAdequate ? 100 : 40) * 0.2
  );

  return {
    childId: profile.childId,
    childName: profile.childName,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    overallScore,
    engagementScore,
    identityScore,
    memoryKeepingScore,
    lifeStoryBookExists,
    lifeStoryBookCurrent,
    memoryBoxExists,
    sessionsLast3Months,
    averageEngagement,
    identityNeedsMet,
    identityGaps,
    culturalNeedsSupported,
    familyConnectionsActive,
    familyConnectionsSafe,
    familyTreeCompleted: profile.familyTreeCompleted,
    daysSinceLastSession,
    sessionFrequencyAdequate,
  };
}

// ── Core: Calculate Home Life Story Metrics ───────────────────────────────

export function calculateHomeLifeStoryMetrics(
  profiles: ChildLifeStoryProfile[],
  homeId: string,
  now?: string,
): HomeLifeStoryMetrics {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const ninetyDaysAgo = currentTime - 90 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;

  const homeProfiles = profiles.filter(p => p.homeId === homeId);
  const totalChildren = homeProfiles.length;

  if (totalChildren === 0) {
    return {
      homeId,
      childrenWithLifeStoryBook: 0,
      childrenWithMemoryBox: 0,
      childrenWithRecentSession: 0,
      totalChildren: 0,
      averageOverallScore: 0,
      averageEngagementScore: 0,
      sessionCompletionRate: 100,
      childLedRate: 100,
      identityInCarePlanRate: 100,
      culturalNeedsSupportedRate: 100,
      familyTreeCompletionRate: 100,
      totalSessionsLast3Months: 0,
      averageSessionsPerChild: 0,
      mostCommonSessionType: "none",
      complianceIssues: [],
    };
  }

  const results = homeProfiles.map(p => evaluateChildLifeStoryCompliance(p, now));

  const childrenWithLifeStoryBook = homeProfiles.filter(p => p.lifeStoryBookExists).length;
  const childrenWithMemoryBox = homeProfiles.filter(p => p.memoryBoxExists).length;

  // Recent sessions
  const childrenWithRecentSession = homeProfiles.filter(p => {
    const completed = p.sessions.filter(s => s.status === "completed");
    return completed.some(s => new Date(s.date).getTime() > thirtyDaysAgo);
  }).length;

  // Scores
  const averageOverallScore = Math.round(
    results.reduce((s, r) => s + r.overallScore, 0) / results.length
  );
  const averageEngagementScore = Math.round(
    results.reduce((s, r) => s + r.engagementScore, 0) / results.length
  );

  // Session stats
  const allSessions = homeProfiles.flatMap(p => p.sessions);
  const recentSessions = allSessions.filter(s => new Date(s.date).getTime() > ninetyDaysAgo);
  const scheduled = recentSessions.filter(s => s.status === "completed" || s.status === "cancelled" || s.status === "child_declined");
  const completed = recentSessions.filter(s => s.status === "completed");
  const sessionCompletionRate = scheduled.length > 0
    ? Math.round((completed.length / scheduled.length) * 100)
    : 100;

  const childLed = completed.filter(s => s.childLedContent);
  const childLedRate = completed.length > 0
    ? Math.round((childLed.length / completed.length) * 100)
    : 100;

  const totalSessionsLast3Months = completed.length;
  const averageSessionsPerChild = totalChildren > 0
    ? Math.round((totalSessionsLast3Months / totalChildren) * 10) / 10
    : 0;

  // Most common session type
  const typeCounts: Record<string, number> = {};
  completed.forEach(s => { typeCounts[s.type] = (typeCounts[s.type] || 0) + 1; });
  const mostCommonSessionType = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "none";

  // Identity and cultural
  const identityInCarePlanRate = Math.round(
    (homeProfiles.filter(p => p.identityInCarePlan).length / totalChildren) * 100
  );
  const culturalNeedsSupportedRate = Math.round(
    (results.filter(r => r.culturalNeedsSupported).length / totalChildren) * 100
  );
  const familyTreeCompletionRate = Math.round(
    (homeProfiles.filter(p => p.familyTreeCompleted).length / totalChildren) * 100
  );

  // Compliance
  const complianceIssues = [...new Set(results.flatMap(r => r.issues))];

  return {
    homeId,
    childrenWithLifeStoryBook,
    childrenWithMemoryBox,
    childrenWithRecentSession,
    totalChildren,
    averageOverallScore,
    averageEngagementScore,
    sessionCompletionRate,
    childLedRate,
    identityInCarePlanRate,
    culturalNeedsSupportedRate,
    familyTreeCompletionRate,
    totalSessionsLast3Months,
    averageSessionsPerChild,
    mostCommonSessionType,
    complianceIssues,
  };
}

// ── Internal Helpers ──────────────────────────────────────────────────────

function calculateMemoryKeepingScore(profile: ChildLifeStoryProfile, bookCurrent: boolean): number {
  let score = 0;
  if (profile.lifeStoryBookExists) score += 30;
  if (bookCurrent) score += 20;
  if (profile.memoryBoxExists) score += 20;
  if (profile.recentPhotographs) score += 15;
  if (profile.familyTreeCompleted) score += 15;
  return score;
}

function calculateIdentityScore(
  profile: ChildLifeStoryProfile,
  identityNeedsMet: number,
  culturalNeedsSupported: boolean,
): number {
  let score = 0;
  score += identityNeedsMet * 0.4;            // 40% from needs met
  if (profile.identityInCarePlan) score += 20;
  if (culturalNeedsSupported) score += 20;
  if (profile.childContributesToNarrative) score += 10;
  if (profile.childHasAccessToMaterials) score += 10;
  return Math.round(score);
}

function getMostCommon(arr: string[]): string {
  const counts: Record<string, number> = {};
  arr.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "none";
}

// ── Label Helpers ────────────────────────────────────────────────────────

export function getSessionTypeLabel(type: SessionType): string {
  const labels: Record<SessionType, string> = {
    life_story_book: "Life Story Book",
    memory_box: "Memory Box",
    photograph_session: "Photograph Session",
    family_tree: "Family Tree",
    timeline_work: "Timeline Work",
    identity_discussion: "Identity Discussion",
    cultural_activity: "Cultural Activity",
    letter_writing: "Letter Writing",
    creative_expression: "Creative Expression",
    other: "Other",
  };
  return labels[type] ?? type;
}

export function getIdentityCategoryLabel(category: IdentityCategory): string {
  const labels: Record<IdentityCategory, string> = {
    heritage_culture: "Heritage & Culture",
    language: "Language",
    religion_faith: "Religion & Faith",
    ethnicity: "Ethnicity",
    gender_identity: "Gender Identity",
    sexuality: "Sexuality",
    disability: "Disability",
    interests_talents: "Interests & Talents",
    family_connections: "Family Connections",
    community_belonging: "Community Belonging",
  };
  return labels[category] ?? category;
}

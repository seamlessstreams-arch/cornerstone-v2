// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Children's Privacy & Confidentiality Engine
//
// Deterministic engine for evaluating privacy protections for looked-after
// children — ensuring personal information is safeguarded, dignity is
// maintained, and children have appropriate private space and communication.
//
// Aligned to:
//   - CHR 2015 Reg 21 — Privacy and access to information
//   - CHR 2015 Reg 10 — Contact between children and their families
//   - Data Protection Act 2018 / UK GDPR (children's data)
//   - UNCRC Article 16 — Right to privacy
//   - SCCIF — Children's dignity and privacy respected
//
// Key requirements:
//   - Children have private spaces (bedroom, storage, bathroom)
//   - Personal information shared only on need-to-know basis
//   - Children's files stored securely with restricted access
//   - Communication privacy (phone, letters, social media)
//   - Staff understand confidentiality boundaries
//   - GDPR-compliant data handling for children's records
//   - Children informed about what's recorded and why
//   - Private family contact facilitated
//   - Bedroom searches only when justified and documented
//   - Photography/social media consent (link to delegated authority)
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type PrivacyDomain =
  | "physical_space"           // bedroom, bathroom, private areas
  | "personal_belongings"      // storage, locks, room searches
  | "communications"           // phone calls, letters, email
  | "digital_privacy"          // devices, social media, browsing
  | "record_keeping"           // files, case notes, access
  | "information_sharing"      // who knows what about the child
  | "family_contact"           // private contact with family
  | "medical_information"      // health data confidentiality
  | "identity_data"            // care status, background
  | "photography_media";       // images, social media presence

export type ComplianceLevel = "fully_met" | "partially_met" | "not_met" | "not_assessed";

export type IncidentType =
  | "unauthorised_disclosure"   // information shared without consent
  | "room_search"              // bedroom/property search
  | "communication_monitored"  // calls/messages checked
  | "data_breach"              // personal data exposed
  | "privacy_invasion"         // entered room without knocking, etc.
  | "file_access_concern"      // records accessed without authority
  | "photography_without_consent";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface PrivacyAssessment {
  domain: PrivacyDomain;
  complianceLevel: ComplianceLevel;
  lastAssessedDate: string;
  assessedBy: string;
  findings: string;
  actions?: string[];
}

export interface PrivacyIncident {
  id: string;
  childId: string;
  date: string;
  type: IncidentType;
  description: string;
  reportedBy: string;
  severity: "low" | "medium" | "high";
  actionTaken: string;
  resolved: boolean;
  childInformed: boolean;
  notifiedTo?: string[];            // ICO, Ofsted, LA etc
}

export interface ChildPrivacyProfile {
  childId: string;
  childName: string;
  homeId: string;
  age: number;
  // Physical
  hasOwnBedroom: boolean;
  hasLockableStorage: boolean;
  hasBathroomPrivacy: boolean;
  bedroomKnockingPolicy: boolean;    // staff knock and wait
  // Digital
  hasOwnDevice: boolean;
  deviceMonitored: boolean;
  monitoringJustified: boolean;      // risk-based if monitored
  monitoringChildAware: boolean;
  // Records
  childAwareOfRecords: boolean;      // knows what's written
  childCanAccessOwnFile: boolean;    // can see their records
  recordsSecurelyStored: boolean;
  accessLogMaintained: boolean;
  // Information sharing
  needToKnowPolicyAdhered: boolean;
  childConsultedBeforeSharing: boolean;
  informationSharingProtocol: boolean;
  // Contact
  privatePhoneAccess: boolean;
  privateFamilyContact: boolean;
  mailNotOpened: boolean;             // post not intercepted
  // Assessments
  assessments: PrivacyAssessment[];
  // Incidents
  incidents: PrivacyIncident[];
  // Training
  staffPrivacyTrainingCurrent: boolean;
  // Child's views
  childFeelsPrivacyRespected: boolean | null;  // from consultation
  lastConsultationDate?: string;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface PrivacyComplianceResult {
  childId: string;
  childName: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  // Physical privacy
  physicalPrivacyScore: number;       // 0-100
  // Digital privacy
  digitalPrivacyScore: number;        // 0-100
  // Records & data
  dataProtectionScore: number;        // 0-100
  // Information sharing
  informationSharingScore: number;    // 0-100
  // Contact privacy
  contactPrivacyScore: number;        // 0-100
  // Overall
  overallPrivacyScore: number;        // 0-100
  // Incidents
  totalIncidents: number;
  unresolvedIncidents: number;
  highSeverityIncidents: number;
  // Assessment coverage
  domainsAssessed: number;
  totalDomains: number;
  assessmentCoverage: number;         // %
  // Child voice
  childConsulted: boolean;
  childFeelsRespected: boolean | null;
}

export interface HomePrivacyMetrics {
  homeId: string;
  totalChildren: number;
  // Scores
  averagePhysicalScore: number;
  averageDigitalScore: number;
  averageDataScore: number;
  averageOverallScore: number;
  // Issues
  childrenWithIssues: number;
  totalIncidents: number;
  unresolvedIncidents: number;
  // Policy
  staffTrainingCurrent: boolean;
  knockingPolicyRate: number;         // % with knocking policy
  ownBedroomRate: number;             // % with own room
  // Assessment
  averageAssessmentCoverage: number;
  // Compliance
  complianceIssues: string[];
  overallScore: number;
}

// ── Configuration ──────────────────────────────────────────────────────────

const ALL_DOMAINS: PrivacyDomain[] = [
  "physical_space", "personal_belongings", "communications", "digital_privacy",
  "record_keeping", "information_sharing", "family_contact", "medical_information",
  "identity_data", "photography_media",
];

// ── Core: Evaluate Child Privacy Compliance ─────────────────────────────────

export function evaluateChildPrivacyCompliance(
  profile: ChildPrivacyProfile,
  now?: string,
): PrivacyComplianceResult {
  const _currentTime = now ? new Date(now).getTime() : Date.now();
  const issues: string[] = [];
  const warnings: string[] = [];

  // Physical privacy (0-100)
  let physicalScore = 0;
  let physicalMax = 0;

  physicalMax += 30;
  if (profile.hasOwnBedroom) physicalScore += 30;
  else issues.push("Child does not have their own bedroom");

  physicalMax += 25;
  if (profile.hasLockableStorage) physicalScore += 25;
  else warnings.push("No lockable storage for personal belongings");

  physicalMax += 25;
  if (profile.hasBathroomPrivacy) physicalScore += 25;
  else issues.push("Bathroom privacy not adequately ensured");

  physicalMax += 20;
  if (profile.bedroomKnockingPolicy) physicalScore += 20;
  else issues.push("Staff knocking/waiting policy not in place");

  const physicalPrivacyScore = physicalMax > 0 ? Math.round((physicalScore / physicalMax) * 100) : 0;

  // Digital privacy (0-100)
  let digitalScore = 0;
  let digitalMax = 0;

  if (profile.hasOwnDevice) {
    digitalMax += 40;
    if (!profile.deviceMonitored) {
      digitalScore += 40; // no monitoring = full privacy
    } else if (profile.monitoringJustified && profile.monitoringChildAware) {
      digitalScore += 30; // justified + transparent
    } else if (profile.monitoringJustified) {
      digitalScore += 15; // justified but child unaware
      warnings.push("Device monitoring in place but child not fully informed");
    } else {
      issues.push("Device monitored without clear justification");
    }
  } else {
    digitalMax += 40;
    digitalScore += 20; // no device = neutral (may be age-appropriate)
  }

  digitalMax += 30;
  if (profile.privatePhoneAccess) digitalScore += 30;
  else warnings.push("Limited private phone access");

  digitalMax += 30;
  if (profile.mailNotOpened) digitalScore += 30;
  else issues.push("Child's mail/correspondence being opened");

  const digitalPrivacyScore = digitalMax > 0 ? Math.round((digitalScore / digitalMax) * 100) : 0;

  // Data protection (0-100)
  let dataScore = 0;
  let dataMax = 0;

  dataMax += 25;
  if (profile.recordsSecurelyStored) dataScore += 25;
  else issues.push("Children's records not securely stored");

  dataMax += 25;
  if (profile.accessLogMaintained) dataScore += 25;
  else warnings.push("File access log not maintained");

  dataMax += 25;
  if (profile.childAwareOfRecords) dataScore += 25;
  else warnings.push("Child not aware of what is recorded about them");

  dataMax += 25;
  if (profile.childCanAccessOwnFile) dataScore += 25;
  else warnings.push("Child cannot access their own records");

  const dataProtectionScore = dataMax > 0 ? Math.round((dataScore / dataMax) * 100) : 0;

  // Information sharing (0-100)
  let infoScore = 0;
  let infoMax = 0;

  infoMax += 40;
  if (profile.needToKnowPolicyAdhered) infoScore += 40;
  else issues.push("Need-to-know information sharing policy not adhered to");

  infoMax += 30;
  if (profile.childConsultedBeforeSharing) infoScore += 30;
  else warnings.push("Child not routinely consulted before information is shared");

  infoMax += 30;
  if (profile.informationSharingProtocol) infoScore += 30;
  else warnings.push("No written information sharing protocol");

  const informationSharingScore = infoMax > 0 ? Math.round((infoScore / infoMax) * 100) : 0;

  // Contact privacy (0-100)
  let contactScore = 0;
  let contactMax = 0;

  contactMax += 40;
  if (profile.privateFamilyContact) contactScore += 40;
  else issues.push("Private family contact not facilitated");

  contactMax += 30;
  if (profile.privatePhoneAccess) contactScore += 30;
  else { /* already warned above */ }

  contactMax += 30;
  if (profile.mailNotOpened) contactScore += 30;
  else { /* already flagged above */ }

  const contactPrivacyScore = contactMax > 0 ? Math.round((contactScore / contactMax) * 100) : 0;

  // Overall score (weighted average)
  const overallPrivacyScore = Math.round(
    (physicalPrivacyScore * 0.25) +
    (digitalPrivacyScore * 0.2) +
    (dataProtectionScore * 0.2) +
    (informationSharingScore * 0.2) +
    (contactPrivacyScore * 0.15)
  );

  // Incidents
  const totalIncidents = profile.incidents.length;
  const unresolvedIncidents = profile.incidents.filter(i => !i.resolved).length;
  const highSeverityIncidents = profile.incidents.filter(i => i.severity === "high").length;

  if (unresolvedIncidents > 0) {
    issues.push(`${unresolvedIncidents} unresolved privacy incident(s)`);
  }
  if (highSeverityIncidents > 0) {
    warnings.push(`${highSeverityIncidents} high-severity privacy incident(s) recorded`);
  }

  // Assessment coverage
  const domainsAssessed = profile.assessments.filter(a => a.complianceLevel !== "not_assessed").length;
  const totalDomains = ALL_DOMAINS.length;
  const assessmentCoverage = Math.round((domainsAssessed / totalDomains) * 100);

  if (assessmentCoverage < 80) {
    warnings.push(`Only ${assessmentCoverage}% of privacy domains assessed`);
  }

  // Staff training
  if (!profile.staffPrivacyTrainingCurrent) {
    warnings.push("Staff privacy/confidentiality training not current");
  }

  // Child consultation
  const childConsulted = profile.childFeelsPrivacyRespected !== null;
  if (!childConsulted) {
    warnings.push("Child not consulted about privacy experience");
  }

  return {
    childId: profile.childId,
    childName: profile.childName,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    physicalPrivacyScore,
    digitalPrivacyScore,
    dataProtectionScore,
    informationSharingScore,
    contactPrivacyScore,
    overallPrivacyScore,
    totalIncidents,
    unresolvedIncidents,
    highSeverityIncidents,
    domainsAssessed,
    totalDomains,
    assessmentCoverage,
    childConsulted,
    childFeelsRespected: profile.childFeelsPrivacyRespected,
  };
}

// ── Core: Calculate Home Privacy Metrics ─────────────────────────────────────

export function calculateHomePrivacyMetrics(
  profiles: ChildPrivacyProfile[],
  homeId: string,
  now?: string,
): HomePrivacyMetrics {
  const homeProfiles = profiles.filter(p => p.homeId === homeId);
  const totalChildren = homeProfiles.length;

  if (totalChildren === 0) {
    return {
      homeId,
      totalChildren: 0,
      averagePhysicalScore: 0,
      averageDigitalScore: 0,
      averageDataScore: 0,
      averageOverallScore: 0,
      childrenWithIssues: 0,
      totalIncidents: 0,
      unresolvedIncidents: 0,
      staffTrainingCurrent: true,
      knockingPolicyRate: 0,
      ownBedroomRate: 0,
      averageAssessmentCoverage: 0,
      complianceIssues: [],
      overallScore: 0,
    };
  }

  const results = homeProfiles.map(p => evaluateChildPrivacyCompliance(p, now));

  const averagePhysicalScore = Math.round(results.reduce((s, r) => s + r.physicalPrivacyScore, 0) / results.length);
  const averageDigitalScore = Math.round(results.reduce((s, r) => s + r.digitalPrivacyScore, 0) / results.length);
  const averageDataScore = Math.round(results.reduce((s, r) => s + r.dataProtectionScore, 0) / results.length);
  const averageOverallScore = Math.round(results.reduce((s, r) => s + r.overallPrivacyScore, 0) / results.length);

  const childrenWithIssues = results.filter(r => !r.isCompliant).length;
  const totalIncidents = results.reduce((s, r) => s + r.totalIncidents, 0);
  const unresolvedIncidents = results.reduce((s, r) => s + r.unresolvedIncidents, 0);

  const staffTrainingCurrent = homeProfiles.every(p => p.staffPrivacyTrainingCurrent);
  const knockingPolicyRate = Math.round(
    (homeProfiles.filter(p => p.bedroomKnockingPolicy).length / totalChildren) * 100
  );
  const ownBedroomRate = Math.round(
    (homeProfiles.filter(p => p.hasOwnBedroom).length / totalChildren) * 100
  );

  const averageAssessmentCoverage = Math.round(
    results.reduce((s, r) => s + r.assessmentCoverage, 0) / results.length
  );

  const complianceIssues = [...new Set(results.flatMap(r => r.issues))];

  return {
    homeId,
    totalChildren,
    averagePhysicalScore,
    averageDigitalScore,
    averageDataScore,
    averageOverallScore,
    childrenWithIssues,
    totalIncidents,
    unresolvedIncidents,
    staffTrainingCurrent,
    knockingPolicyRate,
    ownBedroomRate,
    averageAssessmentCoverage,
    complianceIssues,
    overallScore: averageOverallScore,
  };
}

// ── Label Helpers ────────────────────────────────────────────────────────

export function getPrivacyDomainLabel(domain: PrivacyDomain): string {
  const labels: Record<PrivacyDomain, string> = {
    physical_space: "Physical Space",
    personal_belongings: "Personal Belongings",
    communications: "Communications",
    digital_privacy: "Digital Privacy",
    record_keeping: "Record Keeping",
    information_sharing: "Information Sharing",
    family_contact: "Family Contact",
    medical_information: "Medical Information",
    identity_data: "Identity Data",
    photography_media: "Photography/Media",
  };
  return labels[domain] ?? domain;
}

export function getIncidentTypeLabel(type: IncidentType): string {
  const labels: Record<IncidentType, string> = {
    unauthorised_disclosure: "Unauthorised Disclosure",
    room_search: "Room Search",
    communication_monitored: "Communication Monitored",
    data_breach: "Data Breach",
    privacy_invasion: "Privacy Invasion",
    file_access_concern: "File Access Concern",
    photography_without_consent: "Photo Without Consent",
  };
  return labels[type] ?? type;
}

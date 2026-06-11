// ══════════════════════════════════════════════════════════════════════════════
// CARA — SAFER RECRUITMENT COMMAND DATA ASSEMBLY  (server-side)
// Shared by the command-centre GET route and the reminder-sync route so the
// candidate bundle is assembled one way, everywhere.
// ══════════════════════════════════════════════════════════════════════════════

import { db } from "@/lib/db/store";
import type { CommandCandidateInput } from "@/lib/engines/safer-recruitment-command-engine";

export function assembleCommandCandidates(): CommandCandidateInput[] {
  return db.candidateProfiles.findAll().map((profile) => ({
    profile,
    vacancy: profile.vacancy_id ? db.vacancies.findById(profile.vacancy_id) ?? null : null,
    checks: db.candidateChecks.findByCandidate(profile.id),
    references: db.candidateReferences.findByCandidate(profile.id),
    employment_history: db.employmentHistory.findByCandidate(profile.id),
    gaps: db.gapExplanations.findByCandidate(profile.id),
    interviews: db.candidateInterviews.findByCandidate(profile.id),
    offer: db.conditionalOffers.findByCandidate(profile.id) ?? null,
  }));
}

# ARIA Intelligence — Cornerstone's Operational AI Layer

Production-ready AI assistant for UK residential children's homes. Covers 96 commands across every module, universal approval workflow, safe context building, voice dictation, task creation, and full audit trail.

**Core Principle:** ARIA suggests. Humans decide. Cornerstone evidences.

---

## Architecture Overview

### Module Structure

```
src/
  types/aria-reports.ts              # 9 report types, 7 audiences, 6 statuses, 8 agents
  lib/aria/
    agents/agent-registry.ts         # 8 agent definitions with allowed/prohibited actions
    risk-tiers.ts                    # LOW/MEDIUM/HIGH classification (68 actions)
    ai/
      schemas.ts                     # Zod validation for all AI inputs/outputs
      safety.ts                      # 10 immutable safety rules, banned phrases, sanitisation
      provider.ts                    # Wraps ai-provider.service with safety + sanitisation
    writing/
      humanised-writing.ts           # Audience-specific writing prompts (7 audiences)
    evidence/
      evidence-retrieval.ts          # Queries 11+ tables in parallel, demo fallback
      index.ts                       # Barrel export
    reports/
      report-templates.ts            # Section definitions for all 9 report types
      report-generator.ts            # Full generation pipeline
      approval-workflow.ts           # State machine: draft -> pending_review -> approved -> locked -> archived
      reg45-linking.ts               # Map sections to Reg 45 categories
      index.ts                       # Barrel export
    challenge/
      challenge-mode.ts              # 12 rule-based checks + optional AI deep analysis
    audit/
      aria-audit.ts                  # Safe no-op audit writer
    __tests__/                       # 9 test files, 113 tests
  app/
    api/aria/                        # 10 API routes
    (platform)/aria/                 # 5 UI pages
```

### Database (Migration 021)

11 tables with RLS policies:

| Table | Purpose |
|-------|---------|
| `aria_agent_runs` | Tracks every agent execution |
| `aria_evidence_links` | Links agent runs to source records |
| `aria_drafts` | Generic AI-generated drafts |
| `child_reports` | Main report records |
| `child_report_sections` | Individual report sections |
| `child_report_evidence` | Evidence linked to sections |
| `child_report_actions` | Suggested follow-up actions |
| `aria_governance_settings` | Per-home configuration |
| `aria_prompt_templates` | Customisable prompt templates |
| `regulation45_evidence_items` | Reg 45 evidence bank |
| `aria_audit_events` | Full audit trail |

---

## Safety Rules

10 immutable rules hard-coded into `src/lib/aria/ai/safety.ts`:

1. ARIA must not make final decisions
2. ARIA must not diagnose children
3. ARIA must not invent evidence
4. ARIA must identify missing evidence
5. ARIA must write in UK professional language
6. ARIA must not blame children or staff
7. ARIA must not create unsupported safeguarding conclusions
8. ARIA must escalate high-risk themes
9. ARIA must maintain child-centred, trauma-informed wording
10. ARIA must keep reports factual, balanced and evidence-linked

### Output Sanitisation

Every AI output passes through `sanitiseOutput()` which:
- Strips 20 banned AI filler phrases
- Fixes 40+ Americanisms to UK English
- Cleans up artifacts from phrase removal
- Capitalises sentences after full stops

### Output Validation

`validateOutputSafety()` scans for:
- Diagnostic language (ADHD, conduct disorder, etc.)
- Blame language (manipulative, attention-seeking, non-compliant)
- Unsupported conclusions (clearly proves, without doubt, etc.)
- Possibly invented evidence (specific date references without source)

---

## Risk Tiers

| Tier | Actions | Governance |
|------|---------|------------|
| LOW (21 actions) | Language review, document classification | Audit only |
| MEDIUM (27 actions) | Evidence retrieval, report generation, oversight scanning | Evidence + confidence score + audit |
| HIGH (20 actions) | Safeguarding analysis, risk assessment, external reports | Manager approval + evidence + confidence + human review note + audit |

**Fail-safe:** Unknown actions default to HIGH risk.

---

## 8 Agents

| Agent | Risk Level | Human Approval |
|-------|-----------|---------------|
| Oversight | Medium | No |
| Safeguarding | High | Yes |
| Report Generator | Medium | No |
| Therapeutic Practice | Low | No |
| Risk Assessment | High | Yes |
| Regulation 45 Evidence | Medium | No |
| Workforce | Medium | No |
| Filing | Low | No |

Each agent has explicit `allowedActions` and `prohibitedActions`. No agent can delete data, send external communications, or approve reports.

---

## 9 Report Types

- Weekly Child Report (15 sections)
- Child Review Report
- Social Worker Update
- Monthly Progress Summary
- Risk Review Report
- Keywork Progress Report
- Placement Stability Report
- Education & Health Summary
- End of Placement / Transition Report

### 7 Audiences

Each report can be written for: Internal Manager, Social Worker, Parent/Family, Regulation 45, Ofsted Inspection, Staff Team, Child-Friendly.

---

## Approval Workflow

```
draft -> pending_review -> approved -> locked -> archived
                        \-> rejected -> draft (re-edit)
```

- **draft:** Editable, AI-generated content
- **pending_review:** Submitted for manager review
- **approved:** Manager has signed off
- **locked:** No further edits permitted, ready for distribution
- **archived:** Historical record

Invalid transitions throw with a descriptive error message.

---

## Challenge Mode

12 rule-based checks run against every draft:

1. Missing child voice in sections that require it
2. Weak evidence (not_enough_evidence or manager_input_required)
3. Missing manager oversight section
4. Incidents without documented follow-up actions
5. Risks without assessment references
6. Missing social worker notifications
7. No care plan implications documented
8. Repeated patterns across evidence
9. Safeguarding concerns requiring escalation
10. Missing required sections
11. Overly vague wording
12. Unsupported claims

Optional AI deep analysis runs when Supabase + AI are available.

Challenges are sorted by severity: critical > warning > info.

---

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/aria/reports/generate` | Generate a new report |
| GET | `/api/aria/reports/list` | List reports with filters |
| GET | `/api/aria/reports/[id]` | Get a single report |
| PUT | `/api/aria/reports/[id]` | Update a report section |
| POST | `/api/aria/reports/[id]/approve` | Approve or reject |
| POST | `/api/aria/reports/[id]/lock` | Lock a report |
| GET | `/api/aria/reports/[id]/challenge` | Run challenge mode |
| GET/POST | `/api/aria/reports/[id]/actions` | Get/create actions |
| POST | `/api/aria/reports/[id]/rewrite` | Rewrite a section |
| POST | `/api/aria/reports/[id]/reg45` | Link to Reg 45 |
| POST | `/api/aria/reports/[id]/file` | File to filing cabinet |
| GET | `/api/aria/dashboard` | Dashboard summary |

---

## Permissions

Added to `src/lib/permissions.ts`:

| Permission | Description |
|------------|-------------|
| `aria:view` | View ARIA reports and dashboard |
| `aria:generate` | Generate new reports |
| `aria:review` | Review and comment on reports |
| `aria:approve` | Approve or reject reports |
| `aria:lock` | Lock approved reports |
| `aria:configure` | Manage governance settings |
| `aria:highRiskAnalysis` | Access high-risk agent outputs |
| `reports:view` | View child reports |
| `reports:create` | Create child reports |
| `reports:review` | Review child reports |
| `reports:approve` | Approve child reports |
| `reports:lock` | Lock child reports |
| `reg45:evidence:create` | Create Reg 45 evidence items |

### Role Access

- **RI / RM:** Full access (all 13 permissions)
- **Deputy Manager:** View, generate, review + Reg 45 evidence
- **Team Leader:** View, generate + Reg 45 evidence
- **Care Worker:** View only

---

## UI Pages

| Route | Purpose |
|-------|---------|
| `/aria` | Redirects to `/aria/dashboard` |
| `/aria/dashboard` | 8-stat grid, recent reports, quick actions |
| `/aria/reports` | Reports list with type/status/search filters |
| `/aria/reports/new` | Report generation form |
| `/aria/reports/[reportId]` | Two-column review: sections + evidence/challenge/actions |
| `/aria/reg45` | Regulation 45 Evidence Bank with filters |
| `/management/aria` | Governance settings (toggles, agent access) |
| `/children/[childId]/reports` | Child-scoped reports list |
| `/children/[childId]/reports/new` | Child-scoped report generation |
| `/children/[childId]/intelligence` | Child intelligence overview |

### Filing Cabinet Integration

When a report is locked, it can be filed into the Cornerstone filing cabinet via `POST /api/aria/reports/[id]/file`. Filing paths follow the pattern `young-people/{child_id}/aria-reports/{report_type}/{date}`.

---

## Testing

```bash
# Run ARIA tests only
npx vitest run src/lib/aria/__tests__/

# Run all tests (PI + ARIA)
npx vitest run src/lib/practice-intelligence/__tests__/ src/lib/aria/__tests__/
```

10 test files, 123 tests covering:
- Risk tier classification (all 68 actions + fail-safe)
- Agent registry integrity (8 agents, role access, prohibited actions)
- AI safety rules and output sanitisation
- Approval workflow state machine
- Report templates (all 9 types, section ordering, uniqueness)
- Evidence retrieval (demo mode)
- Challenge mode (severity sorting, valid types)
- Humanised writing (audience prompts, style rules)
- Type system integrity (labels, counts, enums)
- Report filing integration (path building, demo mode)

---

## Environment Variables

No new environment variables required. ARIA Reports uses the existing AI provider configuration:

- `OPENAI_API_KEY` (optional)
- `ANTHROPIC_API_KEY` (optional)
- `GOOGLE_AI_API_KEY` (optional)

If no AI provider is configured, the stub fallback returns demo content.

---

## Design Decisions

1. **Fail-safe risk classification:** Unknown actions default to HIGH risk, never LOW.
2. **Demo mode everywhere:** Every service returns realistic demo data when Supabase is unavailable, enabling full UI preview without a database.
3. **Safety rules are immutable:** No governance setting, prompt template, or user action can weaken the 10 core safety rules.
4. **Americanism correction:** UK English is enforced at the output layer, not just the prompt layer.
5. **Separation of concerns:** Evidence retrieval, report generation, challenge mode, and approval workflow are independent modules that compose cleanly.
6. **Human-in-the-loop:** High-risk outputs require manager approval before they can be committed. The state machine enforces the correct sequence.

---

## ARIA Universal Command Layer

The universal command layer (built on top of the report system above) provides ARIA across every module in Cornerstone via a single entry point.

### Architecture

```
src/
  lib/aria/
    aria-types.ts                    # 96 AriaCommandIds, AriaCommandSpec, AriaGenerationResult
    aria-permissions.ts              # 18 permissions, 8 roles, RBAC matrix, checkAriaAccess()
    aria-provider.ts                 # OpenAI-first provider with stub fallback
    aria-service.ts                  # Command registry (96 commands), invokeAriaCommand(), applyApprovalDecision()
    aria-context-builder.ts          # Safe context builder — fetches records per module with permission gating
    writingStyleRules.ts             # Professional identity prompt, writing style, post-processor
  hooks/
    use-aria-command.ts              # Client hook: invoke() → POST, decide() → PATCH
    use-audio-recorder.ts            # MediaRecorder hook for dictation
  components/aria/
    aria-command-panel.tsx            # Universal command panel (searchable, module-filtered)
    aria-global-fab.tsx               # Floating action button — ARIA on every page
    aria-approval-card.tsx            # Full approval card with edit/approve/reject
    aria-human-review-banner.tsx      # Draft warning banner with high-risk variant
    aria-confidence-indicator.tsx     # Signal-bar confidence (low/medium/high)
    aria-audit-timeline.tsx           # Audit event timeline (13 event types)
    aria-task-creator.tsx             # Parse ARIA task suggestions, confirm/edit/create
    aria-microphone-button.tsx        # Drop-in mic button
    aria-dictation-panel.tsx          # Full dictation modal
    aria-panel.tsx                    # Legacy mode-based panel (Anthropic)
    index.ts                         # Barrel export
  app/api/aria/
    generate/route.ts                # POST invoke, PATCH decision
    transcribe/route.ts              # Audio transcription
    approve/route.ts                 # Approval convenience wrapper
    audit/route.ts                   # Audit event listing
    summarise/route.ts               # Summarise convenience wrapper
    rewrite/route.ts                 # Rewrite convenience wrapper
    suggest-actions/route.ts         # Extract actions wrapper
    create-tasks/route.ts            # Bulk task creation from ARIA output
```

### Database (Migration 022)

6 additional tables for the universal command layer:

| Table | Purpose |
|-------|---------|
| `aria_requests` | Every ARIA command invocation with context |
| `aria_outputs` | Generated drafts with full approval lifecycle |
| `aria_approvals` | Every approval/rejection/commit decision |
| `aria_transcriptions` | Voice transcription records |
| `aria_context_links` | Source records included in ARIA context |
| `aria_task_links` | Links ARIA outputs to created tasks |

### 96 Commands across 12 Groups

| Group | Count | Example Commands |
|-------|-------|-----------------|
| General Writing | 14 | improve_writing, summarise_text, extract_actions, check_tone |
| Children's Home Recording | 12 | draft_daily_log, draft_shift_summary, draft_child_voice_summary |
| Incidents | 9 | draft_incident_record, incident_risk_analysis, draft_safeguarding_referral_support |
| Management Oversight | 8 | draft_management_oversight, check_oversight_challenge, create_management_action_plan |
| RI / QA | 9 | regulation_44_summary, regulation_45_summary, prepare_ofsted_readiness_summary |
| HR | 10 | draft_supervision_notes, check_hr_fairness_and_tone, check_union_sensitive_wording |
| Safer Recruitment | 9 | check_employment_gaps, draft_interview_questions, safer_recruitment_checklist_review |
| Audits | 6 | analyse_audit_findings, create_audit_action_plan, check_overdue_audit_actions |
| Documents | 6 | summarise_uploaded_document, extract_document_actions, identify_document_risks |
| Tasks | 7 | create_task_from_incident, suggest_task_owner, escalate_overdue_task |
| Calendar | 6 | prepare_meeting_agenda, identify_upcoming_compliance_dates |

### 18 ARIA Permissions

| Permission | Description |
|------------|-------------|
| `aria.use` | Basic ARIA access |
| `aria.dictate` | Voice dictation |
| `aria.transcribe` | Audio transcription |
| `aria.generate_drafts` | Generate draft records |
| `aria.rewrite` | Improve/rewrite text |
| `aria.summarise` | Summarise and extract |
| `aria.analyse_risk` | Risk analysis (high-risk content) |
| `aria.view_sensitive_context` | View safeguarding context |
| `aria.create_tasks` | Create tasks from ARIA output |
| `aria.commit_to_records` | Write back to records |
| `aria.approve_outputs` | Approve ARIA drafts |
| `aria.reject_outputs` | Reject ARIA drafts |
| `aria.view_audit_logs` | View ARIA audit trail |
| `aria.admin_config` | ARIA configuration |
| `aria.hr` | HR-specific commands |
| `aria.recruitment` | Safer recruitment commands |
| `aria.ri_qa` | RI / QA commands |
| `aria.ofsted_readiness` | Ofsted readiness commands |

### 8 Roles

| Role | Key Grants |
|------|-----------|
| Registered Manager | All except admin_config |
| Responsible Individual | All analysis + HR + recruitment + RI/QA |
| Deputy Manager | Drafts + tasks + approval |
| Team Leader | Drafts + tasks |
| Residential Support Worker | Basic use + dictation + drafts |
| HR Admin | HR + recruitment + tasks |
| Auditor | Summarise + audit logs + RI/QA |
| Viewer | Basic use only |

### Safe Context Builder

`aria-context-builder.ts` fetches operational records from 16+ source tables to enrich ARIA commands with real data:

- **Permission-gated**: Each source checks the actor's permissions before fetching
- **Module-scoped**: Only fetches tables relevant to the active module
- **Summarised**: Raw records are summarised before reaching the LLM — no raw PII
- **Audited**: Every context record is logged in `aria_context_links`
- **Significance-ranked**: Critical/significant records surface first

Source tables include: daily_log_entries, incidents, key_work_sessions, voice_records, chronology_entries, young_people, handovers, staff_members, supervisions, training_records, qa_audits, home_climate_snapshots, pattern_alerts, documents, tasks.

### Approval Lifecycle (Universal)

```
draft → edited → submitted_for_approval → approved → committed
                                        ↘ rejected → archived
                                        ↘ withdrawn → archived
```

### Task Creation from ARIA

ARIA commands with `canCreateTasks: true` produce structured task suggestions. The `AriaTaskCreator` component parses these and lets the manager:
- Review each suggested task
- Edit title, description, priority before creating
- Create individual tasks or bulk-create all
- Skip tasks they don't want
- Tasks are created via `/api/v1/tasks` with `auto_generated: true` and linked back to the ARIA output via `aria_task_links`

### Global Access

`AriaGlobalFab` provides a floating ARIA button on every platform page. It:
- Auto-detects the current module from the URL
- Filters available commands to the current module
- Opens a slide-out drawer with the full AriaCommandPanel
- Works as a bottom sheet on mobile

### Voice Dictation

Full MediaRecorder-based dictation with:
- Real-time recording with visual feedback
- Server-side transcription via OpenAI gpt-4o-transcribe
- 10MB file size limit, WAV/WebM/MP3 support
- Transcript insertion into any text field

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENAI_API_KEY` | — | OpenAI provider (primary) |
| `ARIA_PROVIDER` | `openai` | Provider selection |
| `ARIA_TEXT_MODEL` | `gpt-4.1-mini` | Text generation model |
| `ARIA_TRANSCRIBE_MODEL` | `gpt-4o-transcribe` | Audio transcription model |
| `ARIA_MAX_AUDIO_MB` | `10` | Max audio upload size |

### Testing

```bash
# Run all ARIA tests
npx vitest run src/lib/aria/__tests__/

# Full test suite
npx vitest run
```

34 test files, 439 tests covering:
- Command registry integrity (96 commands, all fields, all groups)
- Permission model (18 permissions, 8 roles, RBAC matrix)
- Invoke pipeline (valid/invalid commands, permissions, confidence)
- Context builder (module resolution, source configs, significance, snippets)
- Task parser (numbered lists, metadata extraction, safeguarding detection)
- Audit writer (no-throw on disabled Supabase)
- Report system (templates, approval, challenge, evidence, filing)
- Safety rules and sanitisation

# Cara — Deterministic Degradation (working without AI)

## Why this exists

Production has an `ANTHROPIC_API_KEY`, but the Anthropic account's **credit balance
is exhausted** — every AI call returns HTTP 400. Cara is **deterministic-first**:
when AI is unavailable, no feature should error or render a blank panel. It should
degrade to real deterministic content where that's safe, or to an honest message
where producing content would mean fabricating analysis about a real child.

This is a *different* failure mode from "no key configured": with a key present but
no credits, the provider **call fails** rather than being skipped — so degradation
happens on the call-failure path, not only the no-key path.

## The chokepoint: `src/app/api/v1/cara/route.ts`

`/api/v1/cara` is a single route with 60+ "modes". It degrades at three points,
all routing to `deterministicCaraResponse(mode, style)`:

1. **No-key branch** — `if (!hasAiKey && !streamMode)` (genuinely keyless envs).
2. **AI-failure catch block** — wraps the provider `messages.create`; on any throw
   (credits, rate limit, provider error) it serves the same deterministic response.
   *This is the path that fires in production.*
3. **Streaming "refused" handler** — emits a calm text delta (never an empty stream)
   for streaming callers (the `CaraPanel`/`useCaraStream`). For
   `staff_development_summary` it streams a real deterministic summary.

`deterministicCaraResponse` dispatches in this order: inline JSON builders →
`buildDeterministicLearning(mode)` → `buildDeterministicIntelligence(mode)` →
`voice_summary` text → `staff_development_summary` text → generic message.

## Treatment by category

| Category | Treatment | Why |
|---|---|---|
| Computed-from-data (pattern_scan, staff_development_summary) | **Real** content from the matching engine | The data exists deterministically |
| Generic good practice (Learning Studio ×10, keywork_session_plan, practice_bank) | **Real** evergreen content (trauma-informed/PACE/safeguarding) | Educational content isn't a judgement about a child |
| Statutory FORMS (Reg 45, RI strategic/Ofsted/challenge, situation_review, generate_oversight) | **Honest scaffold** the practitioner completes | The evaluative judgement is the human's, never Cara's |
| Scoring (compute_experience_snapshot, compute_home_climate) | **Neutral defaults** (50/70) + an explicit "placeholder, not an assessment" narrative | The prompts themselves default neutral on missing evidence |
| Child/record-specific analysis (voice_summary, livers_*, interactive_session_summary) | **Honest "unavailable — review the records"** | Fabricating a child's voice/analysis would misrepresent them |
| Extraction (document_classify, document_to_form) | **Honest "couldn't auto-extract — enter manually"** | No document parse is possible without AI |

### Hard safety rules (never break these)

- **Never fabricate** a child's voice, a wellbeing/risk score, an evaluative
  judgement, or an escalation decision. `livers_escalation` defaults to *human
  oversight* (`management_oversight_required: true`), never a fabricated emergency.
- **Cara never predicts an Ofsted grade** — `ri_ofsted_readiness` always returns
  `headline_judgement_prediction: "unknown"` with a rationale.
- An empty deterministic scan ≠ "no concern" — say so (e.g. `check_missing_evidence`).

## Where the fallbacks live

- `src/lib/cara/deterministic-learning.ts` — 10 Learning Studio modes (`buildDeterministicLearning`).
- `src/lib/cara/deterministic-intelligence.ts` — 13 intelligence modes (`buildDeterministicIntelligence`).
- Inline in `route.ts` — `deterministicPatternScan`, `deterministicReturnHomeInterview`,
  `deterministicSafeguardingScan`, `deterministicReg45Report`, `deterministicRiStrategicAnalysis`,
  `deterministicRiOfstedReadiness`, `deterministicRiChallengeQuestion`,
  `deterministicStaffDevelopmentSummary`, and the `voice_summary` text handler.

Per-feature (outside `/cara`): `writing-assistant/rewrite` (deterministic-rewrite floor),
`interview-pack/ai-questions`, `reflective-supervision/ai-prompts`, `cara-incident/*`,
`cara-recording-assistant`, `cv-profile`, `manager-assistant` (all degrade via the
gateway's `llmUsed:false`); `cara-studio/generate` degrades to demo content; `cara/chat`
throws on a non-OK upstream and serves an honest message.

## Adding a deterministic fallback for a new mode

1. **Read the consuming page first.** The page's actual shape can differ from the
   prompt's JSON schema (e.g. the document wizard reads `formResult.fields`, not the
   prompt's `extracted_fields`; oversight-radar expects `parsed` to be an *array*,
   not `{items}`). Match the **consumer**, not the prompt.
2. **Populate every array the page `.map()`s unguarded** (empty is safe; `undefined`
   crashes).
3. Decide the treatment from the table above. If it would mean fabricating analysis
   about a real child, return an honest scaffold — do not invent content.
4. Add a builder, wire it into `deterministicCaraResponse`, and add a contract test
   (`src/lib/cara/__tests__/deterministic-*.test.ts`).

## Modes intentionally without a fallback

- `document_intel` — its page (`dashboard/document-analysis`) uses its own shape and
  already self-handles failure with a local demo fallback.
- `recommendations`, `rewrite` — no breaking `/cara` consumer (the drawer's rewrite
  goes through `/api/v1/cara/chat`; recommendations' UI uses a different endpoint).
- Free-text analytical modes (`what_changed`, `inspection_narrative`,
  `decision_support`, …) degrade to the generic message — producing their content
  deterministically would mean fabricating analysis.

## Restoring real AI

Top up the Anthropic account credit balance. Nothing in the code needs to change —
the AI path resumes automatically and the deterministic fallbacks step back to being
the safety net.

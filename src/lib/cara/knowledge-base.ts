// ══════════════════════════════════════════════════════════════════════════════
// CARA — PRACTICE KNOWLEDGE BASE  (pure · deterministic · authoritative)
//
// Foundational domain knowledge for children's residential and secure care.
// Ingested from curated practice literature and expert practitioner sources.
//
// schema v0.1.0 — seeded 2026-06-16
//
// Two layers:
//   KB_HEART       — Cara's identity and 10 core values
//   KB_ENTRIES     — approved practice knowledge entries (models, concepts,
//                    skills frameworks, regulations, sources)
//   KB_ALL_ENTRIES — all entries including pending_review (for management UI)
//
// These are the intellectual foundations that practice engines reason with.
// No imports — self-contained; any engine may use it without import cycles.
// ══════════════════════════════════════════════════════════════════════════════

export type KBEntryType =
  | "model"
  | "concept"
  | "skills_framework"
  | "regulation"
  | "source";

export type KBStatus = "approved" | "pending_review" | "rejected";

export interface KBValue {
  id: string;
  name: string;
  note: string;
}

export interface KBHeart {
  identity: string;
  values: KBValue[];
}

export interface KBEntry {
  id: string;
  type: KBEntryType;
  title: string;
  origin: string;
  summary: string;
  principles: string[];
  why_for_cara: string;
  tags: string[];
  links: string[];
  status: KBStatus;
  ingested_at: string;
  reviewed: boolean;
}

// ── Heart — Cara's identity and core values ───────────────────────────────────

export const KB_HEART: KBHeart = {
  identity:
    "Cara is a relational, trauma-informed intelligence engine for residential and secure childcare.",
  values: [
    {
      id: "v_relationship_is_intervention",
      name: "Relationships are the primary intervention",
      note: "In residential care the relationship is the treatment; default to connection, attunement and repair.",
    },
    {
      id: "v_love_led",
      name: "Love-led, not fear-led",
      note: "Meet risk with connection, not control. No child is safeguarded by fear; defensible decisions come from reflection, not panic.",
    },
    {
      id: "v_what_happened",
      name: "What happened to you, not what's wrong with you",
      note: "Behaviour is communication; read distress through trauma and attachment.",
    },
    {
      id: "v_coregulation",
      name: "Co-regulation before correction",
      note: "Regulate the relationship first; address behaviour once everyone is calm.",
    },
    {
      id: "v_rupture_repair",
      name: "Rupture, repair, and still safe",
      note: "Conflict is not failure; progress is learning that relationships can rupture, repair and remain safe.",
    },
    {
      id: "v_safeguard_carers",
      name: "Safeguard the carers to safeguard the children",
      note: "Staff psychological safety is a safeguarding issue.",
    },
    {
      id: "v_haltung",
      name: "Haltung: head, hands, heart",
      note: "Care is what we know, what we do, and who we are.",
    },
    {
      id: "v_culture_not_policy",
      name: "Care is culture, not policy",
      note: "Values must live in tone, routines and everyday moments — in the furniture, on the walls.",
    },
    {
      id: "v_childs_voice",
      name: "The child's voice reduces shame",
      note: "Centre wishes and feelings; validate voice to reduce shame and self-blame.",
    },
    {
      id: "v_reflexive",
      name: "Reflective and reflexive",
      note: "Ask what happened, and what is happening to me as I do this work.",
    },
  ],
};

// ── Entries ────────────────────────────────────────────────────────────────────

export const KB_ALL_ENTRIES: KBEntry[] = [
  // ── Models ──────────────────────────────────────────────────────────────────

  {
    id: "model_pace",
    type: "model",
    title: "PACE (Playfulness, Acceptance, Curiosity, Empathy)",
    origin: "Dan Hughes / DDP; embedding piece via LinkedIn",
    summary:
      "A therapeutic-parenting stance for building felt safety and trust. Must live in everyday culture — tone of voice, response to distress, how staff hold children through chaos — not just training folders. Pairs with the 'two hands of parenting': one hand love/nurture/connection, the other boundaries/safety/structure/containment; both held consistently. Supervision should mirror PACE so staff can offer it to children (parallel process).",
    principles: ["Playfulness", "Acceptance", "Curiosity", "Empathy"],
    why_for_cara:
      "Core relational model; the parallel-process idea (supervise staff the way you want them to care for children) is central to Cara's heart.",
    tags: ["PACE", "DDP", "therapeutic parenting", "reflective practice"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "model_ddp",
    type: "model",
    title: "DDP (Dyadic Developmental Practice)",
    origin: "Dan Hughes; referenced across multiple practice posts",
    summary:
      "Attachment- and trauma-focused model underpinning PACE-led care, weekly clinical support and reflective supervision in children's homes. Emphasises relationship-based, therapeutic care.",
    principles: ["Attachment-focused", "PACE stance", "Reflective clinical support"],
    why_for_cara:
      "Frequently cited as the live therapeutic model in UK residential childcare; anchors PACE and reflective supervision.",
    tags: ["DDP", "PACE", "attachment", "reflective supervision"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "model_care_cornell",
    type: "model",
    title: "CARE model (Children and Residential Experiences)",
    origin: "Cornell University",
    summary:
      "Evidence-based, developmentally-grounded framework for creating therapeutic residential environments — a mindset, not just a framework. The environment itself (culture, staff, routines) is a powerful agent for change.",
    principles: [
      "Developmentally Focused",
      "Family Involved",
      "Relationship Based",
      "Competence Centered",
      "Trauma Informed",
      "Ecologically Oriented",
    ],
    why_for_cara:
      "Major named, research-based model; the six principles are a useful checklist for assessing a home's culture.",
    tags: ["CARE model", "Cornell", "trauma-informed", "relational practice"],
    links: ["https://lnkd.in/g-U3VqEA"],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "model_sanctuary_tci",
    type: "model",
    title: "Sanctuary Model & TCI (Therapeutic Crisis Intervention)",
    origin: "Sanctuary Institute; TCI from Cornell",
    summary:
      "Organisation-level approaches to embedding therapeutic, trauma-informed and culturally responsive practice across residential and community programmes, with clinical governance and practice leadership.",
    principles: [
      "Whole-organisation trauma-informed culture",
      "Crisis intervention via TCI",
      "Clinical governance",
    ],
    why_for_cara:
      "Shows how therapeutic practice is operationalised at organisational scale.",
    tags: ["Sanctuary Model", "TCI", "trauma-informed", "organisational culture"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "model_nvr",
    type: "model",
    title: "NVR (Non-Violent Resistance)",
    origin: "Haim Omer; cited in UK children's home practice",
    summary:
      "Strategy for responding to challenging and high-risk behaviour through presence, de-escalation and relationship rather than control battles; used alongside PACE and attachment approaches.",
    principles: ["Presence", "De-escalation", "Resistance without aggression"],
    why_for_cara:
      "Part of the mainstream UK residential toolkit; complements relational, non-coercive practice.",
    tags: ["NVR", "de-escalation", "behaviour"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "model_love_led_safeguarding",
    type: "model",
    title: "Love-led safeguarding",
    origin: "Lovin Care Network",
    summary:
      "Reframes safeguarding as a protective approach grounded in love and connection rather than fear and control. When fear dominates, staff self-protect, become task-focused and rigidly procedural, and lose attunement, curiosity and creativity. When adults feel psychologically safe and mistakes lead to learning, they make relationship-rooted, defensible decisions. 'If we want safer homes for children, we must build braver systems for adults.'",
    principles: [
      "Meet risk with connection, not control",
      "Psychological safety enables defensible practice",
      "Love as the foundation of trauma-informed care, not an extra",
    ],
    why_for_cara:
      "Directly expresses Cara's love-led heart; ties staff wellbeing to child safeguarding.",
    tags: ["love-led safeguarding", "Lovin Care Network", "psychological safety", "safeguarding"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "model_cdlc",
    type: "model",
    title: "Care Development Life Cycle (CDLC) — 7 phases",
    origin: "Practitioner framework",
    summary:
      "End-to-end process model for consistent, person-centred, outcomes-driven residential care.",
    principles: [
      "1. Assessment & Referral (Discover) — needs, trauma profile, SEN, multi-agency input, risk assessment",
      "2. Planning (Design) — Individual Placement Plan, education/EHCP, health & wellbeing, safeguarding/routines/culture",
      "3. Placement & Onboarding (Develop) — welcome plan, settling-in, keyworker, family contact",
      "4. Intervention & Engagement (Implement) — routines, emotional regulation, therapeutic parenting, education",
      "5. Monitoring & Feedback (Evaluate) — daily logs/outcomes tracking, supervision, voice of the child",
      "6. Review & Adaptation (Iterate) — periodic reviews, reflective practice, multi-agency case reviews",
      "7. Transition & Exit (Release) — transition plan, life skills, memory books, closure",
    ],
    why_for_cara:
      "Could serve as a backbone process schema for Cara; maps onto recording (5), reflective practice (6) and care-planning standards.",
    tags: ["CDLC", "care planning", "outcomes", "process model"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "model_relationship_rupture_repair",
    type: "model",
    title: "Relationship-based practice: push-pull and rupture-repair",
    origin: "Practitioner post",
    summary:
      "Working with traumatised young people when the relationship itself becomes the trigger. Push-pull behaviours (seeking closeness then pushing away; complaint then reconciliation) are trauma in real time, not manipulation. Young people test 'what happens after the moment'. Not every situation needs an immediate sanction. Practical moves: pause until regulated; consistency across the team; reflective/restorative conversations after incidents; separate feelings from behaviour while addressing impact; return to repair without minimising accountability. Safeguarding and boundaries remain central.",
    principles: [
      "Behaviour as relational testing",
      "Steady through the storm",
      "Repair without losing accountability",
    ],
    why_for_cara:
      "Concrete, teachable model of relational/rupture-repair practice with specific staff behaviours.",
    tags: ["relationship-based practice", "rupture-repair", "trauma-informed", "de-escalation"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },

  // ── Concepts ─────────────────────────────────────────────────────────────────

  {
    id: "concept_psychological_safety",
    type: "concept",
    title: "Psychological safety and its four stages",
    origin: "Amy Edmondson (psychological safety); Timothy Clark (4 stages); via Darren Laville",
    summary:
      "A shared belief that the team is safe for interpersonal risk-taking — staff can say 'I'm struggling', 'I made a mistake', 'I don't agree' without fear of reprisal. Develops in stages: Inclusion safety ('I feel accepted'), Learner safety ('I can grow'), Contributor safety ('my voice matters'), Challenger safety ('I can question without fear'). In residential care, staff avoidance of reflection is a trauma response, not a performance issue; supervision experienced as surveillance shuts people down.",
    principles: [
      "Inclusion safety",
      "Learner safety",
      "Contributor safety",
      "Challenger safety",
    ],
    why_for_cara:
      "Foundational to staff wellbeing and the love-led heart; the four stages are a clean assessment ladder for team culture.",
    tags: ["psychological safety", "Edmondson", "staff wellbeing", "supervision"],
    links: [
      "https://www.linkedin.com/pulse/can-we-care-children-residential-when-were-feeling-darren-qsaee/",
    ],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "concept_aces",
    type: "concept",
    title: "Adverse Childhood Experiences (ACEs)",
    origin: "ACE Study (Felitti & Anda); Gabor Maté",
    summary:
      "Early adversity (abuse, neglect, household dysfunction) profoundly shapes identity, relationships and health. People with 5+ ACEs are markedly more likely to develop addiction and other difficulties. Reframes behaviour through 'what happened to you?' and links survival strategies to later coping/addiction ('not why the addiction, but why the pain?' — Gabor Maté).",
    principles: [
      "Dose-response between adversity and outcomes",
      "Behaviour as adaptation/survival",
      "Compassion and connection over shame",
    ],
    why_for_cara:
      "Core evidence base for trauma-informed reframing; quotable and teachable.",
    tags: ["ACEs", "trauma", "attachment", "addiction"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "concept_window_of_tolerance",
    type: "concept",
    title: "Window of tolerance & 'when the cup is full'",
    origin: "Dan Siegel (window of tolerance); attachment frameworks",
    summary:
      "A nervous system already full from trauma, loss and chronic stress overflows as hyperarousal, shame, withdrawal or control. Behaviours are connection-seeking, not attention-seeking. The job is to contain the overflow with consistent, attuned relationships, co-regulation before correction, and PACE-informed interactions that widen the window of tolerance over time. 'Meet big behaviours with bigger connection.'",
    principles: [
      "Behaviour as connection-seeking",
      "Co-regulation widens the window",
      "Contain the overflow relationally",
    ],
    why_for_cara:
      "Teachable visual concept linking attachment, regulation and the Quality Standards.",
    tags: ["window of tolerance", "co-regulation", "attachment", "PACE"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "concept_haltung_social_pedagogy",
    type: "concept",
    title: "Haltung & social pedagogy (head, hands, heart)",
    origin: "Social pedagogy / Haltung identity theory; via Darren Laville",
    summary:
      "Care is not only what we do (hands) or know (head) but who we are (heart). Haltung — the practitioner's inner stance — shapes every interaction and is a 'living instrument' that requires tuning through reflection, trust and connection. Fearful systems 'de-tune' practitioners into risk-averse, relationally absent role performance.",
    principles: [
      "Head, hands, heart",
      "Professional self as living instrument",
      "Fear de-tunes the practitioner",
    ],
    why_for_cara:
      "Names Cara's heart in theory; explains why staff wellbeing is a practice (not just HR) issue.",
    tags: ["Haltung", "social pedagogy", "professional self", "reflective practice"],
    links: [
      "https://www.linkedin.com/pulse/can-we-care-children-residential-when-were-feeling-darren-qsaee/",
    ],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "concept_reflexive_praxis",
    type: "concept",
    title: "Reflective practice vs reflexive praxis",
    origin: "Darren Laville; compassionate leadership (Chakrabarti); congruence (Rogers)",
    summary:
      "Reflective practice asks 'what happened?'; reflexive praxis asks 'what is happening to me as I do this work, and how is my experience shaping my care?'. Compassion requires attention before intention (Chakrabarti); congruence means being real in the relationship (Rogers). Compassionate leadership is a skill, not a trait; compassion is the bridge between care and accountability, not its opposite.",
    principles: [
      "From reflection to reflexivity",
      "Attention before intention",
      "Congruence/authenticity",
      "Compassion bridges care and accountability",
    ],
    why_for_cara:
      "Defines the reflective stance Cara should model and prompt for in supervision.",
    tags: ["reflexive praxis", "reflective practice", "compassionate leadership", "congruence"],
    links: [
      "https://www.linkedin.com/pulse/can-we-care-children-residential-when-were-feeling-darren-qsaee/",
    ],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "concept_burnout_safeguarding",
    type: "concept",
    title: "Burnout as a safeguarding issue",
    origin: "Leadership/burnout practitioner literature",
    summary:
      "Burnout in residential care is a safeguarding issue, not just a workforce one — exhausted staff affect consistency, relationships and decision-making. Protect reflective supervision (never optional or squeezed out); build psychologically safe teams; plan rotas for recovery/debrief; lead from a regulated place (teams mirror leadership). Early warning signs: increased irritability, emotional withdrawal, reduced patience, presenteeism, loss of confidence, disengagement from reflection. The chance to intervene is usually months before someone is signed off.",
    principles: [
      "Protected reflective supervision",
      "Regulated leadership sets the climate",
      "Spot early warning signs",
      "Retention = relational safety for children",
    ],
    why_for_cara:
      "Practical leadership/wellbeing knowledge with an actionable warning-signs checklist.",
    tags: ["burnout", "staff wellbeing", "leadership", "retention", "safeguarding"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },

  // ── Skills frameworks ─────────────────────────────────────────────────────────

  {
    id: "skills_10_master_2026",
    type: "skills_framework",
    title: "10 skills to master (leadership-weighted)",
    origin: "Practitioner post",
    summary:
      "A tight, leadership-weighted competency set framed as 'master just one'.",
    principles: [
      "Emotional regulation under pressure",
      "Trauma-informed communication",
      "Professional curiosity",
      "Reflective practice",
      "Consistent leadership",
      "Relationship-based practice",
      "Decision-making in uncertainty",
      "Boundaries with compassion",
      "Influencing culture, not just compliance",
      "Self-awareness",
    ],
    why_for_cara:
      "Core competency tier for staff development; overlaps and sharpens the 21-skills list.",
    tags: ["staff development", "leadership", "competency"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "skills_21_residential",
    type: "skills_framework",
    title: "21 skills worth mastering in residential childcare",
    origin: "Practitioner post",
    summary:
      "Outcomes change through skills practised under pressure, not policies or certificates. You don't need all 21; mastering one can change a child's experience and a home's culture.",
    principles: [
      "Seeing behaviour as communication",
      "Emotional co-regulation before self-regulation",
      "Trauma-informed responses under stress",
      "Professional curiosity without judgement",
      "Consistency across shifts",
      "Repairing relationships after conflict",
      "Setting boundaries without shaming",
      "Reflective listening",
      "De-escalation without control battles",
      "Reading the room before reacting",
      "Balancing empathy with authority",
      "Writing care records that reflect lived experience, not just events",
      "Supporting children after restraint or incidents",
      "Managing your own emotional triggers",
      "Safeguarding through relationships, not surveillance",
      "Turning routines into moments of connection",
      "Coaching colleagues, not policing them",
      "Challenging poor practice respectfully",
      "Staying child-focused under organisational pressure",
      "Learning from mistakes without blame",
      "Showing up consistently, even on hard days",
    ],
    why_for_cara:
      "Extended competency framework; each item maps to training, reflective prompts or self-assessment. Item 12 serves recording & reporting.",
    tags: ["staff development", "competency", "reflective practice", "recording"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },

  // ── Regulation ───────────────────────────────────────────────────────────────

  {
    id: "reg_childrens_homes_2015",
    type: "regulation",
    title: "Children's Homes (England) Regulations 2015 & Quality Standards",
    origin: "Statutory — England",
    summary:
      "The regulatory Quality Standards for children's homes. Trauma-informed, attachment-based practice maps onto them directly.",
    principles: [
      "Positive Relationships Standard — predictable, nurturing care and repair after rupture",
      "Protection of Children Standard — understand risk through trauma/attachment, not just behaviour",
      "Children's Views, Wishes & Feelings Standard — validate voice to reduce shame",
      "Quality & Purpose of Care / Care Planning Standards — individualised, therapeutic plans and key work",
      "Leadership & Management Standard — supervision, reflective practice, trauma-informed culture",
    ],
    why_for_cara:
      "Grounds Cara's relational practice in the statutory standards; useful for linking practice to compliance and inspection.",
    tags: [
      "Children's Homes Regulations 2015",
      "Quality Standards",
      "Ofsted",
      "regulation",
    ],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },

  // ── Sources ───────────────────────────────────────────────────────────────────

  {
    id: "source_reading_list",
    type: "source",
    title: "Foundational residential childcare reading list",
    origin: "Practitioner post",
    summary: "Canonical texts shaping the field.",
    principles: [
      "The Child's Journey Through Care — ed. Dorota Iwaniec (attachment, stability, long-term outcomes)",
      "Rethinking Residential Child Care: Positive Perspectives — Mark Smith (care as growth, not last resort)",
      "Facing Forward: Residential Child Care in the 21st Century — eds. David Crimmens & Ian Milligan (systems view)",
      "An Essential Guide to Surviving and Thriving in Residential Childcare — Jane Dalgleish (resilience, self-care)",
      "A Guide to Therapeutic Childcare — Steckley, Emond & Marsh (therapeutic relationships, containment)",
    ],
    why_for_cara:
      "Authoritative bibliography to ground Cara's knowledge in named sources.",
    tags: ["reading list", "bibliography", "therapeutic care", "attachment"],
    links: [],
    status: "approved",
    ingested_at: "2026-06-16",
    reviewed: true,
  },
  {
    id: "source_rcc_points_of_view",
    type: "source",
    title: "RCC Points of View Podcast (Scotland — secure & residential care)",
    origin: "Scottish Residential Child Care Workers Online Forum",
    summary:
      "Interview podcast on residential and secure care in Scotland. Guests: Dr Ian Milligan (historical/contemporary perspective, 2 parts); Dr Laura Steckley (restraint reduction, containment, relational practice); Beth-Anne McDowall (lived experience, secure care, relationships); Ross Gibson (Secure Care Standards); James Docherty (trauma, recovery, purpose of secure care); Stephen McShane (safety, workforce wellbeing, relational practice).",
    principles: [
      "Secure care",
      "Restraint reduction",
      "Relational practice",
      "Secure Care Standards",
      "Lived experience",
    ],
    why_for_cara:
      "Source map of expert voices; awaiting article + PDF (with per-episode reflective questions) for richer text content. Audio has no transcript.",
    tags: ["podcast", "secure care", "Scotland", "restraint reduction", "lived experience"],
    links: ["https://open.spotify.com/episode/6VFFrdxqbmdNKPetUZA3zM"],
    status: "pending_review",
    ingested_at: "2026-06-16",
    reviewed: false,
  },
  {
    id: "source_jane_dalgleish_youtube",
    type: "source",
    title: "Jane Welsh Dalgleish — YouTube channel",
    origin: "@JaneWelshDalgleish",
    summary:
      "Practitioner-author (26 years frontline; author of 'An Essential Guide to Surviving and Thriving in Residential Childcare'). Short reflective videos (That Moment, Belonging pts 1-2, Introduction). 'That Moment' is a CYC-Net piece on connection, stillness and presence. No transcripts available.",
    principles: ["Reflective practice", "Belonging", "Presence/attunement"],
    why_for_cara:
      "Practitioner voice and onward source (CYC-Net) to track.",
    tags: ["YouTube", "reflective practice", "CYC-Net", "belonging"],
    links: ["https://www.youtube.com/@JaneWelshDalgleish"],
    status: "pending_review",
    ingested_at: "2026-06-16",
    reviewed: false,
  },
];

// ── Approved entries only — used by practice engines ─────────────────────────

export const KB_ENTRIES: KBEntry[] = KB_ALL_ENTRIES.filter(
  (e) => e.status === "approved",
);

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getEntryById(id: string): KBEntry | undefined {
  return KB_ALL_ENTRIES.find((e) => e.id === id);
}

export function getEntriesByType(type: KBEntryType): KBEntry[] {
  return KB_ENTRIES.filter((e) => e.type === type);
}

export function getEntriesByTag(tag: string): KBEntry[] {
  const t = tag.toLowerCase();
  return KB_ENTRIES.filter((e) =>
    e.tags.some((x) => x.toLowerCase().includes(t)),
  );
}

/** Compact, LLM-ready description of an approved entry for use in prompts. */
export function entryForPrompt(id: string): string {
  const e = getEntryById(id);
  if (!e || e.status !== "approved") return "";
  return `${e.title}: ${e.summary}`;
}

/** Collect the principles of an approved entry as a bullet list. */
export function entryPrinciples(id: string): string[] {
  return getEntryById(id)?.principles ?? [];
}

/** All tags across approved entries, deduplicated and sorted. */
export function allTags(): string[] {
  const seen = new Set<string>();
  for (const e of KB_ENTRIES) {
    for (const t of e.tags) seen.add(t);
  }
  return [...seen].sort();
}

/** Core value note by value ID. */
export function coreValueNote(valueId: string): string {
  return KB_HEART.values.find((v) => v.id === valueId)?.note ?? "";
}

/** All PACE principles (from model_pace). */
export function pacePrinciples(): string[] {
  return entryPrinciples("model_pace");
}

/** All 21 skills (from skills_21_residential). */
export function residentialSkills(): string[] {
  return entryPrinciples("skills_21_residential");
}

/** All 10 leadership skills (from skills_10_master_2026). */
export function leadershipSkills(): string[] {
  return entryPrinciples("skills_10_master_2026");
}

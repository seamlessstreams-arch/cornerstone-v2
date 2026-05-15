// ══════════════════════════════════════════════════════════════════════════════
// ARIA INTELLIGENCE — PROVIDER ADAPTER
//
// Multi-provider JSON generation for the intelligence engine.
// Supports OpenAI, Anthropic, and stub mode.
// Server-side only — never import in client components.
// ══════════════════════════════════════════════════════════════════════════════

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GenerateJsonInput = {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
};

/**
 * Generate a JSON response from the configured AI provider.
 * Falls back to stub mode if no provider is configured.
 */
export async function generateAriaJson(input: GenerateJsonInput): Promise<unknown> {
  const provider = (process.env.AI_PROVIDER ?? "stub").toLowerCase();

  if (provider === "openai") {
    return generateViaOpenAI(input);
  }

  if (provider === "anthropic") {
    return generateViaAnthropic(input);
  }

  // Stub mode — return a safe demo response
  return generateStub(input);
}

async function generateViaOpenAI(input: GenerateJsonInput): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("placeholder")) {
    throw new Error("OPENAI_API_KEY is missing or set to placeholder.");
  }

  // Dynamic import using variable to prevent Turbopack static resolution
  const moduleName = "openai";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { default: OpenAI } = await import(/* webpackIgnore: true */ moduleName) as { default: new (opts: { apiKey: string }) => any };
  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: input.model ?? process.env.ARIA_MODEL ?? "gpt-4.1-mini",
    temperature: input.temperature ?? 0.2,
    response_format: { type: "json_object" },
    messages: input.messages,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("AI provider returned an empty response.");

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("AI provider returned invalid JSON.");
  }
}

async function generateViaAnthropic(input: GenerateJsonInput): Promise<unknown> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.includes("placeholder")) {
    throw new Error("ANTHROPIC_API_KEY is missing or set to placeholder.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { default: Anthropic } = await import("@anthropic-ai/sdk" as string) as { default: new (opts: { apiKey: string }) => any };
  const client = new Anthropic({ apiKey });

  // Extract system message and user messages
  const systemMessage = input.messages.find((m) => m.role === "system")?.content ?? "";
  const userMessages = input.messages.filter((m) => m.role !== "system");

  const response = await client.messages.create({
    model: input.model ?? process.env.ARIA_MODEL ?? "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: input.temperature ?? 0.2,
    system: systemMessage + "\n\nYou MUST respond with valid JSON only. No markdown, no explanation, just JSON.",
    messages: userMessages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
  });

  const raw = response.content?.[0]?.type === "text" ? response.content[0].text : "";
  if (!raw) throw new Error("AI provider returned an empty response.");

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("AI provider returned invalid JSON.");
  }
}

function generateStub(_input: GenerateJsonInput): unknown {
  return {
    answer: "Aria is running in demo mode. Configure AI_PROVIDER in your environment to enable live intelligence. This stub response ensures the system works end-to-end without an API key.",
    executiveSummary: "Demo mode — no AI provider configured.",
    childVoiceProtected: true,
    confidence: 25,
    safetyFlags: [],
    evidenceUsed: [],
    suggestedUpdates: [],
    missingEvidence: ["AI provider not configured — no evidence analysis performed."],
    managementOversightRequired: false,
    regulatoryRefs: [],
    qualityStandardRefs: [],
    practicePrompts: ["Configure AI_PROVIDER=anthropic or AI_PROVIDER=openai to enable live Aria intelligence."],
    nextBestActions: [
      {
        title: "Configure AI provider",
        ownerRole: "System Administrator",
        duePriority: "this_week",
        rationale: "Aria intelligence requires a configured AI provider to analyse evidence and generate insights.",
      },
    ],
  };
}

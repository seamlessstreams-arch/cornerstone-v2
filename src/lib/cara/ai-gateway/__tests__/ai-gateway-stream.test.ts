import { describe, it, expect, vi } from "vitest";
import { invokeAiGatewayStream, type AiGatewayDeps, type AiGatewayRequest } from "../ai-gateway";

// Streaming deps: streamGenerate forwards a delta + reports usage (incl. cache).
function deps(opts: { llmUsed?: boolean; streamText?: string } = {}): {
  d: AiGatewayDeps;
  stream: ReturnType<typeof vi.fn>;
} {
  const { llmUsed = true, streamText = "Hello world" } = opts;
  const stream = vi.fn(
    async (
      _input: unknown,
      handlers: { onTextDelta: (t: string) => void; onMessageDelta?: (s: string | null) => void },
    ) => {
      if (llmUsed) {
        handlers.onTextDelta(streamText);
        handlers.onMessageDelta?.("end_turn");
      }
      return {
        llmUsed,
        providerId: "anthropic" as const,
        modelId: "claude-x",
        tokensInput: llmUsed ? 10 : 0,
        tokensOutput: llmUsed ? 20 : 0,
        cacheCreationInputTokens: llmUsed ? 5 : 0,
        cacheReadInputTokens: llmUsed ? 3 : 0,
      };
    },
  );
  const d: AiGatewayDeps = {
    rulesFirst: vi.fn(() => null),
    hasRule: vi.fn(() => false),
    isCacheable: vi.fn(() => false),
    cacheLookup: vi.fn(() => null),
    cacheStore: vi.fn(),
    classify: vi.fn(() => "internal"),
    redact: vi.fn((t: string) => ({ redactedText: t, sensitiveItemsDetected: 0 })),
    providerConfigured: vi.fn(() => true),
    aiKillSwitchOn: vi.fn(() => false),
    permitAi: vi.fn(() => true),
    generate: vi.fn(async () => ({ text: "", llmUsed: true, providerId: "anthropic" as const, modelId: "claude-x" })),
    streamGenerate: stream,
    spentTodayGbp: vi.fn(() => 0),
    estimateRequestGbp: vi.fn(() => 0.01),
    recordDecision: vi.fn(),
    recordAudit: vi.fn(),
    now: vi.fn(() => "2026-06-25T00:00:00.000Z"),
    costLimits: { perRequestMax: 0.5, dailyPerUser: 5, dailyPerHome: 25, dailyPerOrganisation: 100, monthlyPerOrganisation: 2000 },
  };
  return { d, stream };
}

function handlers() {
  const deltas: string[] = [];
  const onTextDelta = vi.fn((t: string) => deltas.push(t));
  const onMessageDelta = vi.fn();
  return { h: { onTextDelta, onMessageDelta }, deltas, onTextDelta };
}

const req = (over: Partial<AiGatewayRequest> = {}): AiGatewayRequest => ({
  purpose: "test",
  feature: "test_feature",
  systemPrompt: "sys",
  userPrompt: "The child was settled today.",
  redact: false,
  ...over,
});

describe("AI Gateway streaming — must NOT reach the model", () => {
  const blocks: [string, (d: AiGatewayDeps) => void][] = [
    ["kill-switch ON", (d) => (d.aiKillSwitchOn = vi.fn(() => true))],
    ["no provider configured", (d) => (d.providerConfigured = vi.fn(() => false))],
    ["caller not permitted", (d) => (d.permitAi = vi.fn(() => false))],
    ["safeguarding-sensitive data", (d) => (d.classify = vi.fn(() => "safeguarding_sensitive"))],
    ["per-request cost over limit", (d) => (d.estimateRequestGbp = vi.fn(() => 0.99))],
    ["daily org budget exhausted", (d) => (d.spentTodayGbp = vi.fn(() => 100))],
  ];

  for (const [name, mutate] of blocks) {
    it(`${name} → refused, no stream, no deltas`, async () => {
      const { d, stream } = deps();
      mutate(d);
      const { h, onTextDelta } = handlers();
      const r = await invokeAiGatewayStream(req(), h, d);
      expect(r.method).toBe("refused");
      expect(r.llmUsed).toBe(false);
      expect(stream).not.toHaveBeenCalled();
      expect(onTextDelta).not.toHaveBeenCalled();
      expect(d.recordDecision).toHaveBeenCalledWith("deterministic", "test_feature");
    });
  }
});

describe("AI Gateway streaming — AI allowed path", () => {
  it("streams deltas, returns method ai, surfaces token + cache usage, audits", async () => {
    const { d, stream } = deps({ streamText: "Streamed answer." });
    const { h, deltas } = handlers();
    const r = await invokeAiGatewayStream(req(), h, d);
    expect(r.method).toBe("ai");
    expect(r.llmUsed).toBe(true);
    expect(deltas).toEqual(["Streamed answer."]);
    expect(r.tokensInput).toBe(10);
    expect(r.tokensOutput).toBe(20);
    expect(r.cacheCreationInputTokens).toBe(5);
    expect(r.cacheReadInputTokens).toBe(3);
    expect(r.costGbp).toBe(0.01);
    expect(stream).toHaveBeenCalledTimes(1);
    expect(d.recordAudit).toHaveBeenCalled();
  });

  it("sends the REDACTED prompt to the stream when redaction is on", async () => {
    const { d, stream } = deps();
    d.redact = vi.fn(() => ({ redactedText: "[STAFF_1] noted the child was settled.", sensitiveItemsDetected: 2 }));
    const { h } = handlers();
    const r = await invokeAiGatewayStream(req({ redact: true }), h, d);
    expect(r.redactionCount).toBe(2);
    expect(stream.mock.calls[0][0].userPrompt).toBe("[STAFF_1] noted the child was settled.");
  });

  it("passes the raw prompt + cacheSystem through when redact:false", async () => {
    const { d, stream } = deps();
    const { h } = handlers();
    await invokeAiGatewayStream(req({ redact: false, cacheSystem: true }), h, d);
    expect(stream.mock.calls[0][0].userPrompt).toBe("The child was settled today.");
    expect(stream.mock.calls[0][0].cacheSystem).toBe(true);
  });

  it("provider degraded (llmUsed=false) → refused, no identifiable data marked sent", async () => {
    const { d } = deps({ llmUsed: false });
    const { h, onTextDelta } = handlers();
    const r = await invokeAiGatewayStream(req(), h, d);
    expect(r.llmUsed).toBe(false);
    expect(r.method).toBe("refused");
    expect(r.identifiableDataSent).toBe(false);
    expect(r.costGbp).toBe(0);
    expect(onTextDelta).not.toHaveBeenCalled();
  });
});

describe("AI Gateway streaming — deterministic shortcuts emit one delta", () => {
  it("rules-first hit → emits the ruled output as a single delta, no stream", async () => {
    const { d, stream } = deps();
    d.hasRule = vi.fn(() => true);
    d.rulesFirst = vi.fn(() => ({ output: "RULED ANSWER", confidence: 1, method: "rules" }) as never);
    const { h, deltas } = handlers();
    const r = await invokeAiGatewayStream(req({ commandId: "improve_writing" }), h, d);
    expect(r.method).toBe("deterministic");
    expect(r.llmUsed).toBe(false);
    expect(deltas).toEqual(["RULED ANSWER"]);
    expect(stream).not.toHaveBeenCalled();
  });

  it("cache hit → emits the cached output as a single delta, no stream", async () => {
    const { d, stream } = deps();
    d.isCacheable = vi.fn(() => true);
    d.cacheLookup = vi.fn(() => ({ output: "CACHED ANSWER" }));
    const { h, deltas } = handlers();
    const r = await invokeAiGatewayStream(req({ commandId: "improve_writing" }), h, d);
    expect(r.method).toBe("cache");
    expect(deltas).toEqual(["CACHED ANSWER"]);
    expect(stream).not.toHaveBeenCalled();
  });
});

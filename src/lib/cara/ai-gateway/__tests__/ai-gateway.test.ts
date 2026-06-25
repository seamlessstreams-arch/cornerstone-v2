import { describe, it, expect, vi } from "vitest";
import { invokeAiGateway, type AiGatewayDeps, type AiGatewayRequest } from "../ai-gateway";

// All-pass fake deps + a generate spy. Each test overrides the one gate it probes.
function deps(genText = "AI OUTPUT", llmUsed = true): { d: AiGatewayDeps; gen: ReturnType<typeof vi.fn> } {
  const gen = vi.fn(async () => ({ text: genText, llmUsed, providerId: "anthropic" as const, modelId: "claude-x" }));
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
    generate: gen,
    streamGenerate: vi.fn(async () => ({
      llmUsed: true, providerId: "anthropic" as const, modelId: "claude-x",
      tokensInput: 0, tokensOutput: 0, cacheCreationInputTokens: 0, cacheReadInputTokens: 0,
    })),
    spentTodayGbp: vi.fn(() => 0),
    estimateRequestGbp: vi.fn(() => 0.01),
    recordDecision: vi.fn(),
    recordAudit: vi.fn(),
    now: vi.fn(() => "2026-06-25T00:00:00.000Z"),
    costLimits: { perRequestMax: 0.5, dailyPerUser: 5, dailyPerHome: 25, dailyPerOrganisation: 100, monthlyPerOrganisation: 2000 },
  };
  return { d, gen };
}
const req = (over: Partial<AiGatewayRequest> = {}): AiGatewayRequest => ({
  purpose: "test", feature: "test_feature", systemPrompt: "sys",
  userPrompt: "The child was settled today.", commandId: "improve_writing", ...over,
});

describe("AI Gateway — deterministic-first ladder (must NOT call AI)", () => {
  it("rules-first answer → deterministic, no model call", async () => {
    const { d, gen } = deps();
    d.hasRule = vi.fn(() => true);
    d.rulesFirst = vi.fn(() => ({ output: "RULED", confidence: 1, method: "rules" }) as never);
    const r = await invokeAiGateway(req(), d);
    expect(r.method).toBe("deterministic");
    expect(r.llmUsed).toBe(false);
    expect(r.output).toBe("RULED");
    expect(gen).not.toHaveBeenCalled();
    expect(d.recordDecision).toHaveBeenCalledWith("deterministic", "test_feature");
  });

  it("cache hit → no model call", async () => {
    const { d, gen } = deps();
    d.isCacheable = vi.fn(() => true);
    d.cacheLookup = vi.fn(() => ({ output: "CACHED" }));
    const r = await invokeAiGateway(req(), d);
    expect(r.method).toBe("cache");
    expect(r.output).toBe("CACHED");
    expect(gen).not.toHaveBeenCalled();
  });

  it("kill-switch ON → refused, no model call", async () => {
    const { d, gen } = deps();
    d.aiKillSwitchOn = vi.fn(() => true);
    const r = await invokeAiGateway(req(), d);
    expect(r.method).toBe("refused");
    expect(r.refusedReason).toMatch(/disabled/i);
    expect(gen).not.toHaveBeenCalled();
  });

  it("provider not configured (no key) → refused, no model call", async () => {
    const { d, gen } = deps();
    d.providerConfigured = vi.fn(() => false);
    const r = await invokeAiGateway(req(), d);
    expect(r.method).toBe("refused");
    expect(gen).not.toHaveBeenCalled();
  });

  it("caller not permitted → refused", async () => {
    const { d, gen } = deps();
    d.permitAi = vi.fn(() => false);
    const r = await invokeAiGateway(req(), d);
    expect(r.method).toBe("refused");
    expect(gen).not.toHaveBeenCalled();
  });

  it("safeguarding-sensitive data is never sent → refused", async () => {
    const { d, gen } = deps();
    d.classify = vi.fn(() => "safeguarding_sensitive");
    const r = await invokeAiGateway(req(), d);
    expect(r.method).toBe("refused");
    expect(r.identifiableDataSent).toBe(false);
    expect(gen).not.toHaveBeenCalled();
  });

  it("per-request cost over the limit → refused", async () => {
    const { d, gen } = deps();
    d.estimateRequestGbp = vi.fn(() => 0.99); // > perRequestMax 0.50
    const r = await invokeAiGateway(req(), d);
    expect(r.method).toBe("refused");
    expect(r.refusedReason).toMatch(/per-request/i);
    expect(gen).not.toHaveBeenCalled();
  });

  it("daily org budget exhausted → refused", async () => {
    const { d, gen } = deps();
    d.spentTodayGbp = vi.fn(() => 100); // already at the £100 daily cap
    const r = await invokeAiGateway(req(), d);
    expect(r.method).toBe("refused");
    expect(gen).not.toHaveBeenCalled();
  });
});

describe("AI Gateway — AI allowed path", () => {
  it("clean, permitted request → calls the model with the REDACTED prompt", async () => {
    const { d, gen } = deps("AI OUTPUT", true);
    d.redact = vi.fn(() => ({ redactedText: "[STAFF_1] noted the child was settled.", sensitiveItemsDetected: 2 }));
    const r = await invokeAiGateway(req({ commandId: undefined }), d); // no commandId → straight to AI gates
    expect(r.method).toBe("ai");
    expect(r.llmUsed).toBe(true);
    expect(r.output).toBe("AI OUTPUT");
    expect(r.costGbp).toBe(0.01);
    expect(r.redactionCount).toBe(2);
    expect(gen).toHaveBeenCalledTimes(1);
    // The model received the REDACTED prompt, not the raw one.
    expect(gen.mock.calls[0][0].userPrompt).toBe("[STAFF_1] noted the child was settled.");
    expect(r.identifiableDataSent).toBe(false);
    expect(d.recordAudit).toHaveBeenCalled();
  });

  it("caches a real model answer for next time", async () => {
    const { d } = deps("FRESH", true);
    d.isCacheable = vi.fn(() => true);
    await invokeAiGateway(req(), d);
    expect(d.cacheStore).toHaveBeenCalledWith("improve_writing", "The child was settled today.", "FRESH");
  });

  it("provider degraded (llmUsed=false) → no identifiable data recorded as sent", async () => {
    const { d } = deps("fallback notice", false);
    const r = await invokeAiGateway(req({ commandId: undefined }), d);
    expect(r.llmUsed).toBe(false);
    expect(r.method).toBe("refused");
    expect(r.identifiableDataSent).toBe(false);
    expect(r.costGbp).toBe(0);
  });
});

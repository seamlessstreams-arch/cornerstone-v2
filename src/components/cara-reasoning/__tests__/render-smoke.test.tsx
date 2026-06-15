import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PracticeReasoningPanel } from "../practice-reasoning-panel";
import { InlinePracticeReasoning } from "../inline-practice-reasoning";
import { reasonOverChild } from "@/lib/cara-reasoning/practice-reasoning-engine";
import type { ReasoningSignalsInput } from "@/lib/cara-reasoning/types";

function wrap(el: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return React.createElement(QueryClientProvider, { client: qc }, el);
}

const signals: ReasoningSignalsInput = {
  childId: "yp_alex",
  childName: "Alex",
  childAge: 14,
  knownRiskFlags: ["missing from care", "child exploitation"],
  recentWindowDays: 90,
  incidents: [
    { type: "missing_from_care", severity: "high", date: "2026-06-10", reviewed: false },
    { type: "physical_intervention", severity: "high", date: "2026-06-08", reviewed: true },
    { type: "safeguarding_concern", severity: "critical", date: "2026-06-05", reviewed: true },
  ],
  significantEvents: [{ date: "2026-06-05", category: "safeguarding", significance: "critical", title: "Concern raised" }],
  moodScores: [6, 5, 4],
  recentLogCount: 4,
  childVoicePresent: false,
  today: "2026-06-14",
};

describe("cara-reasoning render smoke (catches browser-only render throws)", () => {
  it("PracticeReasoningPanel renders with real engine output", () => {
    const reasoning = reasonOverChild(signals);
    expect(() => renderToStaticMarkup(React.createElement(PracticeReasoningPanel, { reasoning }))).not.toThrow();
  });

  it("InlinePracticeReasoning mounts (loading state) without throwing", () => {
    expect(() =>
      renderToStaticMarkup(wrap(React.createElement(InlinePracticeReasoning, { childId: "yp_alex", childName: "Alex" }))),
    ).not.toThrow();
  });
});

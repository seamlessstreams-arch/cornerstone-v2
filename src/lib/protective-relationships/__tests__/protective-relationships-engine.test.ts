import { describe, it, expect } from "vitest";
import {
  analyseChildRelationships,
  buildRelationshipsOverview,
} from "../protective-relationships-engine";
import type { RelationshipEntry } from "../types";

const NOW = "2026-06-23T12:00:00.000Z";

function entry(over: Partial<RelationshipEntry> = {}): RelationshipEntry {
  return {
    id: "rel_1", child_id: "yp_alex", home_id: "home_oak",
    name: "Mirela", relationship_to_child: "Key worker", category: "safe_adult", rating: "protective",
    child_view: "I trust her", staff_view: "Strong bond", manager_view: "",
    known_concerns: "", known_strengths: "Consistent and warm",
    contact_arrangements: "Daily", restrictions: "", linked_record_ids: [],
    review_date: "2026-12-01", status: "active",
    created_at: NOW, updated_at: NOW, created_by: "staff_dl", updated_by: "staff_dl",
    ...over,
  };
}

describe("analyseChildRelationships", () => {
  it("reads a child with two protective trusted adults as secure", () => {
    const a = analyseChildRelationships(
      [entry(), entry({ id: "rel_2", name: "Nan", category: "family_support", rating: "protective" })],
      [], [], NOW,
    );
    expect(a.trustedAdultCount).toBe(2);
    expect(a.status).toBe("secure");
    expect(a.flags.some((f) => f.severity === "high")).toBe(false);
  });

  it("flags no trusted adult as high and fragile", () => {
    const a = analyseChildRelationships([entry({ rating: "risk", category: "risk_peer" })], [], [], NOW);
    expect(a.flags.find((f) => f.key === "no-trusted-adult")?.severity).toBe("high");
    expect(a.status).toBe("fragile");
  });

  it("flags a risky person named in a recent incident", () => {
    const incidents = [{ id: "i1", child_id: "yp_alex", date: "2026-06-15", severity: "high", type: "x", description: "Found with Danny near the precinct" }] as never[];
    const a = analyseChildRelationships(
      [entry(), entry({ id: "rel_2", name: "Danny", relationship_to_child: "Older peer", category: "risk_peer", rating: "risk" })],
      incidents, [], NOW,
    );
    expect(a.flags.some((f) => f.key === "unsafe-in-incident")).toBe(true);
  });

  it("does NOT flag when the risk person's name is only a substring of a word (Sam vs 'same')", () => {
    const incidents = [{ id: "i1", child_id: "yp_alex", date: "2026-06-15", severity: "low", type: "x", description: "Found in the same place as before; nothing of concern" }] as never[];
    const a = analyseChildRelationships(
      [entry(), entry({ id: "rel_2", name: "Sam", category: "risk_peer", rating: "risk" })],
      incidents, [], NOW,
    );
    expect(a.flags.some((f) => f.key === "unsafe-in-incident")).toBe(false);
  });

  it("DOES flag a whole-word name match even with a title prefix ('Mr Davies')", () => {
    const incidents = [{ id: "i1", child_id: "yp_alex", date: "2026-06-15", severity: "high", type: "x", description: "Davies was waiting outside the school gates" }] as never[];
    const a = analyseChildRelationships(
      [entry(), entry({ id: "rel_2", name: "Mr Davies", category: "exploitation_risk", rating: "risk" })],
      incidents, [], NOW,
    );
    expect(a.flags.some((f) => f.key === "unsafe-in-incident")).toBe(true);
  });

  it("does NOT count a future-dated incident as recent", () => {
    const incidents = [{ id: "i1", child_id: "yp_alex", date: "2026-12-15", severity: "high", type: "x", description: "Danny was there" }] as never[];
    const a = analyseChildRelationships(
      [entry(), entry({ id: "rel_2", name: "Danny", category: "risk_peer", rating: "risk" })],
      incidents, [], NOW,
    );
    expect(a.flags.some((f) => f.key === "unsafe-in-incident")).toBe(false);
  });

  it("flags a risk peer alongside a recent missing episode", () => {
    const missing = [{ id: "m1", child_id: "yp_alex", date_missing: "2026-06-18", reference: "M1" }] as never[];
    const a = analyseChildRelationships(
      [entry(), entry({ id: "rel_2", name: "Kez", category: "risk_peer", rating: "risk" })],
      [], missing, NOW,
    );
    expect(a.flags.some((f) => f.key === "risk-peer-missing")).toBe(true);
  });
});

describe("buildRelationshipsOverview", () => {
  const children = [{ id: "yp_alex", name: "Alex" }, { id: "yp_jordan", name: "Jordan" }];

  it("surfaces a child with no map", () => {
    const o = buildRelationshipsOverview({ now: NOW, entries: [entry()], children, reflections: [], incidents: [], missing: [] });
    expect(o.childrenWithoutMap.map((c) => c.name)).toEqual(["Jordan"]);
    expect(o.alerts.some((a) => a.key === "no_map")).toBe(true);
    expect(o.homeStatus).toBe("action_needed");
  });

  it("flags a map a reflection asked to review", () => {
    const reflections = [{ child_id: "yp_alex", relationship_map_review: true, incident_date: "2026-06-19" }] as never[];
    const o = buildRelationshipsOverview({
      now: NOW,
      entries: [entry(), entry({ id: "r2", child_id: "yp_jordan" })],
      children, reflections, incidents: [], missing: [],
    });
    expect(o.alerts.some((a) => a.key === "review_flagged")).toBe(true);
  });

  it("is deterministic", () => {
    const args = { now: NOW, entries: [entry()], children, reflections: [], incidents: [], missing: [] };
    expect(buildRelationshipsOverview(args)).toEqual(buildRelationshipsOverview(args));
  });
});

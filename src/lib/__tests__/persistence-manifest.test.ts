import { describe, it, expect } from "vitest";
import { PERSISTENCE_MANIFEST, persistenceSummary } from "../persistence-manifest";

describe("persistence manifest", () => {
  it("every entry is complete and honest about its table", () => {
    for (const e of PERSISTENCE_MANIFEST) {
      expect(e.entity.length, e.entity).toBeGreaterThan(3);
      expect(e.audit_trail.length, e.entity).toBeGreaterThan(5);
      if (e.write_through) {
        // A durable claim must name a real table target.
        expect(e.table, e.entity).toBeTruthy();
        expect(e.table, e.entity).not.toMatch(/planned|ready/i);
      }
    }
  });

  it("covers the entities the platform promises durability for", () => {
    const names = PERSISTENCE_MANIFEST.map((e) => e.entity.toLowerCase());
    for (const must of ["daily logs", "incidents", "tasks", "cara studio outputs", "cara ai run", "guardrail", "audit log"]) {
      expect(names.some((n) => n.includes(must)), must).toBe(true);
    }
  });

  it("summary adds up", () => {
    const s = persistenceSummary();
    expect(s.total).toBe(PERSISTENCE_MANIFEST.length);
    expect(s.durable + s.pending).toBe(s.total);
    expect(s.durable).toBeGreaterThanOrEqual(10);
  });
});

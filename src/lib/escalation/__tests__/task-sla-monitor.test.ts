import { describe, it, expect } from "vitest";
import { monitorTaskSla, type SlaTask } from "../task-sla-monitor";

const NOW = new Date("2026-06-10T12:00:00Z");

function task(overrides: Partial<SlaTask> = {}): SlaTask {
  return {
    id: "t1",
    title: "Generic task",
    category: "admin",
    priority: "medium",
    status: "not_started",
    due_date: "2026-06-15", // future by default
    ...overrides,
  };
}

describe("Task SLA Monitor", () => {
  // ── Terminal statuses excluded ──────────────────────────────────────────
  describe("active filtering", () => {
    it("ignores completed and cancelled tasks", () => {
      const r = monitorTaskSla([
        task({ id: "a", status: "completed", due_date: "2026-06-01" }),
        task({ id: "b", status: "cancelled", due_date: "2026-06-01" }),
      ], NOW);
      expect(r.summary.active_tasks).toBe(0);
      expect(r.escalations).toHaveLength(0);
    });
    it("counts not_started / in_progress / blocked as active", () => {
      const r = monitorTaskSla([
        task({ id: "a", status: "not_started" }),
        task({ id: "b", status: "in_progress" }),
        task({ id: "c", status: "blocked" }),
      ], NOW);
      expect(r.summary.active_tasks).toBe(3);
    });
    it("skips active tasks with no due date", () => {
      const r = monitorTaskSla([task({ due_date: null })], NOW);
      expect(r.escalations).toHaveLength(0);
    });
  });

  // ── Severity classification ─────────────────────────────────────────────
  describe("severity", () => {
    it("statutory category overdue → critical", () => {
      const r = monitorTaskSla([task({ category: "safeguarding", due_date: "2026-06-08" })], NOW);
      expect(r.escalations[0].severity).toBe("critical");
      expect(r.escalations[0].is_statutory).toBe(true);
    });
    it("statutory title (Reg 40) overdue → critical even if category is admin", () => {
      const r = monitorTaskSla([task({ title: "Assess Reg 40 notification requirement", category: "admin", due_date: "2026-06-09" })], NOW);
      expect(r.escalations[0].severity).toBe("critical");
      expect(r.escalations[0].is_statutory).toBe(true);
    });
    it("urgent priority overdue → critical", () => {
      const r = monitorTaskSla([task({ priority: "urgent", category: "admin", due_date: "2026-06-09" })], NOW);
      expect(r.escalations[0].severity).toBe("critical");
    });
    it("overdue > 3 days → critical regardless of category", () => {
      const r = monitorTaskSla([task({ category: "admin", priority: "low", due_date: "2026-06-05" })], NOW); // 5 days
      expect(r.escalations[0].severity).toBe("critical");
    });
    it("high priority overdue → high", () => {
      const r = monitorTaskSla([task({ priority: "high", category: "admin", due_date: "2026-06-09" })], NOW);
      expect(r.escalations[0].severity).toBe("high");
    });
    it("ordinary task 1-3 days overdue → high", () => {
      const r = monitorTaskSla([task({ category: "admin", priority: "medium", due_date: "2026-06-08" })], NOW); // 2 days
      expect(r.escalations[0].severity).toBe("high");
    });
    it("ordinary task overdue today (0 days) → medium", () => {
      const r = monitorTaskSla([task({ category: "admin", priority: "medium", due_date: "2026-06-10" })], NOW); // 0 days
      expect(r.escalations[0].severity).toBe("medium");
    });
  });

  // ── Approaching (watch) ─────────────────────────────────────────────────
  describe("approaching deadlines", () => {
    it("due tomorrow → watch", () => {
      const r = monitorTaskSla([task({ due_date: "2026-06-11" })], NOW);
      expect(r.escalations[0].severity).toBe("watch");
      expect(r.escalations[0].reason).toMatch(/tomorrow/i);
    });
    it("due far in future → not surfaced", () => {
      const r = monitorTaskSla([task({ due_date: "2026-07-01" })], NOW);
      expect(r.escalations).toHaveLength(0);
    });
  });

  // ── Summary + ordering ──────────────────────────────────────────────────
  describe("summary and ordering", () => {
    it("computes a correct summary breakdown", () => {
      const r = monitorTaskSla([
        task({ id: "crit", category: "safeguarding", due_date: "2026-06-08" }),     // critical, statutory
        task({ id: "high", priority: "high", category: "admin", due_date: "2026-06-09" }), // high
        task({ id: "watch", due_date: "2026-06-10" }),                              // medium (0 days)
        task({ id: "soon", due_date: "2026-06-11" }),                               // watch
        task({ id: "done", status: "completed", due_date: "2026-06-01" }),          // excluded
      ], NOW);
      expect(r.summary.active_tasks).toBe(4);
      expect(r.summary.breached_critical).toBe(1);
      expect(r.summary.breached_high).toBe(1);
      expect(r.summary.approaching).toBe(1);
      expect(r.summary.statutory_overdue).toBe(1);
      expect(r.summary.overdue).toBe(3); // crit + high + medium
    });

    it("sorts critical first, then by most overdue", () => {
      const r = monitorTaskSla([
        task({ id: "med", category: "admin", priority: "medium", due_date: "2026-06-10" }),
        task({ id: "crit1", category: "safeguarding", due_date: "2026-06-09" }),
        task({ id: "crit2", category: "safeguarding", due_date: "2026-06-05" }),
      ], NOW);
      expect(r.escalations[0].severity).toBe("critical");
      // most overdue critical first
      expect(r.escalations[0].task_id).toBe("crit2");
    });

    it("by_category aggregates overdue counts", () => {
      const r = monitorTaskSla([
        task({ id: "a", category: "safeguarding", due_date: "2026-06-08" }),
        task({ id: "b", category: "safeguarding", due_date: "2026-06-07" }),
        task({ id: "c", category: "compliance", due_date: "2026-06-09" }),
      ], NOW);
      const sg = r.by_category.find((c) => c.category === "safeguarding");
      expect(sg?.overdue).toBe(2);
    });
  });

  // ── Headline ────────────────────────────────────────────────────────────
  describe("headline", () => {
    it("leads with critical breaches", () => {
      expect(monitorTaskSla([task({ category: "safeguarding", due_date: "2026-06-08" })], NOW).headline).toMatch(/critical SLA breach/i);
    });
    it("reports all-clear when nothing overdue", () => {
      expect(monitorTaskSla([task({ due_date: "2026-07-01" })], NOW).headline).toMatch(/within SLA|nothing overdue/i);
    });
    it("empty input is all-clear", () => {
      const r = monitorTaskSla([], NOW);
      expect(r.summary.active_tasks).toBe(0);
      expect(r.headline).toMatch(/within SLA|nothing overdue/i);
    });
  });

  // ── Provenance passthrough ──────────────────────────────────────────────
  it("carries linked record + child provenance through to escalations", () => {
    const r = monitorTaskSla([task({ category: "safeguarding", due_date: "2026-06-08", child_id: "yp_alex", linked_record_type: "incident", linked_record_id: "inc_1" })], NOW);
    expect(r.escalations[0].child_id).toBe("yp_alex");
    expect(r.escalations[0].linked_record_type).toBe("incident");
    expect(r.escalations[0].linked_record_id).toBe("inc_1");
  });
});

import { describe, it, expect } from "vitest";
import {
  computeIntegrationHub,
  DEFAULT_ADAPTERS,
  KEY_ADAPTER_KINDS,
  ADAPTER_KIND_LABELS,
  isKeyAdapter,
  adapterHealth,
  daysAgo,
  SYNC_FRESHNESS_DAYS,
  type IntegrationAdapter,
  type AdapterKind,
} from "../integration-hub-engine";

const TODAY = "2026-06-03";

function addDays(date: string, n: number): string {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const ago = (n: number) => addDays(TODAY, -n);

function adapter(o: Partial<IntegrationAdapter> & { id: string; kind: AdapterKind }): IntegrationAdapter {
  return {
    name: o.name ?? o.id,
    status: "not_configured",
    last_sync: null,
    supports_idempotency: true,
    retry: { max_attempts: 3, backoff_seconds: 30 },
    error_log: [],
    sync_status: "Not configured",
    manual_override: false,
    ...o,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
describe("helpers", () => {
  it("daysAgo counts whole days", () => {
    expect(daysAgo(ago(5), TODAY)).toBe(5);
  });

  it("isKeyAdapter matches the key-adapter set", () => {
    expect(isKeyAdapter("rota")).toBe(true);
    expect(isKeyAdapter("payroll")).toBe(true);
    expect(isKeyAdapter("hr_training")).toBe(true);
    expect(isKeyAdapter("la_reporting")).toBe(true);
    expect(isKeyAdapter("calendar")).toBe(false);
    expect(isKeyAdapter("notifications")).toBe(false);
  });

  it("adapterHealth maps status + error log to a health value", () => {
    expect(adapterHealth(adapter({ id: "x", kind: "rota", status: "connected" }))).toBe("healthy");
    expect(
      adapterHealth(adapter({ id: "x", kind: "rota", status: "connected", error_log: [{ at: TODAY, message: "blip" }] })),
    ).toBe("degraded");
    expect(adapterHealth(adapter({ id: "x", kind: "rota", status: "error" }))).toBe("down");
    expect(adapterHealth(adapter({ id: "x", kind: "rota", status: "not_configured" }))).toBe("inactive");
    expect(adapterHealth(adapter({ id: "x", kind: "rota", status: "disconnected" }))).toBe("inactive");
  });
});

// ── Default registry scaffold ────────────────────────────────────────────────
describe("default registry scaffold", () => {
  it("covers all 8 adapter kinds exactly once", () => {
    const kinds = DEFAULT_ADAPTERS.map((a) => a.kind);
    const allKinds: AdapterKind[] = [
      "rota", "payroll", "hr_training", "calendar",
      "notifications", "document_storage", "external_forms", "la_reporting",
    ];
    for (const k of allKinds) {
      expect(kinds.filter((x) => x === k)).toHaveLength(1);
    }
    expect(DEFAULT_ADAPTERS).toHaveLength(8);
  });

  it("ships every adapter with the full plumbing contract", () => {
    for (const a of DEFAULT_ADAPTERS) {
      expect(typeof a.supports_idempotency).toBe("boolean");
      expect(a.retry.max_attempts).toBeGreaterThan(0);
      expect(a.retry.backoff_seconds).toBeGreaterThan(0);
      expect(Array.isArray(a.error_log)).toBe(true);
      expect(typeof a.sync_status).toBe("string");
      expect(a.sync_status.length).toBeGreaterThan(0);
      expect(typeof a.manual_override).toBe("boolean");
    }
  });

  it("has at least one connected adapter with a last_sync date string", () => {
    const connected = DEFAULT_ADAPTERS.filter((a) => a.status === "connected");
    expect(connected.length).toBeGreaterThanOrEqual(1);
    expect(connected.every((a) => typeof a.last_sync === "string" && a.last_sync.length > 0)).toBe(true);
  });

  it("is mostly not_configured / disconnected for the demo", () => {
    const inactive = DEFAULT_ADAPTERS.filter(
      (a) => a.status === "not_configured" || a.status === "disconnected",
    );
    expect(inactive.length).toBeGreaterThan(DEFAULT_ADAPTERS.length / 2);
  });

  it("labels every kind", () => {
    for (const k of KEY_ADAPTER_KINDS) {
      expect(ADAPTER_KIND_LABELS[k]).toBeTruthy();
    }
  });
});

// ── Route default (no args) ──────────────────────────────────────────────────
describe("computeIntegrationHub({}) — static default registry", () => {
  const r = computeIntegrationHub({});

  it("returns the four required overview counts", () => {
    expect(r.overview.total_adapters).toBe(DEFAULT_ADAPTERS.length);
    expect(r.overview.connected).toBe(DEFAULT_ADAPTERS.filter((a) => a.status === "connected").length);
    expect(r.overview.errors).toBe(0);
    expect(r.overview.not_configured).toBeGreaterThan(0);
  });

  it("produces one view per adapter", () => {
    expect(r.adapters).toHaveLength(DEFAULT_ADAPTERS.length);
  });

  it("flags key not-configured adapters in alerts", () => {
    expect(r.alerts.length).toBeGreaterThan(0);
    expect(r.alerts.some((a) => /not configured/i.test(a.message))).toBe(true);
  });

  it("always emits the framework-guarantee positive insight", () => {
    const positive = r.insights.filter((i) => i.severity === "positive");
    expect(positive.length).toBeGreaterThan(0);
    expect(
      positive.some((i) =>
        /idempotency/i.test(i.text) &&
        /retry/i.test(i.text) &&
        /audit trail/i.test(i.text) &&
        /manual override/i.test(i.text),
      ),
    ).toBe(true);
  });

  it("describes what connecting key adapters automates", () => {
    expect(r.insights.some((i) => /not yet configured/i.test(i.text))).toBe(true);
  });

  it("every adapter view carries a non-empty capability summary", () => {
    expect(r.adapters.every((a) => a.capability_summary.length > 0)).toBe(true);
  });
});

// ── Error / health behaviour ─────────────────────────────────────────────────
describe("error adapters", () => {
  const r = computeIntegrationHub({
    today: TODAY,
    adapters: [
      adapter({
        id: "e", kind: "rota", name: "Rota X", status: "error",
        error_log: [
          { at: ago(1), message: "older failure" },
          { at: TODAY, message: "auth token rejected" },
        ],
      }),
    ],
  });

  it("counts errors and surfaces a high-severity alert", () => {
    expect(r.overview.errors).toBe(1);
    expect(r.alerts.some((a) => a.severity === "high" && a.adapter_id === "e")).toBe(true);
  });

  it("exposes the most recent error and an error count on the view", () => {
    const v = r.adapters[0];
    expect(v.error_count).toBe(2);
    expect(v.latest_error?.message).toBe("auth token rejected");
    expect(v.health).toBe("down");
  });

  it("emits a critical insight mentioning backoff and manual override", () => {
    const crit = r.insights.find((i) => i.severity === "critical");
    expect(crit).toBeTruthy();
    expect(crit!.text).toMatch(/backoff/i);
    expect(crit!.text).toMatch(/manual override/i);
  });
});

// ── Stale connected adapter ──────────────────────────────────────────────────
describe("connected but stale adapter", () => {
  const r = computeIntegrationHub({
    today: TODAY,
    adapters: [
      adapter({
        id: "s", kind: "notifications", name: "Notifier", status: "connected",
        last_sync: ago(SYNC_FRESHNESS_DAYS + 5),
        sync_status: "No traffic for days",
      }),
    ],
  });

  it("marks the adapter stale and raises a medium alert", () => {
    expect(r.adapters[0].stale).toBe(true);
    expect(r.adapters[0].last_sync_days_ago).toBe(SYNC_FRESHNESS_DAYS + 5);
    expect(r.alerts.some((a) => a.severity === "medium" && /not synced/i.test(a.message))).toBe(true);
  });

  it("does not count a stale connected adapter toward errors", () => {
    expect(r.overview.errors).toBe(0);
    expect(r.overview.connected).toBe(1);
  });
});

describe("fresh connected adapter is not stale", () => {
  it("recently-synced connected adapter is healthy and not stale", () => {
    const r = computeIntegrationHub({
      today: TODAY,
      adapters: [
        adapter({ id: "f", kind: "rota", status: "connected", last_sync: ago(0), error_log: [] }),
      ],
    });
    expect(r.adapters[0].stale).toBe(false);
    expect(r.adapters[0].health).toBe("healthy");
  });
});

// ── Disconnected adapters ────────────────────────────────────────────────────
describe("disconnected adapters", () => {
  it("are counted and produce a low-severity alert", () => {
    const r = computeIntegrationHub({
      today: TODAY,
      adapters: [
        adapter({ id: "d", kind: "calendar", status: "disconnected", last_sync: ago(14), sync_status: "Token expired" }),
      ],
    });
    expect(r.overview.disconnected).toBe(1);
    expect(r.alerts.some((a) => a.severity === "low" && a.adapter_id === "d")).toBe(true);
  });
});

// ── Overview maths ───────────────────────────────────────────────────────────
describe("overview aggregation", () => {
  const r = computeIntegrationHub({
    today: TODAY,
    adapters: [
      adapter({ id: "1", kind: "rota", status: "connected", last_sync: ago(0) }),
      adapter({ id: "2", kind: "payroll", status: "not_configured" }),
      adapter({ id: "3", kind: "calendar", status: "disconnected", last_sync: ago(10) }),
      adapter({ id: "4", kind: "notifications", status: "error", error_log: [{ at: TODAY, message: "boom" }] }),
      adapter({ id: "5", kind: "hr_training", status: "syncing", last_sync: ago(0), manual_override: true }),
      adapter({ id: "6", kind: "la_reporting", status: "not_configured", supports_idempotency: false }),
    ],
  });

  it("computes each status tally", () => {
    expect(r.overview.total_adapters).toBe(6);
    expect(r.overview.connected).toBe(1);
    expect(r.overview.errors).toBe(1);
    expect(r.overview.not_configured).toBe(2);
    expect(r.overview.disconnected).toBe(1);
    expect(r.overview.syncing).toBe(1);
  });

  it("tracks manual overrides and idempotency support", () => {
    expect(r.overview.manual_overrides).toBe(1);
    expect(r.overview.idempotent_adapters).toBe(5); // one set false
  });

  it("tracks key adapters connected vs total", () => {
    // key kinds present: rota(connected), payroll, hr_training(syncing), la_reporting
    expect(r.overview.key_adapters).toBe(4);
    expect(r.overview.key_adapters_connected).toBe(1);
  });

  it("produces a bounded health score", () => {
    expect(r.overview.health_score).toBeGreaterThanOrEqual(0);
    expect(r.overview.health_score).toBeLessThanOrEqual(100);
  });
});

describe("empty registry", () => {
  const r = computeIntegrationHub({ today: TODAY, adapters: [] });
  it("returns zeroed overview, no adapters, no alerts", () => {
    expect(r.adapters).toHaveLength(0);
    expect(r.overview.total_adapters).toBe(0);
    expect(r.overview.connected).toBe(0);
    expect(r.overview.health_score).toBe(0);
    expect(r.alerts).toHaveLength(0);
  });
  it("still emits the framework-guarantee insight", () => {
    expect(r.insights.some((i) => i.severity === "positive")).toBe(true);
  });
});

describe("all key adapters connected and fresh", () => {
  it("emits the all-connected positive insight and no error/stale alerts", () => {
    const r = computeIntegrationHub({
      today: TODAY,
      adapters: KEY_ADAPTER_KINDS.map((kind, i) =>
        adapter({ id: `k${i}`, kind, status: "connected", last_sync: ago(0), error_log: [] }),
      ),
    });
    expect(r.overview.key_adapters_connected).toBe(KEY_ADAPTER_KINDS.length);
    expect(r.alerts).toHaveLength(0);
    expect(r.insights.some((i) => i.severity === "positive" && /all .* key integrations/i.test(i.text))).toBe(true);
  });
});

// ── Determinism ──────────────────────────────────────────────────────────────
describe("determinism", () => {
  it("returns identical output for identical input", () => {
    const input = {
      today: TODAY,
      adapters: [
        adapter({ id: "a", kind: "rota", status: "connected", last_sync: ago(1) }),
        adapter({ id: "b", kind: "payroll", status: "not_configured" }),
        adapter({ id: "c", kind: "notifications", status: "error", error_log: [{ at: TODAY, message: "x" }] }),
      ],
    };
    const x = computeIntegrationHub(input);
    const y = computeIntegrationHub(input);
    expect(JSON.stringify(x)).toBe(JSON.stringify(y));
  });

  it("default registry is deterministic across calls", () => {
    const x = computeIntegrationHub({ today: TODAY });
    const y = computeIntegrationHub({ today: TODAY });
    expect(JSON.stringify(x)).toBe(JSON.stringify(y));
  });
});

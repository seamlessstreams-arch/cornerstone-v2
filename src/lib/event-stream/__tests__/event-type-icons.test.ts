import { describe, it, expect } from "vitest";
import { EVENT_TYPE_ICON, eventTypeIcon } from "../event-type-icons";
import { EVENT_TYPE_LABEL } from "../event-type-meta";

describe("event-type icons", () => {
  it("declares an icon for exactly the same event types as the label map", () => {
    expect(Object.keys(EVENT_TYPE_ICON).sort()).toEqual(Object.keys(EVENT_TYPE_LABEL).sort());
  });

  it("every icon is a renderable component (function/object), none undefined", () => {
    for (const [type, Icon] of Object.entries(EVENT_TYPE_ICON)) {
      expect(Icon, type).toBeTruthy();
      expect(["function", "object"]).toContain(typeof Icon);
    }
  });

  it("eventTypeIcon resolves known types and falls back for unknown ones", () => {
    expect(eventTypeIcon("notifiable_event")).toBe(EVENT_TYPE_ICON.notifiable_event);
    const fallback = eventTypeIcon("some_unknown_type");
    expect(fallback).toBeTruthy();
    // The fallback is the generic glyph, distinct from a real domain icon.
    expect(fallback).not.toBe(EVENT_TYPE_ICON.incident);
  });
});

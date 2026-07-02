import { describe, it, expect } from "vitest";
import { matchesKeyword, matchedKeywords, containsAnyKeyword } from "../keyword-match";

describe("matchesKeyword — word boundary (no internal-substring false positives)", () => {
  it("does not match a keyword embedded inside a larger word", () => {
    expect(matchesKeyword("the firefighter visited", "fight")).toBe(false);
    expect(matchesKeyword("she was decrying it", "crying")).toBe(false);
    expect(matchesKeyword("commissioning new furniture", "missing")).toBe(false);
    expect(matchesKeyword("playing in the classroom", "room")).toBe(false);
  });

  it("matches a genuine standalone occurrence", () => {
    expect(matchesKeyword("a fight broke out", "fight")).toBe(true);
    expect(matchesKeyword("the child went missing", "missing")).toBe(true);
    expect(matchesKeyword("he went to his room", "room")).toBe(true);
  });

  it("keeps natural suffix matches so concerns are not missed", () => {
    expect(matchesKeyword("inappropriate images were shared", "image")).toBe(true);
  });

  it("handles multi-word and hyphenated keywords", () => {
    expect(matchesKeyword("concerns about county lines", "county lines")).toBe(true);
    expect(matchesKeyword("self-harm marks were seen", "self-harm")).toBe(true);
  });

  it("is case-insensitive and null-safe", () => {
    expect(matchesKeyword("MISSING overnight", "missing")).toBe(true);
    expect(matchesKeyword("", "missing")).toBe(false);
    expect(matchesKeyword("some text", "")).toBe(false);
  });
});

describe("matchedKeywords / containsAnyKeyword", () => {
  it("returns only the keywords genuinely present", () => {
    expect(matchedKeywords("a fight in the classroom", ["fight", "room", "calm"])).toEqual(["fight"]);
  });

  it("containsAnyKeyword is true iff at least one matches at a boundary", () => {
    expect(containsAnyKeyword("the firefighter left", ["fight", "missing"])).toBe(false);
    expect(containsAnyKeyword("the child went missing", ["fight", "missing"])).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// CARA — FORM GOVERNANCE SERVICE TESTS
// Pure-function unit tests for field-change computation and schema-based
// form data validation (required fields, type-specific checks, conditional
// visibility).
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { _testing } from "../form-governance";

import type { FormFieldDefinition } from "@/types/operations";

const { computeFieldChanges, validateFormData } = _testing;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Build a minimal FormFieldDefinition with sensible defaults. */
function field(
  overrides: Partial<FormFieldDefinition> = {},
): FormFieldDefinition {
  return {
    id: "id" in overrides ? overrides.id! : "field-1",
    type: "type" in overrides ? overrides.type! : "text",
    label: "label" in overrides ? overrides.label! : "Test Field",
    name: "name" in overrides ? overrides.name! : "test_field",
    required: "required" in overrides ? overrides.required! : false,
    placeholder: "placeholder" in overrides ? overrides.placeholder : undefined,
    help_text: "help_text" in overrides ? overrides.help_text : undefined,
    default_value: "default_value" in overrides ? overrides.default_value : undefined,
    options: "options" in overrides ? overrides.options : undefined,
    validation: "validation" in overrides ? overrides.validation : undefined,
    conditional_on: "conditional_on" in overrides ? overrides.conditional_on : undefined,
    repeater_fields: "repeater_fields" in overrides ? overrides.repeater_fields : undefined,
  };
}

// ── computeFieldChanges ───────────────────────────────────────────────────

describe("computeFieldChanges", () => {
  it("returns empty object when both old and new data are empty", () => {
    const result = computeFieldChanges({}, {});
    expect(result).toEqual({});
  });

  it("returns empty object when old and new data are identical", () => {
    const data = { name: "Alice", age: 10 };
    const result = computeFieldChanges(data, data);
    expect(result).toEqual({});
  });

  it("detects a new key added in newData", () => {
    const result = computeFieldChanges({}, { name: "Alice" });
    expect(result).toEqual({ name: { old: null, new: "Alice" } });
  });

  it("detects a key removed in newData", () => {
    const result = computeFieldChanges({ name: "Alice" }, {});
    expect(result).toEqual({ name: { old: "Alice", new: null } });
  });

  it("detects a value change for an existing key", () => {
    const result = computeFieldChanges({ name: "Alice" }, { name: "Bob" });
    expect(result).toEqual({ name: { old: "Alice", new: "Bob" } });
  });

  it("tracks multiple changes at once", () => {
    const oldData = { a: 1, b: 2, c: 3 };
    const newData = { a: 1, b: 99, d: 4 };
    const result = computeFieldChanges(oldData, newData);
    expect(Object.keys(result)).toHaveLength(3);
    expect(result.b).toEqual({ old: 2, new: 99 });
    expect(result.c).toEqual({ old: 3, new: null });
    expect(result.d).toEqual({ old: null, new: 4 });
    expect(result.a).toBeUndefined();
  });

  it("detects deep object changes via JSON serialisation", () => {
    const oldData = { meta: { tags: ["a", "b"] } };
    const newData = { meta: { tags: ["a", "c"] } };
    const result = computeFieldChanges(oldData, newData);
    expect(result.meta).toEqual({
      old: { tags: ["a", "b"] },
      new: { tags: ["a", "c"] },
    });
  });

  it("treats identical nested objects as unchanged", () => {
    const nested = { level: { deep: true } };
    const result = computeFieldChanges(
      { config: nested },
      { config: { level: { deep: true } } },
    );
    expect(result).toEqual({});
  });

  it("uses null for undefined values in old data", () => {
    const result = computeFieldChanges(
      { a: undefined } as Record<string, unknown>,
      { a: "defined" },
    );
    expect(result.a).toEqual({ old: null, new: "defined" });
  });

  it("uses null for undefined values in new data", () => {
    const result = computeFieldChanges(
      { a: "defined" },
      { a: undefined } as Record<string, unknown>,
    );
    expect(result.a).toEqual({ old: "defined", new: null });
  });

  it("detects change from null to a value", () => {
    const result = computeFieldChanges({ x: null }, { x: "set" });
    expect(result.x).toEqual({ old: null, new: "set" });
  });

  it("detects change from a value to null", () => {
    const result = computeFieldChanges({ x: "set" }, { x: null });
    expect(result.x).toEqual({ old: "set", new: null });
  });

  it("considers empty array and non-empty array as different", () => {
    const result = computeFieldChanges({ tags: [] }, { tags: ["a"] });
    expect(result.tags).toEqual({ old: [], new: ["a"] });
  });
});

// ── validateFormData ──────────────────────────────────────────────────────

describe("validateFormData", () => {
  // -- empty / baseline --

  it("returns no errors for empty schema", () => {
    const errors = validateFormData([], { anything: "value" });
    expect(errors).toEqual([]);
  });

  it("returns no errors when optional fields are missing", () => {
    const schema = [field({ name: "notes", required: false })];
    const errors = validateFormData(schema, {});
    expect(errors).toEqual([]);
  });

  // -- required field checks --

  it("reports error when required field is missing (undefined)", () => {
    const schema = [field({ name: "name", label: "Name", required: true })];
    const errors = validateFormData(schema, {});
    expect(errors).toEqual([{ field: "name", message: "Name is required" }]);
  });

  it("reports error when required field is null", () => {
    const schema = [field({ name: "name", label: "Name", required: true })];
    const errors = validateFormData(schema, { name: null });
    expect(errors).toEqual([{ field: "name", message: "Name is required" }]);
  });

  it("reports error when required field is empty string", () => {
    const schema = [field({ name: "name", label: "Name", required: true })];
    const errors = validateFormData(schema, { name: "" });
    expect(errors).toEqual([{ field: "name", message: "Name is required" }]);
  });

  it("passes when required field has a value", () => {
    const schema = [field({ name: "name", label: "Name", required: true })];
    const errors = validateFormData(schema, { name: "Alice" });
    expect(errors).toEqual([]);
  });

  it("collects errors from multiple required fields", () => {
    const schema = [
      field({ id: "f1", name: "first", label: "First", required: true }),
      field({ id: "f2", name: "last", label: "Last", required: true }),
    ];
    const errors = validateFormData(schema, {});
    expect(errors).toHaveLength(2);
    expect(errors[0].field).toBe("first");
    expect(errors[1].field).toBe("last");
  });

  // -- string validation: min_length --

  it("reports error when string is shorter than min_length", () => {
    const schema = [
      field({
        name: "bio",
        label: "Bio",
        validation: { min_length: 5 },
      }),
    ];
    const errors = validateFormData(schema, { bio: "Hi" });
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe("Bio must be at least 5 characters");
  });

  it("passes when string meets min_length exactly", () => {
    const schema = [
      field({
        name: "bio",
        label: "Bio",
        validation: { min_length: 3 },
      }),
    ];
    const errors = validateFormData(schema, { bio: "Hey" });
    expect(errors).toEqual([]);
  });

  // -- string validation: max_length --

  it("reports error when string exceeds max_length", () => {
    const schema = [
      field({
        name: "code",
        label: "Code",
        validation: { max_length: 4 },
      }),
    ];
    const errors = validateFormData(schema, { code: "ABCDE" });
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe("Code must be at most 4 characters");
  });

  it("passes when string meets max_length exactly", () => {
    const schema = [
      field({
        name: "code",
        label: "Code",
        validation: { max_length: 4 },
      }),
    ];
    const errors = validateFormData(schema, { code: "ABCD" });
    expect(errors).toEqual([]);
  });

  // -- string validation: pattern --

  it("reports error when string does not match pattern", () => {
    const schema = [
      field({
        name: "email",
        label: "Email",
        validation: { pattern: "^[^@]+@[^@]+$" },
      }),
    ];
    const errors = validateFormData(schema, { email: "not-an-email" });
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe("Email format is invalid");
  });

  it("passes when string matches pattern", () => {
    const schema = [
      field({
        name: "email",
        label: "Email",
        validation: { pattern: "^[^@]+@[^@]+$" },
      }),
    ];
    const errors = validateFormData(schema, { email: "user@example.com" });
    expect(errors).toEqual([]);
  });

  // -- custom validation message --

  it("uses custom message when provided", () => {
    const schema = [
      field({
        name: "pin",
        label: "PIN",
        validation: { min_length: 4, message: "PIN must be 4 digits" },
      }),
    ];
    const errors = validateFormData(schema, { pin: "12" });
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe("PIN must be 4 digits");
  });

  // -- number validation: min / max --

  it("reports error when number is below min", () => {
    const schema = [
      field({
        name: "age",
        label: "Age",
        type: "number",
        validation: { min: 0 },
      }),
    ];
    const errors = validateFormData(schema, { age: -1 });
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe("Age must be at least 0");
  });

  it("passes when number equals min exactly", () => {
    const schema = [
      field({
        name: "age",
        label: "Age",
        type: "number",
        validation: { min: 0 },
      }),
    ];
    const errors = validateFormData(schema, { age: 0 });
    expect(errors).toEqual([]);
  });

  it("reports error when number exceeds max", () => {
    const schema = [
      field({
        name: "score",
        label: "Score",
        type: "number",
        validation: { max: 100 },
      }),
    ];
    const errors = validateFormData(schema, { score: 101 });
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe("Score must be at most 100");
  });

  it("passes when number equals max exactly", () => {
    const schema = [
      field({
        name: "score",
        label: "Score",
        type: "number",
        validation: { max: 100 },
      }),
    ];
    const errors = validateFormData(schema, { score: 100 });
    expect(errors).toEqual([]);
  });

  // -- skips validation for empty optional values --

  it("skips validation rules when optional field is undefined", () => {
    const schema = [
      field({
        name: "bio",
        label: "Bio",
        required: false,
        validation: { min_length: 10 },
      }),
    ];
    const errors = validateFormData(schema, {});
    expect(errors).toEqual([]);
  });

  it("skips validation rules when optional field is null", () => {
    const schema = [
      field({
        name: "bio",
        label: "Bio",
        required: false,
        validation: { min_length: 10 },
      }),
    ];
    const errors = validateFormData(schema, { bio: null });
    expect(errors).toEqual([]);
  });

  it("skips validation rules when optional field is empty string", () => {
    const schema = [
      field({
        name: "bio",
        label: "Bio",
        required: false,
        validation: { min_length: 10 },
      }),
    ];
    const errors = validateFormData(schema, { bio: "" });
    expect(errors).toEqual([]);
  });

  // -- conditional visibility: equals --

  it("skips required check when conditional_on equals is not met", () => {
    const schema = [
      field({
        name: "details",
        label: "Details",
        required: true,
        conditional_on: { field: "has_details", operator: "equals", value: true },
      }),
    ];
    const errors = validateFormData(schema, { has_details: false });
    expect(errors).toEqual([]);
  });

  it("enforces required check when conditional_on equals is met", () => {
    const schema = [
      field({
        name: "details",
        label: "Details",
        required: true,
        conditional_on: { field: "has_details", operator: "equals", value: true },
      }),
    ];
    const errors = validateFormData(schema, { has_details: true });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("details");
  });

  // -- conditional visibility: not_equals --

  it("skips validation when conditional_on not_equals is not met", () => {
    const schema = [
      field({
        name: "reason",
        label: "Reason",
        required: true,
        conditional_on: { field: "status", operator: "not_equals", value: "approved" },
      }),
    ];
    // status IS "approved", so not_equals condition is NOT met
    const errors = validateFormData(schema, { status: "approved" });
    expect(errors).toEqual([]);
  });

  it("enforces validation when conditional_on not_equals is met", () => {
    const schema = [
      field({
        name: "reason",
        label: "Reason",
        required: true,
        conditional_on: { field: "status", operator: "not_equals", value: "approved" },
      }),
    ];
    // status is "rejected", so not_equals condition IS met
    const errors = validateFormData(schema, { status: "rejected" });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("reason");
  });

  // -- conditional visibility: contains --

  it("skips validation when conditional_on contains is not met", () => {
    const schema = [
      field({
        name: "follow_up",
        label: "Follow Up",
        required: true,
        conditional_on: { field: "notes", operator: "contains", value: "urgent" },
      }),
    ];
    const errors = validateFormData(schema, { notes: "all good" });
    expect(errors).toEqual([]);
  });

  it("enforces validation when conditional_on contains is met", () => {
    const schema = [
      field({
        name: "follow_up",
        label: "Follow Up",
        required: true,
        conditional_on: { field: "notes", operator: "contains", value: "urgent" },
      }),
    ];
    const errors = validateFormData(schema, { notes: "this is urgent" });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("follow_up");
  });

  // -- conditional visibility: greater_than --

  it("skips validation when conditional_on greater_than is not met", () => {
    const schema = [
      field({
        name: "escalation_notes",
        label: "Escalation Notes",
        required: true,
        conditional_on: { field: "severity", operator: "greater_than", value: 3 },
      }),
    ];
    const errors = validateFormData(schema, { severity: 2 });
    expect(errors).toEqual([]);
  });

  it("enforces validation when conditional_on greater_than is met", () => {
    const schema = [
      field({
        name: "escalation_notes",
        label: "Escalation Notes",
        required: true,
        conditional_on: { field: "severity", operator: "greater_than", value: 3 },
      }),
    ];
    const errors = validateFormData(schema, { severity: 5 });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("escalation_notes");
  });

  // -- conditional visibility: less_than --

  it("skips validation when conditional_on less_than is not met", () => {
    const schema = [
      field({
        name: "improvement_plan",
        label: "Improvement Plan",
        required: true,
        conditional_on: { field: "score", operator: "less_than", value: 50 },
      }),
    ];
    const errors = validateFormData(schema, { score: 75 });
    expect(errors).toEqual([]);
  });

  it("enforces validation when conditional_on less_than is met", () => {
    const schema = [
      field({
        name: "improvement_plan",
        label: "Improvement Plan",
        required: true,
        conditional_on: { field: "score", operator: "less_than", value: 50 },
      }),
    ];
    const errors = validateFormData(schema, { score: 30 });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("improvement_plan");
  });

  // -- conditional field with validation rules when visible --

  it("applies validation rules when conditional field is visible and has value", () => {
    const schema = [
      field({
        name: "detail_text",
        label: "Detail Text",
        required: false,
        validation: { min_length: 10 },
        conditional_on: { field: "show_details", operator: "equals", value: true },
      }),
    ];
    const errors = validateFormData(schema, {
      show_details: true,
      detail_text: "short",
    });
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe("Detail Text must be at least 10 characters");
  });

  // -- conditional field: contains with null/undefined condition field --

  it("handles contains condition when condition field is null", () => {
    const schema = [
      field({
        name: "follow_up",
        label: "Follow Up",
        required: true,
        conditional_on: { field: "notes", operator: "contains", value: "urgent" },
      }),
    ];
    // notes is undefined — String(undefined) = "undefined", does not contain "urgent"
    const errors = validateFormData(schema, {});
    expect(errors).toEqual([]);
  });

  // -- multiple validation rules on same field --

  it("reports multiple validation errors for the same field", () => {
    const schema = [
      field({
        name: "code",
        label: "Code",
        validation: { min_length: 3, pattern: "^[A-Z]+$" },
      }),
    ];
    // "ab" is too short AND doesn't match uppercase pattern
    const errors = validateFormData(schema, { code: "ab" });
    expect(errors).toHaveLength(2);
    expect(errors[0].message).toBe("Code must be at least 3 characters");
    expect(errors[1].message).toBe("Code format is invalid");
  });

  // -- required field skips further validation on missing value --

  it("does not run validation rules when required field is missing", () => {
    const schema = [
      field({
        name: "pin",
        label: "PIN",
        required: true,
        validation: { min_length: 4, pattern: "^\\d+$" },
      }),
    ];
    const errors = validateFormData(schema, {});
    // Only the required error, not the validation errors
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe("PIN is required");
  });

  // -- number min and max combined --

  it("reports error for number below min with custom message", () => {
    const schema = [
      field({
        name: "rating",
        label: "Rating",
        type: "number",
        validation: { min: 1, max: 5, message: "Rating must be 1-5" },
      }),
    ];
    const errors = validateFormData(schema, { rating: 0 });
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe("Rating must be 1-5");
  });
});

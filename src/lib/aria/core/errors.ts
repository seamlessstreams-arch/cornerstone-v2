// ══════════════════════════════════════════════════════════════════════════════
// Cara Intelligence — Error Types
// ══════════════════════════════════════════════════════════════════════════════

export class AriaError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly safe: boolean;  // safe to expose to client

  constructor(message: string, code: string, statusCode: number = 500, safe: boolean = false) {
    super(message);
    this.name = "AriaError";
    this.code = code;
    this.statusCode = statusCode;
    this.safe = safe;
  }
}

export class AriaProviderError extends AriaError {
  public readonly provider: string;
  public readonly retryable: boolean;

  constructor(message: string, provider: string, retryable: boolean = false) {
    super(message, "PROVIDER_ERROR", 502, false);
    this.name = "AriaProviderError";
    this.provider = provider;
    this.retryable = retryable;
  }
}

export class AriaRoutingBlockedError extends AriaError {
  constructor(reason: string) {
    super(reason, "ROUTING_BLOCKED", 403, true);
    this.name = "AriaRoutingBlockedError";
  }
}

export class AriaPermissionDeniedError extends AriaError {
  constructor(role: string, action: string) {
    super(`Role '${role}' not permitted to: ${action}`, "PERMISSION_DENIED", 403, true);
    this.name = "AriaPermissionDeniedError";
  }
}

export class AriaApprovalRequiredError extends AriaError {
  constructor(taskType: string) {
    super(`Task '${taskType}' requires human approval before finalisation`, "APPROVAL_REQUIRED", 200, true);
    this.name = "AriaApprovalRequiredError";
  }
}

export class AriaCostLimitError extends AriaError {
  constructor(limit: string, current: number, max: number) {
    super(`Cost limit exceeded: ${limit} (${current.toFixed(4)} / ${max.toFixed(4)} GBP)`, "COST_LIMIT", 429, true);
    this.name = "AriaCostLimitError";
  }
}

export class AriaRedactionError extends AriaError {
  constructor(message: string) {
    super(message, "REDACTION_ERROR", 500, false);
    this.name = "AriaRedactionError";
  }
}

export class AriaSafetyBlockError extends AriaError {
  constructor(reason: string) {
    super(reason, "SAFETY_BLOCK", 403, true);
    this.name = "AriaSafetyBlockError";
  }
}

export class AriaTimeoutError extends AriaError {
  public readonly provider: string;

  constructor(provider: string, timeoutMs: number) {
    super(`Provider '${provider}' timed out after ${timeoutMs}ms`, "TIMEOUT", 504, true);
    this.name = "AriaTimeoutError";
    this.provider = provider;
  }
}

export class AriaRateLimitError extends AriaError {
  public readonly provider: string;
  public readonly retryAfterMs?: number;

  constructor(provider: string, retryAfterMs?: number) {
    super(`Provider '${provider}' rate limited`, "RATE_LIMITED", 429, true);
    this.name = "AriaRateLimitError";
    this.provider = provider;
    this.retryAfterMs = retryAfterMs;
  }
}

// ── Error Helpers ─────────────────────────────────────────────────────────

export function isRetryableError(error: unknown): boolean {
  if (error instanceof AriaProviderError) return error.retryable;
  if (error instanceof AriaTimeoutError) return true;
  if (error instanceof AriaRateLimitError) return true;
  return false;
}

export function sanitiseErrorForClient(error: unknown): { message: string; code: string } {
  if (error instanceof AriaError && error.safe) {
    return { message: error.message, code: error.code };
  }
  return {
    message: "An internal error occurred. Please try again or contact support.",
    code: "INTERNAL_ERROR",
  };
}

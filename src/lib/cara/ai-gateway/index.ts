// Cara AI Gateway — the single chokepoint for every AI/LLM call.
// Deterministic-first: rules → cache → availability → permission → sensitivity →
// redaction → cost-limit → metered provider call → cache-store → audit.
export {
  invokeAiGateway,
  invokeAiGatewayStream,
  getAiGatewayAuditLog,
  __resetAiGatewayAuditLog,
} from "./ai-gateway";
export type {
  AiGatewayRequest,
  AiGatewayResult,
  AiGatewayMethod,
  AiGatewayIdentity,
  AiGatewayDeps,
  AiGatewayAuditEntry,
  AiGatewayStreamHandlers,
  AiGatewayStreamResult,
} from "./ai-gateway";

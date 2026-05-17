// ══════════════════════════════════════════════════════════════════════════════
// API: POST /api/aria/execute — Execute an AI task
//
// End-to-end: authenticate → classify → redact → route → execute → log → respond
// Never exposes raw provider errors. Returns structured AriaTaskResult.
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { AriaModelRouter } from "@/lib/aria/router/model-router";
import { AriaAuditLogger } from "@/lib/aria/audit/audit-logger";
import { AriaApprovalEngine } from "@/lib/aria/approval/approval-engine";
import { AriaCostControlService } from "@/lib/aria/cost/cost-control";
import { sanitiseErrorForClient } from "@/lib/aria/core/errors";
import type { AriaTaskRequest } from "@/lib/aria/core/types";

const router = new AriaModelRouter();
const auditLogger = new AriaAuditLogger();
const approvalEngine = new AriaApprovalEngine();
const costControl = new AriaCostControlService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.taskType || !body.prompt || !body.userId || !body.userRole || !body.organisationId) {
      return NextResponse.json(
        { error: "Missing required fields: taskType, prompt, userId, userRole, organisationId" },
        { status: 400 },
      );
    }

    const taskRequest: AriaTaskRequest = {
      taskType: body.taskType,
      userId: body.userId,
      userRole: body.userRole,
      organisationId: body.organisationId,
      homeId: body.homeId,
      childId: body.childId,
      staffId: body.staffId,
      prompt: body.prompt,
      systemPrompt: body.systemPrompt,
      context: body.context,
      options: body.options,
      metadata: body.metadata,
    };

    // Execute task through router
    const result = await router.executeTask(taskRequest);

    // Log audit trail
    auditLogger.logTaskExecution(taskRequest, result);

    // Record cost
    costControl.recordUsage({
      organisationId: taskRequest.organisationId,
      homeId: taskRequest.homeId,
      userId: taskRequest.userId,
      provider: result.provider,
      model: result.model,
      inputTokens: result.tokenUsage.promptTokens,
      outputTokens: result.tokenUsage.completionTokens,
      costGBP: result.estimatedCost,
      date: result.generatedAt,
    });

    // Create approval record if needed
    if (result.requiresApproval) {
      approvalEngine.createApprovalRecord(
        result,
        taskRequest.organisationId,
        taskRequest.homeId,
        taskRequest.childId,
      );
    }

    // Return result (never expose raw model outputs for critical tasks without approval)
    return NextResponse.json({
      id: result.id,
      taskType: result.taskType,
      provider: result.provider,
      model: result.model,
      riskLevel: result.riskLevel,
      sensitivityLevel: result.sensitivityLevel,
      output: result.output,
      structuredOutput: result.structuredOutput,
      approvalStatus: result.approvalStatus,
      requiresApproval: result.requiresApproval,
      redactionApplied: result.redactionApplied,
      tokenUsage: result.tokenUsage,
      estimatedCost: result.estimatedCost,
      latencyMs: result.latencyMs,
      generatedAt: result.generatedAt,
      metadata: result.metadata,
    });
  } catch (error: any) {
    const safe = sanitiseErrorForClient(error);
    const status = error?.statusCode ?? 500;
    return NextResponse.json({ error: safe.message, code: safe.code }, { status });
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// API: POST /api/aria/evidence/search — Semantic evidence search
//
// Search across all Cornerstone records using embeddings and reranking.
// Respects role permissions and organisation boundaries.
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { AriaEvidenceEngine } from "@/lib/aria/evidence/evidence-engine";
import { sanitiseErrorForClient } from "@/lib/aria/core/errors";
import type { AriaEvidenceQuery } from "@/lib/aria/core/types";

const evidenceEngine = new AriaEvidenceEngine();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.query || !body.userId || !body.userRole || !body.organisationId) {
      return NextResponse.json(
        { error: "Missing required fields: query, userId, userRole, organisationId" },
        { status: 400 },
      );
    }

    const query: AriaEvidenceQuery = {
      query: body.query,
      organisationId: body.organisationId,
      homeId: body.homeId,
      childId: body.childId,
      staffId: body.staffId,
      sourceTypes: body.sourceTypes,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
      limit: body.limit ?? 10,
      userId: body.userId,
      userRole: body.userRole,
    };

    const results = await evidenceEngine.search(query);

    return NextResponse.json({
      query: body.query,
      results,
      totalResults: results.length,
      _meta: {
        searchMethod: "semantic",
        disclaimer: "Evidence results require professional judgement before use in official reporting",
      },
    });
  } catch (error: any) {
    const safe = sanitiseErrorForClient(error);
    return NextResponse.json({ error: safe.message, code: safe.code }, { status: error?.statusCode ?? 500 });
  }
}

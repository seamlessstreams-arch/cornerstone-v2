// ══════════════════════════════════════════════════════════════════════════════
// Shared Anthropic client — reads ANTHROPIC_API_KEY from process.env.
// In production this is set via the Supabase / Vercel environment dashboard.
// ══════════════════════════════════════════════════════════════════════════════

import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Configure it in your hosting environment (Supabase / Vercel dashboard).",
    );
  }
  return new Anthropic({ apiKey });
}

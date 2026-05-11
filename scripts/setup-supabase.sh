#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════════════════
# Cornerstone — Supabase Cloud Setup Script
#
# Run this interactively in your terminal to:
#   1. Login to Supabase CLI
#   2. Link to the Cornerstone project
#   3. Push all migrations (001–018)
#   4. Fetch and configure API keys in .env.local
#
# Usage:  bash scripts/setup-supabase.sh
# ══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

PROJECT_REF="qrowfwheedwimgskmefy"
ENV_FILE=".env.local"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       CORNERSTONE — Supabase Cloud Setup                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# ── Step 1: Check Supabase CLI ────────────────────────────────────────────
if ! command -v npx &>/dev/null; then
  echo "❌ npx not found. Install Node.js first."
  exit 1
fi

echo "✓ Supabase CLI: $(npx supabase --version 2>/dev/null || echo 'not found')"
echo ""

# ── Step 2: Login ─────────────────────────────────────────────────────────
echo "━━━ Step 1: Supabase Login ━━━"
echo "This will open your browser to authenticate."
echo ""
npx supabase login
echo ""
echo "✓ Logged in successfully"
echo ""

# ── Step 3: Link project ─────────────────────────────────────────────────
echo "━━━ Step 2: Link Project ━━━"
echo "Linking to project: $PROJECT_REF"
echo ""
npx supabase link --project-ref "$PROJECT_REF"
echo ""
echo "✓ Project linked"
echo ""

# ── Step 4: Push migrations ──────────────────────────────────────────────
echo "━━━ Step 3: Push Migrations ━━━"
echo "Pushing all migrations to Supabase Cloud..."
echo ""
npx supabase db push
echo ""
echo "✓ Migrations pushed"
echo ""

# ── Step 5: Get API keys ─────────────────────────────────────────────────
echo "━━━ Step 4: Configure API Keys ━━━"
echo ""
echo "Now you need to update $ENV_FILE with your real API keys."
echo ""
echo "Open your Supabase dashboard:"
echo "  https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
echo ""
echo "Copy the following values:"
echo "  1. anon / public key  → NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  2. service_role key   → SUPABASE_SERVICE_ROLE_KEY"
echo ""

read -p "Paste your service_role key (or press Enter to skip): " SERVICE_KEY
if [ -n "$SERVICE_KEY" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY|" "$ENV_FILE"
  else
    sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY|" "$ENV_FILE"
  fi
  echo "✓ Service role key updated in $ENV_FILE"
fi

read -p "Paste your anon/public key (or press Enter to skip): " ANON_KEY
if [ -n "$ANON_KEY" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" "$ENV_FILE"
  else
    sed -i "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" "$ENV_FILE"
  fi
  echo "✓ Anon key updated in $ENV_FILE"
fi

# ── Step 6: Enable Supabase ──────────────────────────────────────────────
echo ""
read -p "Enable Supabase mode now? (y/N): " ENABLE
if [[ "$ENABLE" =~ ^[Yy] ]]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_ENABLED=.*|NEXT_PUBLIC_SUPABASE_ENABLED=true|" "$ENV_FILE"
  else
    sed -i "s|NEXT_PUBLIC_SUPABASE_ENABLED=.*|NEXT_PUBLIC_SUPABASE_ENABLED=true|" "$ENV_FILE"
  fi
  echo "✓ Supabase enabled"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  ✅ Setup complete!                                         ║"
echo "║                                                              ║"
echo "║  Next steps:                                                 ║"
echo "║  1. Restart the dev server: npm run dev                      ║"
echo "║  2. Test: curl http://localhost:3001/api/v1/staff            ║"
echo "║  3. Check Supabase dashboard for data                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"

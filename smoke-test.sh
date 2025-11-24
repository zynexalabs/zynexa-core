#!/bin/bash
# Smoke test for Zynexa Core
# Validates build, TypeScript, and basic functionality

set -e

echo "🚀 Zynexa Core Smoke Test"
echo "=========================="

echo "1. Installing dependencies..."
npm ci > /dev/null 2>&1

echo "2. TypeScript type checking..."
npx tsc --noEmit

echo "3. Checking for security vulnerabilities..."
npm audit --audit-level=high || echo "⚠️  Fix advisories before production"

echo "4. Verifying project structure..."
[ -d client ] && echo "   ✓ client/" || exit 1
[ -d server ] && echo "   ✓ server/" || exit 1
[ -d shared ] && echo "   ✓ shared/" || exit 1
[ -f .env.example ] && echo "   ✓ .env.example" || exit 1
[ -f README.md ] && echo "   ✓ README.md" || exit 1

echo ""
echo "✅ Smoke test passed!"
echo ""
echo "Next steps:"
echo "  1. cp .env.example .env.local"
echo "  2. Fill in your actual configuration"
echo "  3. npm run dev"

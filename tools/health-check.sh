#!/bin/bash
# health-check.sh — Vérifie les routes API critiques d'Atlasphere
# Usage: ./tools/health-check.sh

set -e
BASE="https://atlasphere.onrender.com"

echo "🏥 Health Check Atlasphere — $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================"

declare -A ROUTES=(
  ["Home"]="/"
  ["Pi Config"]="/api/v1/pi-pay/config"
  ["Projects"]="/api/v1/entities/projects/all?limit=1"
  ["Validation Key"]="/validation-key.txt"
  ["Privacy"]="/privacy.html"
  ["Terms"]="/terms.html"
)

PASS=0
FAIL=0

for name in "${!ROUTES[@]}"; do
  route="${ROUTES[$name]}"
  HTTP=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}${route}")
  if [ "$HTTP" = "200" ]; then
    echo "  ✅ $name — HTTP $HTTP"
    PASS=$((PASS+1))
  else
    echo "  ❌ $name — HTTP $HTTP ($route)"
    FAIL=$((FAIL+1))
  fi
done

echo "================================================"
echo "Résultat: $PASS OK / $FAIL KO"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi

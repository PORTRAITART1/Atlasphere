#!/bin/bash
# deploy-frontend.sh — Pipeline complet de déploiement frontend
# Usage: ./tools/deploy-frontend.sh "message du commit"

set -e  # Arrêt immédiat en cas d'erreur

MSG="${1:-chore: rebuild frontend}"

echo "📦 [1/6] Build du frontend..."
cd app/frontend
npm run build

echo "📁 [2/6] Copie du build dans backend/static..."
rm -rf ../backend/static
cp -r dist ../backend/static

echo "🔍 [3/6] Vérification qu'aucune URL Atoms ne subsiste..."
cd ../..
if grep -rq "atoms.world" app/frontend/src app/frontend/.env 2>/dev/null; then
  echo "❌ ERREUR: URL Atoms détectée dans le code source. Abandon."
  exit 1
fi

echo "💾 [4/6] Commit + push..."
git add app/backend/static
git commit -m "$MSG" || echo "ℹ️ Rien à committer"
git push origin main

echo "⏳ [5/6] Attente du redéploiement Render (90s)..."
sleep 90

echo "🧪 [6/6] Vérification que le site est en ligne..."
HTTP=$(curl -s -o /dev/null -w "%{http_code}" https://atlasphere.onrender.com/)
if [ "$HTTP" = "200" ]; then
  echo "✅ Déploiement réussi — https://atlasphere.onrender.com (HTTP $HTTP)"
else
  echo "⚠️ Site répond HTTP $HTTP (peut être en cours de rebuild)"
fi

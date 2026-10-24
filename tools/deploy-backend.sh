#!/bin/bash
# deploy-backend.sh — Pipeline pour modifier le backend uniquement
# Usage: ./tools/deploy-backend.sh "message du commit" chemin/fichier.py [autre_fichier.py ...]

set -e

MSG="${1:-fix: backend update}"
shift || true
FILES="$@"

if [ -z "$FILES" ]; then
  echo "❌ Usage: ./tools/deploy-backend.sh \"message\" fichier1.py [fichier2.py ...]"
  exit 1
fi

echo "🔍 [1/4] Vérification syntaxe Python..."
for f in $FILES; do
  if [[ "$f" == *.py ]]; then
    python3 -c "import ast; ast.parse(open('$f').read())" || {
      echo "❌ Erreur de syntaxe dans $f. Abandon."
      exit 1
    }
    echo "  ✅ $f OK"
  fi
done

echo "💾 [2/4] Commit + push..."
git add $FILES
git commit -m "$MSG" || echo "ℹ️ Rien à committer"
git push origin main

echo "⏳ [3/4] Attente du redéploiement Render (60s)..."
sleep 60

echo "🧪 [4/4] Vérification backend..."
HTTP=$(curl -s -o /dev/null -w "%{http_code}" https://atlasphere.onrender.com/api/v1/pi-pay/config)
if [ "$HTTP" = "200" ]; then
  echo "✅ Backend en ligne — https://atlasphere.onrender.com (HTTP $HTTP)"
else
  echo "⚠️ Backend répond HTTP $HTTP (vérifier les logs Render)"
fi

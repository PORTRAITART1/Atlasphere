#!/bin/bash
# verify-pi.sh — Vérifie la cohérence de la configuration Pi
# Usage: ./tools/verify-pi.sh

set -e
BASE="https://atlasphere.onrender.com"

echo "🔍 Vérification Pi Atlasphere — $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================"

# 1. Mode Pi (doit être Mainnet)
echo "📍 Mode Pi (config):"
curl -s "${BASE}/api/v1/pi-pay/config" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f\"  • server_ready: {d.get('server_ready')}\")
print(f\"  • wallet_address: {d.get('wallet_address', 'N/A')}\")
print(f\"  • message: {d.get('message', 'N/A')}\")
" 2>/dev/null || echo "  ❌ Impossible de lire /config"

# 2. Validation Key (doit être la clé Mainnet 25dc632e...)
echo ""
echo "🔑 Validation Key (racine):"
KEY=$(curl -s "${BASE}/validation-key.txt")
if [[ "$KEY" == 25dc632e* ]]; then
  echo "  ✅ Clé Mainnet correcte (commence par 25dc632e...)"
elif [[ "$KEY" == 107cc949* ]]; then
  echo "  ❌ Clé Testnet détectée (107cc949...) — devrait être Mainnet"
else
  echo "  ⚠️ Clé inconnue: ${KEY:0:20}..."
fi

# 3. Adresse wallet backend (doit être le Multisig actuel GBWX4...)
echo ""
echo "💰 Adresse wallet dans le code backend:"
cd "$(dirname "$0")/.." 2>/dev/null || cd /mnt/c/Users/USER/Documents/Atlasphere
grep -n "ATLASPHERE_WALLET_ADDRESS" app/backend/services/pi_platform.py | sed 's/^/  /'

# 4. Aucune trace d'Atoms dans le frontend
echo ""
echo "🧹 Traces d'Atoms dans le frontend:"
if grep -rq "atoms.world" app/frontend/src app/frontend/.env 2>/dev/null; then
  echo "  ❌ URL Atoms encore présente"
else
  echo "  ✅ Aucune URL Atoms"
fi

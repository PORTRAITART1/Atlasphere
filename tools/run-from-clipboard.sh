#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-dry}"
CLIP=$(powershell.exe -command "Get-Clipboard" 2>/dev/null | tr -d '\r' || xclip -o 2>/dev/null || wl-paste 2>/dev/null || true)
[ -z "$CLIP" ] && { echo "❌ Presse-papiers vide."; exit 1; }
printf '%s' "$CLIP" | "$DIR/run-from-message.py" $([ "$MODE" = "run" ] && echo "--run")

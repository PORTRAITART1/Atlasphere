#!/bin/bash
# atlas.sh — Orchestrateur central des outils Atlasphere
# Mode "quiet" par défaut : résumé en 2 lignes si tout va bien.
# Détail complet dans logs/atlas-orchestrator.log

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/atlas-orchestrator.log"
mkdir -p "$LOG_DIR"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"; }

run_quiet() {
  local tool="$1"; shift
  log "Running (quiet): $tool $*"
  if "$SCRIPT_DIR/$tool" "$@" >> "$LOG_FILE" 2>&1; then
    echo "✅ $tool"
    return 0
  else
    local code=$?
    echo "❌ $tool (exit $code) — voir $LOG_FILE"
    tail -20 "$LOG_FILE" | sed 's/^/   /'
    return $code
  fi
}

run_verbose() {
  local tool="$1"; shift
  log "Running (verbose): $tool $*"
  "$SCRIPT_DIR/$tool" "$@"
}

usage() {
  cat <<'USAGE'
Atlasphere orchestrator

Usage:
  ./tools/atlas.sh check              # health check
  ./tools/atlas.sh verify             # Pi config check
  ./tools/atlas.sh deploy "msg"       # smart deploy (quiet, résumé 2 lignes)
  ./tools/atlas.sh deploy-v "msg"     # smart deploy (verbose, tout afficher)
  ./tools/atlas.sh full               # verify + check
  ./tools/atlas.sh commit "msg"       # git add -A + commit + push (pas de build)
  ./tools/atlas.sh logs               # affiche les 50 dernières lignes du log
  ./tools/atlas.sh help
USAGE
}

detect_changes() { git status --porcelain 2>/dev/null || true; }
has_frontend_changes() { detect_changes | awk '{print $2}' | grep -E '^app/frontend/' >/dev/null 2>&1; }
has_backend_changes() { detect_changes | awk '{print $2}' | grep -E '^(app/backend/|.*\.py$)' >/dev/null 2>&1; }

case "${1:-help}" in
  check)  run_verbose "health-check.sh" ;;
  verify) run_verbose "verify-pi.sh" ;;

  deploy|deploy-v)
    MODE="quiet"; [ "$1" = "deploy-v" ] && MODE="verbose"
    msg="${2:-deploy via atlas}"
    log "=== Deploy start: $msg (mode=$MODE) ==="

    CHANGED=$(detect_changes)
    if [ -z "$CHANGED" ]; then
      echo "ℹ️ Aucun changement. Rien à déployer."
      exit 0
    fi

    RUNNER="run_quiet"; [ "$MODE" = "verbose" ] && RUNNER="run_verbose"

    FE=0; BE=0
    has_frontend_changes && FE=1
    has_backend_changes  && BE=1

    echo "🚀 Deploy en cours (FE=$FE BE=$BE, mode=$MODE)..."
    [ "$MODE" = "quiet" ] && echo "   Détail dans $LOG_FILE"

    if [ "$FE" = "1" ]; then $RUNNER "deploy-frontend.sh" "$msg"; fi
    if [ "$BE" = "1" ]; then
      FILES=$(detect_changes | awk '{print $2}' | grep -E '^(app/backend/|.*\.py$)' || true)
      $RUNNER "deploy-backend.sh" "$msg" $FILES
    fi
    if [ "$FE" = "0" ] && [ "$BE" = "0" ]; then
      echo "⚠️ Changements hors frontend/backend — rien déployé :"
      echo "$CHANGED"
      exit 1
    fi

    log "=== Deploy end: OK ==="
    echo "🎯 Résumé: $( [ "$FE" = "1" ] && echo -n "FE ✅ " ; [ "$BE" = "1" ] && echo -n "BE ✅" )"
    ;;

  full)
    echo "🎯 Bilan Atlasphere"
    "$SCRIPT_DIR/verify-pi.sh" 2>&1 | tee -a "$LOG_FILE"
    echo ""
    "$SCRIPT_DIR/health-check.sh" 2>&1 | tee -a "$LOG_FILE"
    ;;

  commit)
    msg="${2:-chore: tools update}"
    git add -A
    git commit -m "$msg" || echo "ℹ️ Rien à committer"
    git push origin main
    echo "✅ Commit + push: $msg"
    ;;

  logs)
    echo "=== Dernières 50 lignes de $LOG_FILE ==="
    tail -50 "$LOG_FILE"
    ;;

  message|msg)
    shift || true
    "$SCRIPT_DIR/run-from-message.py" "$@"
    ;;

  clipboard|clip)
    shift || true
    "$SCRIPT_DIR/run-from-clipboard.sh" "$@"
    ;;

  help|-h|--help) usage ;;
  *) echo "Commande inconnue: $1"; usage; exit 1 ;;
esac

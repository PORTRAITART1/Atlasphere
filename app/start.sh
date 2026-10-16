#!/bin/bash
# Simple start script for Atoms deployment
# Author: portraitart
# Purpose: Launch backend + frontend on Atoms

set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo "[INFO] Script dir: $SCRIPT_DIR"
echo "[INFO] Backend dir: $BACKEND_DIR"
echo "[INFO] Frontend dir: $FRONTEND_DIR"

# Set PYTHONPATH to include root and backend
export PYTHONPATH="$SCRIPT_DIR:$BACKEND_DIR:$PYTHONPATH"
export IS_LAMBDA=false
export ENVIRONMENT=dev

# Check if .env exists
if [ -f "$SCRIPT_DIR/.env" ]; then
    echo "[INFO] Loading .env from $SCRIPT_DIR/.env"
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
fi

# Install backend dependencies if needed
echo "[INFO] Checking backend dependencies..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "[INFO] Installing backend dependencies..."
    cd "$BACKEND_DIR"
    pip install -r requirements.txt --quiet || pip3 install -r requirements.txt --quiet
fi

# Install frontend dependencies if needed
echo "[INFO] Checking frontend dependencies..."
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "[INFO] Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install --silent || pnpm install --silent
fi

# Build frontend
echo "[INFO] Building frontend..."
cd "$FRONTEND_DIR"
npm run build || pnpm build

# Start backend on port 8000 (in background)
echo "[INFO] Starting backend on port 8000..."
cd "$BACKEND_DIR"
python3 -m uvicorn app.backend.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to be ready
echo "[INFO] Waiting for backend..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        echo "[SUCCESS] Backend is ready!"
        break
    fi
    sleep 1
done

# Start frontend preview on port 3000 (foreground)
echo "[INFO] Starting frontend preview on port 3000..."
cd "$FRONTEND_DIR"
npx vite preview --host 0.0.0.0 --port 3000 --strictPort

# syntax=docker/dockerfile:1

# Build the React/Vite frontend.
FROM node:22-alpine AS frontend-build
WORKDIR /src/app/frontend
COPY app/frontend/package.json app/frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY app/frontend/ ./
ARG VITE_API_BASE_URL=
ARG VITE_PI_SANDBOX=false
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_PI_SANDBOX=${VITE_PI_SANDBOX}
RUN npm run build

# Runtime image: only Python/backend dependencies and built static assets.
FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app:/app/app/backend \
    IS_LAMBDA=false \
    ENVIRONMENT=prod \
    PORT=8000 \
    TESTNET=false \
    PI_API_BASE_URL=https://api.minepi.com \
    DATABASE_URL=sqlite+aiosqlite:////data/atlasphere.db
WORKDIR /app

RUN groupadd --system atlasphere \
    && useradd --system --gid atlasphere --home-dir /nonexistent --shell /usr/sbin/nologin atlasphere \
    && mkdir -p /data /app/app/backend/static \
    && chown -R atlasphere:atlasphere /data /app

COPY app/backend/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --disable-pip-version-check -r /tmp/requirements.txt
COPY --chown=atlasphere:atlasphere app/backend/ /app/app/backend/
COPY --from=frontend-build --chown=atlasphere:atlasphere /src/app/frontend/dist/ /app/app/backend/static/

USER atlasphere
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=4)" || exit 1
CMD ["sh", "-c", "exec python -m uvicorn app.backend.main:app --host 0.0.0.0 --port ${PORT}"]

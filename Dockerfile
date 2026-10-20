# Dockerfile for Atlasphere backend (FastAPI)
# Author: portraitart
# Purpose: Launch backend + frontend on Atoms

FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Set PYTHONPATH
ENV PYTHONPATH=/app:/app/backend
ENV IS_LAMBDA=false
ENV ENVIRONMENT=dev

# Install Python dependencies
RUN pip install --no-cache-dir -r app/backend/requirements.txt || \
    pip install --no-cache-dir -r requirements.txt

# Frontend is pre-built and copied via static/ (no build needed)

# Expose ports
EXPOSE 8000 3000

# Start backend
WORKDIR /app/app/backend
CMD rm -f ./atlasphere_render.db && python3 -m uvicorn app.backend.main:app --host 0.0.0.0 --port $PORT

#!/usr/bin/env bash

set -e

echo "🛑 Stopping Postgres container (data will be preserved)..."
docker compose down

echo "✅ Database stopped."

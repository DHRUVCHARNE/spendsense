#!/usr/bin/env bash

set -e

echo "🐘 Starting Postgres container..."
docker compose up -d

echo "⏳ Waiting for Postgres to be ready..."
sleep 5

echo "✅ Database is up and running!"

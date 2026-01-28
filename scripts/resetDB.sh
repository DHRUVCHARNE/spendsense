#!/usr/bin/env bash

set -e  # Stop on error

echo "🛑 Stopping and removing containers + volumes..."
docker compose down -v

echo "🧹 Removing old Drizzle folders..."
rm -rf drizzle
rm -rf migrations

echo "🐘 Starting fresh Postgres container..."
docker compose up -d

# Wait a few seconds for Postgres to be ready
echo "⏳ Waiting for Postgres to start..."
sleep 5

echo "🧬 Generating new Drizzle migrations..."
npx drizzle-kit generate

echo "🚀 Applying migrations to database..."
npx drizzle-kit migrate

echo "✅ Database reset and migrations applied successfully!"

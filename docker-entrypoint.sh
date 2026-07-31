#!/bin/sh
set -e

echo "=== Family Finance Entrypoint ==="

if [ -n "$DATABASE_URL" ]; then
  echo "Syncing Prisma schema tables to PostgreSQL..."
  npx prisma db push --accept-data-loss --skip-generate || echo "Prisma db push failed, continuing startup..."
fi

echo "Starting Next.js standalone server..."
exec node server.js

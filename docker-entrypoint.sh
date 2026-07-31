#!/bin/sh
set -e

echo "=== Family Finance Entrypoint ==="

if [ -n "$DATABASE_URL" ]; then
  echo "Syncing Prisma schema tables to PostgreSQL database..."
  npx prisma db push --schema=prisma/schema.prisma --accept-data-loss || echo "Prisma db push failed, continuing startup..."
fi

echo "Starting Next.js standalone server..."
exec node server.js

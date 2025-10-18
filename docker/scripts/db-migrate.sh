#!/bin/bash

# ========================================
# Run Database Migrations
# ========================================

set -e

echo "🔄 Running database migrations..."

# Run migrations inside the backend container
docker-compose exec backend npm run migration:run

echo ""
echo "✅ Migrations completed successfully!"
echo ""
echo "💡 Useful migration commands:"
echo "  - Generate migration: docker-compose exec backend npm run migration:generate -- -n MigrationName"
echo "  - Revert last migration: docker-compose exec backend npm run migration:revert"
echo ""

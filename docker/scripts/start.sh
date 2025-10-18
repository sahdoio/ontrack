#!/bin/bash

# ========================================
# Start OnTrack Docker Services
# ========================================

set -e

echo "🚀 Starting OnTrack services..."

# Check if .env file exists, if not create from .env.docker
if [ ! -f .env ]; then
  echo "📝 Creating .env from .env.docker..."
  cp .env.docker .env
fi

# Start Docker Compose services
docker-compose up -d

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📦 Available services:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - Backend API: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: ./docker/scripts/logs.sh"
echo "  - Stop services: ./docker/scripts/stop.sh"
echo "  - Run migrations: ./docker/scripts/db-migrate.sh"
echo ""

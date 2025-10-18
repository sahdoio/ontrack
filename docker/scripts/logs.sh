#!/bin/bash

# ========================================
# View OnTrack Docker Logs
# ========================================

set -e

# Check if a service name was provided
if [ -n "$1" ]; then
  echo "📋 Viewing logs for service: $1"
  docker-compose logs -f "$1"
else
  echo "📋 Viewing logs for all services (press Ctrl+C to exit)"
  echo ""
  echo "💡 Tip: To view logs for a specific service, run: ./docker/scripts/logs.sh <service-name>"
  echo "   Available services: postgres, redis, backend"
  echo ""
  docker-compose logs -f
fi

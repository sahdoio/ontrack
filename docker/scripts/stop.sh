#!/bin/bash

# ========================================
# Stop OnTrack Docker Services
# ========================================

set -e

echo "🛑 Stopping OnTrack services..."

# Stop Docker Compose services
docker-compose down

echo ""
echo "✅ Services stopped successfully!"
echo ""
echo "💡 Tip: To remove volumes as well, run: docker-compose down -v"
echo ""

# Docker Setup for OnTrack

This directory contains Docker configuration for local development of the OnTrack application.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Make scripts executable** (first time only):
   ```bash
   chmod +x docker/scripts/*.sh
   ```

2. **Start all services**:
   ```bash
   ./docker/scripts/start.sh
   ```

3. **View logs**:
   ```bash
   # All services
   ./docker/scripts/logs.sh

   # Specific service
   ./docker/scripts/logs.sh backend
   ```

4. **Stop all services**:
   ```bash
   ./docker/scripts/stop.sh
   ```

## Services

The Docker Compose setup includes:

- **PostgreSQL 15** (port 5432)
  - Database: `ontrack`
  - User: `postgres`
  - Password: `postgres`

- **Redis 7** (port 6379)
  - Used for caching and rate limiting

- **Backend API** (port 3000)
  - NestJS application with hot reload
  - Automatically restarts on code changes

## Environment Variables

Environment variables are defined in `.env.docker` with sensible defaults for local development.

To customize:
1. Copy `.env.docker` to `.env`
2. Modify values in `.env`
3. Restart services

## Database Migrations

Run migrations after starting services:

```bash
./docker/scripts/db-migrate.sh
```

Other migration commands:
```bash
# Generate a new migration
docker-compose exec backend npm run migration:generate -- -n MigrationName

# Revert last migration
docker-compose exec backend npm run migration:revert
```

## Accessing Services

- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Useful Commands

```bash
# Execute commands in backend container
docker-compose exec backend npm run <command>

# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d ontrack

# Access Redis CLI
docker-compose exec redis redis-cli

# Rebuild containers
docker-compose build

# Remove all containers and volumes
docker-compose down -v
```

## Hot Reload

The backend service is configured with volume mounting for hot reload:
- Source code: `./apps/core` → `/app` (in container)
- Changes to source files will automatically trigger a restart

## Directory Structure

```
docker/
├── backend/
│   ├── Dockerfile          # Multi-stage build (dev, builder, prod)
│   └── .dockerignore       # Files to exclude from Docker context
├── frontend/
│   └── Dockerfile          # Placeholder for Next.js (future)
├── scripts/
│   ├── start.sh            # Start all services
│   ├── stop.sh             # Stop all services
│   ├── logs.sh             # View logs
│   └── db-migrate.sh       # Run migrations
└── README.md               # This file
```

## Troubleshooting

**Port conflicts**: If ports 3000, 5432, or 6379 are already in use, modify the port mappings in `docker-compose.yml`.

**Permission issues**: If you get permission errors with scripts, run:
```bash
chmod +x docker/scripts/*.sh
```

**Database connection issues**: Ensure PostgreSQL is healthy:
```bash
docker-compose ps
```

**Clear everything and start fresh**:
```bash
docker-compose down -v
./docker/scripts/start.sh
```

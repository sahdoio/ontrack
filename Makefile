DC=docker compose --file docker-compose.yml
DC_EXEC=$(DC) exec backend
DC_EXEC_FRONT=$(DC) exec frontend
DC_EXEC_DB=$(DC) exec postgres

.PHONY: go up down build restart sh sh-front db-sh redis-sh install install-front test test-watch test-cov test-e2e db-migrate db-migrate-gen db-migrate-revert db-seed db-reset logs logs-backend logs-front logs-db lint lint-front lint-fix lint-fix-front format format-front build-front clear help

%:
	@:

go:
	@echo "Starting OnTrack development environment..."
	make down
	make up
	@echo "Waiting for services to be healthy..."
	sleep 5
	make install
	make install-front
	make db-migrate
	@echo "OnTrack is ready!"
	@echo "Backend: http://localhost:3000"
	@echo "Frontend: http://localhost:3001"

go-test:
	@echo "Setting up test environment..."
	make down
	docker volume rm -f ontrack_postgres_data || true
	make up
	sleep 5
	make install
	make db-migrate
	@echo "Test environment ready!"

up:
	@echo "Starting Docker services..."
	$(DC) up -d --build

down:
	@echo "Stopping Docker services..."
	$(DC) down

build:
	@echo "Rebuilding Docker containers..."
	$(DC) build --no-cache

restart:
	@echo "Restarting services..."
	make down
	make up

sh:
	$(DC_EXEC) sh

sh-front:
	$(DC_EXEC_FRONT) sh

db-sh:
	$(DC_EXEC_DB) psql -U postgres -d ontrack

redis-sh:
	$(DC) exec redis redis-cli

install:
	@echo "Installing dependencies..."
	$(DC_EXEC) npm install

install-front:
	@echo "Installing frontend dependencies..."
	$(DC_EXEC_FRONT) npm install

update:
	@echo "Updating dependencies..."
	$(DC_EXEC) npm update

audit:
	@echo "Auditing dependencies..."
	$(DC_EXEC) npm audit

audit-fix:
	@echo "Fixing dependency vulnerabilities..."
	$(DC_EXEC) npm audit fix

test:
	@echo "Running tests..."
	$(DC_EXEC) npm run test $(wordlist 2, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS))

test-watch:
	@echo "Running tests in watch mode..."
	$(DC_EXEC) npm run test:watch

test-cov:
	@echo "Running tests with coverage..."
	$(DC_EXEC) npm run test:cov

test-e2e:
	@echo "Running e2e tests..."
	$(DC_EXEC) npm run test:e2e

test-debug:
	@echo "Running tests in debug mode..."
	$(DC_EXEC) npm run test:debug

db-migrate:
	@echo "Running database migrations..."
	$(DC_EXEC) npm run migration:run

db-migrate-gen:
	@echo "Generating migration..."
	@read -p "Enter migration name: " name; \
	$(DC_EXEC) npm run migration:generate -- -n $$name

db-migrate-revert:
	@echo "Reverting last migration..."
	$(DC_EXEC) npm run migration:revert

db-migrate-create:
	@echo "Creating empty migration..."
	@read -p "Enter migration name: " name; \
	$(DC_EXEC) npm run migration:create -- -n $$name

db-migrate-status:
	@echo "Migration status..."
	$(DC_EXEC) npm run migration:show

db-seed:
	@echo "Seeding database..."
	$(DC_EXEC) npm run seed

db-reset:
	@echo "Resetting database..."
	@echo "This will destroy all data. Press Ctrl+C to cancel."
	@sleep 3
	make db-drop
	sleep 2
	make db-migrate
	make db-seed
	@echo "Database reset complete!"

db-drop:
	@echo "Dropping all tables..."
	$(DC_EXEC) npm run schema:drop

db-sync:
	@echo "Syncing database schema (may lose data)..."
	@echo "Press Ctrl+C to cancel or wait 5 seconds..."
	@sleep 5
	$(DC_EXEC) npm run schema:sync

logs:
	$(DC) logs -f --tail=100

logs-backend:
	$(DC) logs -f --tail=100 backend

logs-front:
	$(DC) logs -f --tail=100 frontend

logs-db:
	$(DC) logs -f --tail=100 postgres

logs-redis:
	$(DC) logs -f --tail=100 redis

log:
	@echo "Tailing application log file..."
	@$(DC_EXEC) tail -f /app/logs/application.log -n 100 2>/dev/null || echo "No application log file found yet. Make sure the backend is running."

log-local:
	@echo "Tailing local application log file..."
	@tail -f apps/core/logs/application.log -n 100 2>/dev/null || echo "No application log file found yet. Make sure the backend has started at least once."

log-clear:
	@echo "Clearing application log file..."
	@$(DC_EXEC) rm -f /app/logs/application.log && echo "Log file cleared" || echo "Could not clear log file"

log-clear-local:
	@echo "Clearing local application log file..."
	@rm -f apps/core/logs/application.log && echo "Log file cleared" || echo "No log file to clear"

lint:
	@echo "Running linter..."
	$(DC_EXEC) npm run lint

lint-front:
	@echo "Running frontend linter..."
	$(DC_EXEC_FRONT) npm run lint

lint-fix:
	@echo "Fixing linting issues..."
	$(DC_EXEC) npm run lint:fix

lint-fix-front:
	@echo "Fixing frontend linting issues..."
	$(DC_EXEC_FRONT) npm run lint

typecheck:
	@echo "Checking TypeScript errors..."
	$(DC_EXEC) npx tsc --noEmit

typecheck-front:
	@echo "Checking frontend TypeScript errors..."
	$(DC_EXEC_FRONT) npx tsc --noEmit

format:
	@echo "Formatting code..."
	$(DC_EXEC) npm run format

format-front:
	@echo "Formatting frontend code..."
	$(DC_EXEC_FRONT) npm run format

build:
	@echo "Running type check..."
	$(DC_EXEC) npm run build

build-front:
	@echo "Building frontend..."
	$(DC_EXEC_FRONT) npm run build

clear:
	@echo "Clearing caches..."
	$(DC_EXEC) npm cache clean --force
	$(DC) exec redis redis-cli FLUSHALL
	@echo "Caches cleared!"

clean:
	@echo "Cleaning and reinstalling..."
	$(DC_EXEC) rm -rf node_modules package-lock.json
	make install

clean-docker:
	@echo "This will remove all containers, volumes, and networks!"
	@echo "Press Ctrl+C to cancel or wait 5 seconds..."
	@sleep 5
	$(DC) down -v
	docker system prune -f

start-prod:
	@echo "Starting production server..."
	$(DC_EXEC) npm run start:prod

dev:
	@echo "Starting development server..."
	$(DC_EXEC) npm run start:dev

generate:
	@echo "Generating NestJS resource..."
	@read -p "Enter resource name: " name; \
	$(DC_EXEC) nest generate resource $$name

health:
	@echo "Checking service health..."
	@echo "\nDocker services:"
	$(DC) ps
	@echo "\nPostgreSQL:"
	@$(DC_EXEC_DB) pg_isready -U postgres || echo "PostgreSQL not ready"
	@echo "\nRedis:"
	@$(DC) exec redis redis-cli ping || echo "Redis not ready"
	@echo "\nBackend:"
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "Backend is running" || echo "Backend not responding"

help:
	@echo "OnTrack Development Commands"
	@echo "============================"
	@echo ""
	@echo "Quick Start:"
	@echo "  make go              - Full setup (down, up, install, migrate)"
	@echo "  make go-test         - Fresh test environment setup"
	@echo ""
	@echo "Docker:"
	@echo "  make up              - Start all services"
	@echo "  make down            - Stop all services"
	@echo "  make build           - Rebuild containers"
	@echo "  make restart         - Restart all services"
	@echo ""
	@echo "Shell Access:"
	@echo "  make sh              - Backend container shell"
	@echo "  make sh-front        - Frontend container shell"
	@echo "  make db-sh           - PostgreSQL shell"
	@echo "  make redis-sh        - Redis CLI"
	@echo ""
	@echo "Dependencies:"
	@echo "  make install         - Install backend dependencies"
	@echo "  make install-front   - Install frontend dependencies"
	@echo "  make update          - Update dependencies"
	@echo "  make audit           - Audit dependencies"
	@echo ""
	@echo "Testing:"
	@echo "  make test            - Run tests"
	@echo "  make test-watch      - Run tests in watch mode"
	@echo "  make test-cov        - Run tests with coverage"
	@echo "  make test-e2e        - Run e2e tests"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate      - Run migrations"
	@echo "  make db-migrate-gen  - Generate new migration"
	@echo "  make db-migrate-revert - Revert last migration"
	@echo "  make db-seed         - Seed database"
	@echo "  make db-reset        - Reset database (revert + migrate + seed)"
	@echo ""
	@echo "Logs:"
	@echo "  make logs            - View all logs"
	@echo "  make logs-backend    - View backend logs"
	@echo "  make logs-front      - View frontend logs"
	@echo "  make logs-db         - View PostgreSQL logs"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint            - Run backend linter"
	@echo "  make lint-front      - Run frontend linter"
	@echo "  make lint-fix        - Fix backend linting issues"
	@echo "  make lint-fix-front  - Fix frontend linting issues"
	@echo "  make format          - Format backend code"
	@echo "  make format-front    - Format frontend code"
	@echo "  make build-front     - Build frontend for production"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clear           - Clear caches"
	@echo "  make clean           - Clean and reinstall"
	@echo "  make clean-docker    - Remove all Docker resources"
	@echo ""
	@echo "Other:"
	@echo "  make health          - Check service health"
	@echo "  make help            - Show this help"

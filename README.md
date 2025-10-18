# OnTrack - Peer-to-Peer Payment Splitter

**Author:** Lucas Sahdo
**Date:** October 2025

Backend system for splitting expenses among group members using **Clean Architecture + DDD**, built with **NestJS + TypeScript + AWS**.

## Overview

OnTrack is a backend system designed to split expenses among group members. It demonstrates Clean Architecture principles combined with Domain-Driven Design (DDD), implementing 6 bounded contexts to handle different aspects of the business domain.

### Core Features

- **Group & Member Management** - Create and manage groups with multiple members
- **Expense Recording** - Record expenses with automatic split calculation
- **Balance Calculation** - Calculate who owes whom in each group
- **Debt Settlement** - Track debt payments between members
- **CSV Batch Upload** - Process bulk expenses via S3
- **Event-driven Notifications** - Send email notifications via SNS/SQS

---

## Tech Stack

- **Runtime:** Node.js 23.11
- **Language:** TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL with TypeORM
- **Cloud:** AWS (S3, SNS, SQS)
- **Testing:** Jest
- **Validation:** class-validator, class-transformer

---

## Architecture

### Clean Architecture (4 Layers)

The project follows Clean Architecture principles with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
│  (Controllers, DTOs, Middleware)             │
└─────────────────┬───────────────────────────┘
                  │ depends on
┌─────────────────▼───────────────────────────┐
│         Application Layer                    │
│  (Use Cases, Ports/Interfaces, DTOs)        │
└─────────────────┬───────────────────────────┘
                  │ depends on
┌─────────────────▼───────────────────────────┐
│         Domain Layer                         │
│  (Entities, Events, Business Rules)         │
│  ★ Zero External Dependencies               │
└─────────────────▲───────────────────────────┘
                  │ implemented by
┌─────────────────┴───────────────────────────┐
│         Infrastructure Layer                 │
│  (Database, AWS, External Services)         │
└─────────────────────────────────────────────┘
```

**Key Principle:** The Domain layer has zero external dependencies and contains pure business logic.

---

## Bounded Contexts (DDD)

The system is organized into 6 bounded contexts:

### 1. Group Management Context
- **Aggregate:** Group (with Members)
- **Responsibility:** Manage groups and membership
- **Events:** `GroupCreated`, `MemberAddedToGroup`

### 2. Expense Management Context
- **Aggregate:** Expense (with ExpenseSplits)
- **Responsibility:** Record expenses, calculate splits
- **Events:** `ExpenseRecorded`, `BatchExpensesProcessed`
- **Domain Service:** SplitCalculator

### 3. Balance Context
- **Aggregate:** Balance (read model)
- **Responsibility:** Calculate member balances
- **Events:** `BalanceCalculated`
- **Domain Service:** BalanceCalculator

### 4. Settlement Context
- **Aggregate:** Settlement
- **Responsibility:** Track debt payments
- **Events:** `DebtSettled`

### 5. Notification Context
- **Responsibility:** Send email notifications
- **Consumes:** `ExpenseRecorded`, `DebtSettled` events

### 6. File Processing Context
- **Responsibility:** CSV upload and processing
- **Events:** `CSVUploadStarted`, `CSVProcessingCompleted`

---

## Project Structure

```
core/
├── src/
│   ├── presentation/              # Presentation Layer
│   │   ├── group-management/
│   │   │   ├── controllers/
│   │   │   └── dto/
│   │   ├── expense-management/
│   │   ├── balance/
│   │   ├── settlement/
│   │   ├── file-processing/
│   │   └── shared/
│   │       ├── filters/          # Exception filters
│   │       ├── interceptors/     # Response interceptors
│   │       └── middleware/       # HTTP middleware
│   │
│   ├── application/               # Application Layer
│   │   ├── group-management/
│   │   │   ├── use-cases/        # Application use cases
│   │   │   ├── ports/            # Interfaces/contracts
│   │   │   └── dto/              # Data transfer objects
│   │   ├── expense-management/
│   │   ├── balance/
│   │   ├── settlement/
│   │   ├── notification/
│   │   ├── file-processing/
│   │   └── shared/
│   │       ├── interfaces/
│   │       └── exceptions/
│   │
│   ├── domain/                    # Domain Layer (Pure Business Logic)
│   │   ├── group-management/
│   │   │   ├── entities/         # Domain entities
│   │   │   ├── events/           # Domain events
│   │   │   ├── repositories/     # Repository interfaces
│   │   │   └── services/         # Domain services
│   │   ├── expense-management/
│   │   ├── balance/
│   │   ├── settlement/
│   │   ├── notification/
│   │   ├── file-processing/
│   │   └── shared/
│   │       ├── events/           # Shared domain events
│   │       ├── interfaces/       # Shared interfaces
│   │       ├── value-objects/    # Value objects
│   │       └── exceptions/       # Domain exceptions
│   │
│   ├── infrastructure/            # Infrastructure Layer
│   │   ├── group-management/
│   │   │   ├── repositories/     # Repository implementations
│   │   │   └── modules/          # NestJS modules
│   │   ├── expense-management/
│   │   ├── balance/
│   │   ├── settlement/
│   │   ├── notification/
│   │   │   └── adapters/         # Email service adapters
│   │   ├── file-processing/
│   │   │   └── adapters/         # S3 adapters
│   │   ├── database/
│   │   │   ├── entities/         # TypeORM entities
│   │   │   ├── migrations/       # Database migrations
│   │   │   └── seeds/            # Database seeders
│   │   ├── aws/
│   │   │   ├── s3/               # S3 service
│   │   │   ├── sns/              # SNS service
│   │   │   └── sqs/              # SQS service
│   │   └── shared/
│   │       ├── config/
│   │       └── modules/
│   │
│   ├── config/                    # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── aws.config.ts
│   │
│   ├── app.module.ts              # Main application module
│   └── main.ts                    # Application entry point
│
├── test/
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # End-to-end tests
│
├── .env.example                   # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Make (optional, but recommended)

### Quick Start with Make

1. Clone the repository:
```bash
git clone <repository-url>
cd ontrack
```

2. Make scripts executable (first time only):
```bash
chmod +x docker/scripts/*.sh
```

3. Start everything with one command:
```bash
make go
```

This will:
- Stop any running containers
- Start PostgreSQL, Redis, and Backend services
- Install dependencies
- Run database migrations
- Start the development server with hot reload

The API will be available at `http://localhost:3000`

### Common Make Commands

```bash
# Quick start (full setup)
make go

# Start services
make up

# Stop services
make down

# View logs
make logs              # All services
make logs-backend      # Backend only

# Access shells
make sh                # Backend shell
make db-sh            # PostgreSQL shell
make redis-sh         # Redis CLI

# Database operations
make db-migrate        # Run migrations
make db-migrate-gen    # Generate new migration
make db-seed          # Seed database
make db-reset         # Reset database (⚠️ destroys data)

# Testing
make test             # Run tests
make test-cov         # Run with coverage
make test-e2e         # E2E tests

# Code quality
make lint             # Run linter
make format           # Format code

# Help
make help             # Show all commands
```

### Manual Setup (without Make)

If you prefer not to use Make:

```bash
# Start services
docker-compose up -d

# Install dependencies
docker-compose exec backend npm install

# Run migrations
docker-compose exec backend npm run migration:run

# View logs
docker-compose logs -f backend
```

### Environment Variables

Environment variables are pre-configured in `.env.docker` with defaults for local development.

To customize:
```bash
cp .env.docker .env
# Edit .env with your configuration
```

### Running Without Docker

If you prefer to run without Docker:

1. Install dependencies:
```bash
cd apps/core
npm install
```

2. Set up PostgreSQL and Redis locally

3. Configure `.env` file

4. Run migrations:
```bash
npm run migration:run
```

5. Start the application:
```bash
npm run start:dev
```

---

## Testing

### With Make (recommended)

```bash
# Run all tests
make test

# Run tests in watch mode
make test-watch

# Run tests with coverage
make test-cov

# Run e2e tests
make test-e2e

# Run specific test file
make test path/to/test.spec.ts
```

### Without Make

```bash
# Run unit tests
docker-compose exec backend npm run test

# Run unit tests in watch mode
docker-compose exec backend npm run test:watch

# Run e2e tests
docker-compose exec backend npm run test:e2e

# Generate test coverage
docker-compose exec backend npm run test:cov
```

---

## Environment Variables

See `.env.example` for all available configuration options:

- **Application:** PORT, NODE_ENV
- **Database:** DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
- **AWS:** AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
- **S3:** S3_BUCKET_NAME
- **SNS:** SNS_TOPIC_ARN
- **SQS:** SQS_NOTIFICATION_QUEUE_URL, SQS_CSV_PROCESSING_QUEUE_URL
- **Email:** EMAIL_FROM

---

## API Documentation

API documentation will be available via Swagger at `/api/docs` when the application is running.

---

## Development Guidelines

### Clean Architecture Principles

1. **Dependency Rule:** Dependencies only point inward. Outer layers depend on inner layers, never vice versa.
2. **Domain Independence:** Domain layer has zero external dependencies.
3. **Use Cases:** Application layer orchestrates domain logic without implementing business rules.
4. **Interfaces:** Use ports/interfaces to invert dependencies.

### Domain-Driven Design

1. **Bounded Contexts:** Keep contexts isolated with clear boundaries.
2. **Aggregates:** Ensure consistency boundaries are respected.
3. **Domain Events:** Use events for cross-context communication.
4. **Ubiquitous Language:** Use business terminology in code.
# 🎯 OnTrack

> **Personal Finance Management Platform with Automated Expense Tracking**

A comprehensive financial management solution that replaces traditional spreadsheet-based tracking with intelligent automation, real-time analytics, and multi-channel integration. Built with modern technologies and cloud-native architecture.

[![Node.js](https://img.shields.io/badge/Node.js-23.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)
[![AWS](https://img.shields.io/badge/AWS-Serverless-orange.svg)](https://aws.amazon.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **📊 Smart Expense Tracking** - Automated categorization and payment status management
- **💰 Income Management** - Multiple income sources with recurring entries support
- **📱 WhatsApp Integration** - Quick expense entry and budget notifications via bot
- **🎨 Real-time Dashboard** - Live financial overview with category breakdowns
- **💱 Multi-Currency Support** - BRL ↔ USD conversion with live exchange rates
- **📈 Analytics & Reports** - Comprehensive financial insights and trend analysis
- **🔔 Smart Alerts** - Budget thresholds and payment reminders
- **☁️ Cloud-Native** - Fully serverless AWS architecture

## 🏗️ Architecture

```
OnTrack/
├── apps/
│   ├── front/           # Frontend application (Next.js/React)
│   ├── api/             # Main NestJS API server
│   ├── lambdas/         # AWS Lambda microservices
│   │   ├── auth-service/
│   │   ├── analytics-processor/
│   │   ├── notification-service/
│   │   └── file-processor/
│   └── mobile/          # Mobile application (React Native)
├── packages/
│   ├── shared/          # Shared types and utilities
│   ├── ui/              # Shared UI components
│   └── config/          # Shared configuration
├── infrastructure/
│   ├── aws-cdk/         # Infrastructure as Code
│   └── docker/          # Container configurations
├── docs/                # Documentation
└── tools/               # Development tools and scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 23.x or higher
- **npm** 10.x or higher
- **Docker** & **Docker Compose**
- **AWS CLI** (for deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahdoio/ontrack.git
   cd ontrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development services**
   ```bash
   # Start databases and local AWS services
   docker-compose up -d
   
   # Start all applications
   npm run dev
   ```

5. **Access the applications**
    - 🌐 **Frontend**: http://localhost:3000
    - 🔌 **API**: http://localhost:3001
    - 📖 **API Docs**: http://localhost:3001/api/docs
    - 💾 **Database**: localhost:5432 (PostgreSQL)
    - 🗄️ **Analytics**: localhost:27017 (MongoDB)

## 📦 Applications

### Frontend (`apps/front`)
Modern React-based web application with real-time dashboard and responsive design.

**Tech Stack**: Next.js, TypeScript, Tailwind CSS, Zustand

```bash
cd apps/front
npm run dev    # Development server
npm run build  # Production build
```

### API (`apps/api`)
Core NestJS backend with PostgreSQL database and Redis caching.

**Tech Stack**: NestJS, TypeORM, PostgreSQL, Redis, Bull Queue

```bash
cd apps/api
npm run start:dev  # Development with hot reload
npm run test       # Run tests
npm run migration:generate  # Generate DB migration
```

### Lambda Functions (`apps/lambdas`)
Serverless microservices for specialized operations.

**Services**:
- **Auth Service**: JWT validation and user management
- **Analytics Processor**: Financial calculations and insights
- **Notification Service**: WhatsApp and email notifications
- **File Processor**: Receipt uploads and report generation

```bash
cd apps/lambdas
npm run build      # Build all lambdas
npm run deploy     # Deploy to AWS
```

## 🔧 Development

### Available Scripts

```bash
# Root level commands
npm run dev           # Start all services in development
npm run build         # Build all applications
npm run test          # Run all tests
npm run lint          # Lint all packages
npm run format        # Format code with Prettier

# Application-specific
npm run dev:front     # Start frontend only
npm run dev:api       # Start API only
npm run dev:mobile    # Start mobile app

# Infrastructure
npm run deploy:staging  # Deploy to staging
npm run deploy:prod    # Deploy to production
npm run infra:diff     # Show infrastructure changes
```

### Database Management

```bash
# API database operations
cd apps/api
npm run migration:generate -- --name CreateUsersTable
npm run migration:run
npm run migration:revert
npm run seed:run
```

### Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Load testing
npm run test:load
```

## 📱 WhatsApp Integration

OnTrack includes a comprehensive WhatsApp bot for quick financial operations:

### Bot Commands
- `/balance` - Current balance and financial summary
- `/add 25.50 coffee` - Quick expense entry
- `/expenses` - Recent expenses for current month
- `/categories` - Available expense categories
- `/budget` - Budget status and alerts
- `/summary` - Monthly financial breakdown
- `/pending` - Pending payments and overdue items
- `/help` - Available commands

### Setup WhatsApp Integration
1. Get WhatsApp Business API credentials
2. Configure webhook URL in environment variables
3. Deploy notification service Lambda
4. Set up SNS/SQS for message processing

## 🏗️ Infrastructure

### AWS Services Used
- **ECS Fargate** - Main API container hosting
- **Lambda** - Microservices and background jobs
- **RDS PostgreSQL** - Transactional data
- **DocumentDB** - Analytics and caching
- **ElastiCache Redis** - Session and data caching
- **API Gateway** - API routing and rate limiting
- **SNS/SQS** - Event-driven messaging
- **S3** - File storage and static assets
- **CloudWatch** - Monitoring and logging

### Deployment

```bash
# Deploy infrastructure
cd infrastructure/aws-cdk
npm run deploy

# Deploy applications
npm run deploy:staging  # Staging environment
npm run deploy:prod     # Production environment
```

## 📊 Key Features Deep Dive

### Financial Management
- **Smart Categorization**: Automatic expense categorization with ML
- **Recurring Transactions**: Support for recurring income and expenses
- **Multi-Currency**: Real-time BRL/USD conversion
- **Payment Tracking**: Status management (pending, paid, overdue)

### Analytics & Insights
- **Real-time Calculations**: Live balance and category breakdowns
- **Trend Analysis**: Monthly/yearly financial trends
- **Budget Monitoring**: Threshold alerts and overspending warnings
- **Custom Reports**: Exportable PDF/Excel financial reports

### Automation
- **Event-Driven Architecture**: Automatic processing of financial events
- **Smart Notifications**: Context-aware budget and payment alerts
- **Background Processing**: Async analytics and report generation
- **Integration Ready**: API-first design for third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure all CI checks pass

## 📝 Documentation

- [API Documentation](./docs/API.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [WhatsApp Integration](./docs/WHATSAPP_INTEGRATION.md)
- [Database Schema](./docs/DATABASE.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🔐 Security

- JWT-based stateless authentication
- Password hashing with bcrypt
- Rate limiting and request validation
- SQL injection protection with TypeORM
- CORS configuration
- Environment variable protection

## 📈 Performance

- Redis caching for frequently accessed data
- Database query optimization with indexes
- CDN for static assets
- Serverless auto-scaling
- Connection pooling
- Lazy loading and code splitting

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check if PostgreSQL is running
docker-compose ps
# Restart database container
docker-compose restart postgres
```

**Port Conflicts**
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**AWS LocalStack Issues**
```bash
# Reset LocalStack data
docker-compose down -v
docker-compose up -d localstack
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sahdoio** - [GitHub](https://github.com/sahdoio)

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- AWS for robust cloud infrastructure
- WhatsApp Business API for messaging integration
- Open source community for inspiration and tools

---

<div align="center">

**[🌟 Star this repo](https://github.com/sahdoio/ontrack)** • **[🐛 Report Bug](https://github.com/sahdoio/ontrack/issues)** • **[💡 Request Feature](https://github.com/sahdoio/ontrack/issues)**

Made with ❤️ for better financial management

</div>
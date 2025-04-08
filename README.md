# Measurelinx

AI-powered SAAS platform for process measurement, analytics, and instrumentation projects.

## Overview

Measurelinx is a comprehensive platform that assists process engineers and technicians with:

- Complex process calculations
- Process documentation generation
- Bill of materials preparation
- Instrumentation project planning
- Process measurement and analytics

The platform features an AI-powered chat interface that provides intelligent assistance for all aspects of process engineering projects.

## Key Features

- **AI Chat Assistant**: Intelligent process engineering assistant powered by advanced RAG (Retrieval Augmented Generation)
- **Process Calculations**: Complex thermodynamic and process calculations
- **Documentation**: Automated generation of process documentation
- **BOM Generation**: Intelligent bill of materials preparation
- **Project Management**: Tools for managing instrumentation projects
- **Analytics Dashboard**: Real-time process analytics and visualization

## Environment Modes

The application can run in three distinct environments, each connecting to a separate database:

### Development Mode

- **Database:** `measurelinxdev`
- **Command:** `npm run start-dev`
- **Purpose:** For local development with hot reloading

### Test Mode

- **Database:** `measurelinxtest`
- **Command:** `npm run start-test`
- **Purpose:** For testing features with a separate test database

### Production Mode

- **Database:** `measurelinxprod`
- **Command:** `npm run start-prod`
- **Purpose:** For production deployment

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure your database connections and API keys

## Running the Application

To start the application in different modes, use the following commands:

```bash
# Development mode
npm run start-dev

# Test mode
npm run start-test

# Production mode
npm run start-prod
```

## Running Tests

To run tests, use:

```bash
# Run all tests
npm test

# Run utility tests
cd server && npm run test:utils

# Run GraphQL tests
cd server && npm run test:graphql

# Run model tests
cd server && npm run test:models

# Run integration tests for routes
cd server && npm run test:routes
```

## Docker Support

The application can be built and run using Docker:

```bash
# Development
docker-compose up measurelinx-dev

# Testing
docker-compose up measurelinx-test

# Production
docker-compose up measurelinx-prod
```

## CI/CD Pipeline

This project includes GitHub Actions workflows for:

- Running tests on pull requests
- Building and pushing Docker images on merge to main/develop
- Deploying to production on merge to main

See `.github/workflows/ci.yml` for details.

## Documentation

- [Environment Setup](ENVIRONMENT_SETUP.md)
- [Testing Guide](TESTING.md)

## License

MIT License - see LICENSE file for details

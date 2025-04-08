# Environment Setup Guide

This guide explains how to set up and work with the different environments in the Papiloom application.

## Environment Overview

Papiloom supports three environments, each with its own database:

| Environment | Database       | Purpose                                              |
| ----------- | -------------- | ---------------------------------------------------- |
| Development | `papiloomdev`  | Local development with hot reloading                 |
| Test        | `papiloomtest` | Testing with isolated data                           |
| Production  | `papiloomprod` | Production deployment with performance optimizations |

## Configuration Files

Each environment uses its own configuration file:

- Development: `server/.env`
- Test: `server/.env.test`
- Production: `server/.env.production`

## Running Different Environments

You can run the application in different environments using these commands:

```bash
# Development mode
npm run start-dev

# Test mode
npm run start-test

# Production mode
npm run start-prod
```

## Environment-Specific Scripts

The project includes several environment-specific scripts:

### Development Scripts

- `npm run dev`: Start server in development mode
- `npm run db:create-appenv`: Create application environment data in development

### Test Scripts

- `npm run test-server`: Start server in test mode
- `npm run db:test-init`: Initialize test database with required data
- `npm run test`: Run all tests
- `npm run test:graphql`: Run GraphQL tests
- `npm run test:utils`: Run utility tests
- `npm run test:models`: Run model tests
- `npm run test:routes`: Run integration tests for routes

### Production Scripts

- `npm run prod`: Start server in production mode

## Database Connection

The application automatically connects to the appropriate database based on:

1. The `MONGO_DATABASE` environment variable if provided
2. The `NODE_ENV` environment variable otherwise

This is configured in both `server.js` and `db.js` for consistent behavior across the application.

## Creating a New Environment

To create a new environment:

1. Create a new `.env.[environment]` file in the server directory
2. Define all necessary environment variables, especially `MONGO_DATABASE`
3. Update `package.json` with appropriate scripts

## Testing Considerations

When running tests, the application:

- Uses the `papiloomtest` database by default
- Connects to the database only if necessary (skips for unit tests)
- Cleans up test data between test runs

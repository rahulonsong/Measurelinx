# Papiloom Testing Guide

This document outlines the testing strategy and procedures for the Papiloom application.

## Testing Environments

### 1. Development

- Database: `papiloomdev`
- Environment file: `.env`
- Run with: `npm run dev` or `docker-compose up papiloom-dev`

### 2. Testing

- Database: `papiloomtest`
- Environment file: `.env.test`
- Run with: `npm run test` or `docker-compose up papiloom-test`

### 3. Production

- Database: `papiloomprod`
- Environment file: `.env.production`
- Run with: `npm run prod` or `docker-compose up papiloom-prod`

## Test Types

### Unit Tests

Unit tests focus on testing individual components in isolation:

- **Models**: Test data validation, schema functionality, and methods
- **Utilities**: Test helper functions and utility modules
- **Middleware**: Test authentication, error handling, and other middleware functions

### Integration Tests

Integration tests verify that different parts of the application work together correctly:

- **API Routes**: Test endpoints for proper request handling and responses
- **Database Operations**: Test complex database interactions across multiple models
- **Authentication Flows**: Test complete authentication processes

### End-to-End Tests

End-to-end tests simulate real user scenarios:

- **User Flows**: Test common user journeys (registration, login, checkout, etc.)
- **UI Interaction**: Test user interface functionality
- **System Integration**: Test integration with external services (payment, email, etc.)

## Running Tests

### Running All Tests

```bash
npm test
```

### Running Specific Test Groups

```bash
# Run only unit tests
npm test -- --testPathPattern=unit

# Run only integration tests
npm test -- --testPathPattern=integration

# Run tests for a specific feature
npm test -- --testPathPattern=auth
```

### Test Coverage

Generate test coverage reports:

```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage` directory.

## Test Database Setup

The test environment uses a separate database (`papiloomtest`) to prevent interference with development or production data.

For local testing, you can also use the in-memory MongoDB server by setting `USE_IN_MEMORY_DB=true` in your `.env.test` file.

## Mocking External Services

When testing components that interact with external services (like payment gateways, email services, etc.), we use mocks to simulate their behavior.

Mock configurations can be found in the `tests/mocks` directory.

## Continuous Integration

Tests are automatically run on each pull request and push to the main branch using GitHub Actions.

The CI workflow is defined in `.github/workflows/ci.yml`.

## Best Practices

1. **Isolate Tests**: Each test should be independent and not rely on the state from previous tests.
2. **Clean Up**: Use `beforeEach` and `afterEach` hooks to set up and clean up test data.
3. **Meaningful Assertions**: Make assertions that verify the actual functionality, not just that code runs.
4. **Test Edge Cases**: Include tests for error conditions and edge cases.
5. **Keep Tests Fast**: Tests should execute quickly to maintain a smooth development workflow.

## Writing New Tests

When adding new features, follow this process:

1. Write unit tests for new models, utilities, and middleware
2. Write integration tests for new API routes
3. Update or add end-to-end tests for new user flows
4. Ensure all tests pass before submitting a pull request

## Test Directory Structure

```
server/
└── tests/
    ├── setup.js                  # Test setup and configuration
    ├── helpers/                  # Test helper functions
    ├── unit/                     # Unit tests
    │   ├── models/               # Model tests
    │   ├── controllers/          # Controller tests
    │   └── utils/                # Utility function tests
    ├── integration/              # Integration tests
    │   └── routes/               # API route tests
    └── mocks/                    # Mock implementations
```

## Debugging Tests

For debugging tests, you can use:

```bash
# Run tests in watch mode
npm run test:watch

# Run with debugging output
DEBUG=papiloom:* npm test
```

## Troubleshooting

If you encounter issues with tests:

1. Check that your MongoDB connection is working
2. Verify that environment variables are properly set
3. Ensure that server dependencies are installed
4. Try running with `--runInBand` flag for sequential test execution

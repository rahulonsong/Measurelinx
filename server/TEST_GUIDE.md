# Papiloom Testing Guide

This guide explains how to use the test database and run automated tests for the Papiloom application.

## Setup and Configuration

The test environment has been configured with:

- A dedicated test database: `papiloomtest`
- Environment configuration: `server/.env.test`
- Test utilities and helpers
- Sample tests for models and routes

## Step 1: Run the Test Database Setup

If you haven't already set up the test database:

```bash
cd server
npm run db:init-all
```

This will:

1. Copy helper collections from development to test database
2. Create the AppEnv entry in the test database
3. Verify the test database is properly initialized

## Step 2: Running Automated Tests

To run all tests:

```bash
cd server
npm test
```

### Running Specific Test Groups

You can run tests for specific components using these commands:

```bash
# GraphQL resolver tests
npm run test:graphql

# Utility function tests
npm run test:utils

# Model tests
npm run test:models

# Route integration tests
npm run test:routes
```

To run tests in watch mode (automatically re-runs when files change):

```bash
npm run test:watch
```

To generate test coverage reports:

```bash
npm run test:coverage
```

## Step 3: Running the Test Server

To start the server using the test database:

```bash
# Make sure port 4001 is free
npm run test-server
# Or manually specify the port:
NODE_ENV=test PORT=4001 npx nodemon server.js
```

The test server will run on port 4001 by default.

## Step 4: Write Your Own Tests

### Unit Tests

Create unit tests for your models and utilities in:

- `server/tests/unit/models/`
- `server/tests/unit/utils/`

Example: A basic model test

```javascript
const mongoose = require("mongoose");
const MyModel = require("../../../models/myModel");

describe("MyModel Tests", () => {
  beforeEach(async () => {
    // Setup before each test
  });

  afterEach(async () => {
    // Cleanup after each test
    await mongoose.model("MyModel").deleteMany({});
  });

  test("should create a valid record", async () => {
    // Your test code here
  });
});
```

### GraphQL Resolver Tests

Create tests for GraphQL resolvers in:

- `server/tests/unit/graphql/`

Example: A basic resolver test

```javascript
const { yourResolver } = require("../../../graphql/resolvers/yourResolver");

// Mock dependencies
jest.mock("../../../models/yourModel", () => ({
  YourModel: {
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

describe("Your Resolver Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return data for a query", async () => {
    // Setup mocks
    const { YourModel } = require("../../../models/yourModel");
    YourModel.find.mockResolvedValue([{ _id: "123", name: "Test" }]);

    // Execute resolver
    const result = await yourResolver.Query.yourQueryName(null, {}, {}, null);

    // Assertions
    expect(result).toBeDefined();
    expect(YourModel.find).toHaveBeenCalled();
  });
});
```

### Integration Tests

Create integration tests for your routes in:

- `server/tests/integration/routes/`

Example: A basic route test

```javascript
const request = require("supertest");
const express = require("express");
const myRoutes = require("../../../routes/myRoute");

describe("My Route Tests", () => {
  let app;

  beforeAll(() => {
    // Setup once before all tests
    app = express();
    app.use(express.json());
    app.use("/", myRoutes);
  });

  test("GET /endpoint should return data", async () => {
    const response = await request(app).get("/endpoint");
    expect(response.status).toBe(200);
  });
});
```

## Step 5: Handling Failures

If tests fail, check:

1. The test database is properly initialized
2. Your model schemas match what the tests expect
3. Environment variables are set correctly
4. Test expectations match actual behavior

## Best Practices for Testing

1. **Mock External Dependencies**: Always mock database calls, external APIs, and other services
2. **Test Edge Cases**: Include tests for error conditions and edge cases
3. **Keep Tests Independent**: Each test should be able to run independently of others
4. **Use Descriptive Names**: Test names should clearly describe what's being tested
5. **Follow AAA Pattern**: Arrange (setup), Act (execute), Assert (verify)

## GraphQL Testing Tips

When testing GraphQL resolvers:

1. **Separate Query and Mutation Tests**: Keep tests organized by resolver type
2. **Test Authentication Logic**: Verify that protected resolvers check for authentication
3. **Test Both Success and Error Cases**: Ensure resolvers handle both valid and invalid inputs
4. **Mock Context Objects**: Create mock context objects that simulate the GraphQL execution context
5. **Test Field Resolvers**: Don't forget to test individual field resolvers when needed

## Useful Commands Quick Reference

```bash
# Initialize test environment
npm run db:init-all

# Run all tests
npm test

# Run specific test groups
npm run test:graphql
npm run test:utils
npm run test:models
npm run test:routes

# Run a specific test file
npm test -- tests/unit/graphql/user.resolver.test.js

# Run tests with a specific pattern
npm test -- --testPathPattern=cart

# Check test database initialization
npm run db:test-init

# Start test server
npm run test-server
```

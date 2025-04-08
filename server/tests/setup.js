const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
// Set strictQuery to false to address deprecation warning
mongoose.set("strictQuery", false);
const dotenv = require("dotenv");
const path = require("path");

// Load .env.test file
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

let mongoServer;

// Check if the current test is a unit test that doesn't need database connection
const isUnitTest =
  process.env.JEST_WORKER_ID &&
  (process.argv.some((arg) => arg.includes("unit/utils")) ||
    process.argv.some((arg) => arg.includes("unit/graphql")));

// Setup before all tests
beforeAll(async () => {
  if (isUnitTest) {
    // For unit tests, we don't need to connect to MongoDB
    console.log("Running unit tests, skipping MongoDB connection");
    return;
  }

  try {
    // Create in-memory MongoDB for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Override MongoDB connection if using in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
});

// Clean up after each test
afterEach(async () => {
  // Clear all collections after each test
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Clean up after all tests
afterAll(async () => {
  if (!isUnitTest) {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  }
});

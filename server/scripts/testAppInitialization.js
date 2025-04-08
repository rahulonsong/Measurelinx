/**
 * Test App Initialization Script
 *
 * This script connects to the test database and verifies all collections
 * required for app initialization exist and contain data.
 *
 * Usage:
 *   NODE_ENV=test node scripts/testAppInitialization.js
 */

const mongoose = require("mongoose");
// Set strictQuery to false to address deprecation warning
mongoose.set("strictQuery", false);
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

// Helper collection names identified from initializeApp.js
const HELPER_COLLECTIONS = [
  "alpharesources",
  "appenvs",
  "categories",
  "categorylists",
  "itemmodels",
  "menus",
  "pairedstringlists",
  "pagecreators",
  "taglists",
  "unitmatrices",
];

// Get MongoDB connection string for the test database
const getConnectionString = () => {
  return `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_URL}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
};

/**
 * Test app initialization by checking helper collections
 */
async function testAppInitialization() {
  const dbName = process.env.MONGO_DATABASE;
  console.log(`Testing app initialization with database: ${dbName}`);
  console.log("-----------------------------------");

  let client;
  try {
    // Connect to database
    client = new MongoClient(getConnectionString());
    await client.connect();
    console.log(`Connected to database: ${dbName}`);

    const db = client.db();
    let allCollectionsExist = true;
    let collectionsCount = {};

    // Check each collection
    for (const collectionName of HELPER_COLLECTIONS) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();

        collectionsCount[collectionName] = count;

        if (count === 0) {
          console.log(
            `⚠️ Warning: Collection '${collectionName}' exists but is empty`
          );
          allCollectionsExist = false;
        } else {
          console.log(
            `✅ Collection '${collectionName}' exists with ${count} documents`
          );
        }
      } catch (error) {
        console.error(
          `❌ Error accessing collection '${collectionName}':`,
          error.message
        );
        allCollectionsExist = false;
      }
    }

    // Print summary
    console.log("\n===== Test Summary =====");
    if (allCollectionsExist) {
      console.log("✅ All required collections exist with data");
      console.log("\nCollection Counts:");
      for (const [collection, count] of Object.entries(collectionsCount)) {
        console.log(`- ${collection}: ${count} documents`);
      }
      console.log("\nThe app should initialize successfully! 🎉");
    } else {
      console.log("❌ Some required collections are missing or empty");
      console.log("The app may not initialize properly.");
    }
  } catch (error) {
    console.error(`Failed to connect to database ${dbName}:`, error);
  } finally {
    if (client) {
      await client.close();
      console.log(`\nClosed connection to ${dbName}`);
    }
  }
}

// Execute the script
testAppInitialization()
  .then(() => {
    console.log("Test script completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error running test script:", err);
    process.exit(1);
  });

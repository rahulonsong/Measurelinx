/**
 * Database Collection Migration Script
 *
 * This script copies essential collections from the development database (papiloomdev)
 * to the test (papiloomtest) and production (papiloomprod) databases.
 *
 * Usage:
 *   NODE_ENV=development node scripts/copyCollections.js
 */

const mongoose = require("mongoose");
// Set strictQuery to false to address deprecation warning
mongoose.set("strictQuery", false);
const { ObjectId } = require("mongodb");
require("dotenv").config();

// Collection names to copy based on app initialization requirements
const COLLECTIONS_TO_COPY = [
  "alpharesources",
  "appenvs",
  "categories",
  "categorylists",
  "itemmodels",
  "items",
  "menus",
  "pairedstringlists",
  "pagecreators",
  "taglists",
  "unitmatrices",
];

// Database connection URIs
const getConnectionString = (dbName) => {
  return `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_URL}/${dbName}?retryWrites=true&w=majority`;
};

// Source and target database names
const SOURCE_DB = "papiloomdev";
const TARGET_DBS = ["papiloomtest", "papiloomprod"];

/**
 * Copy a single collection from source to target
 */
async function copyCollection(sourceDb, targetDb, collectionName) {
  console.log(`Copying collection: ${collectionName}`);

  // Get documents from source collection
  const sourceCollection = sourceDb.collection(collectionName);
  const documents = await sourceCollection.find({}).toArray();

  if (documents.length === 0) {
    console.log(`  Collection ${collectionName} is empty - skipping`);
    return;
  }

  // Drop target collection if it exists
  try {
    await targetDb.collection(collectionName).drop();
    console.log(`  Dropped existing collection in target database`);
  } catch (err) {
    // Collection might not exist, which is fine
  }

  // Insert documents into target collection
  const result = await targetDb
    .collection(collectionName)
    .insertMany(documents);
  console.log(`  Copied ${result.insertedCount} documents`);
}

/**
 * Main function to copy all collections
 */
async function copyCollections() {
  // Connect to source database
  const sourceConnection = await mongoose.createConnection(
    getConnectionString(SOURCE_DB)
  );
  console.log(`Connected to source database: ${SOURCE_DB}`);

  // Process each target database
  for (const targetDbName of TARGET_DBS) {
    try {
      // Connect to target database
      const targetConnection = await mongoose.createConnection(
        getConnectionString(targetDbName)
      );
      console.log(`\nConnected to target database: ${targetDbName}`);

      // Copy each collection
      for (const collection of COLLECTIONS_TO_COPY) {
        await copyCollection(
          sourceConnection.db,
          targetConnection.db,
          collection
        );
      }

      // Close target connection
      await targetConnection.close();
      console.log(`Closed connection to ${targetDbName}`);
    } catch (error) {
      console.error(`Error processing ${targetDbName}:`, error);
    }
  }

  // Close source connection
  await sourceConnection.close();
  console.log(`\nClosed connection to ${SOURCE_DB}`);
  console.log("Migration completed!");
}

// Run the migration
copyCollections()
  .then(() => {
    console.log("Database migration script completed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error running migration script:", err);
    process.exit(1);
  });

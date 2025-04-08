/**
 * Helper Collections Migration Script
 *
 * This script copies only the essential helper collections from the development database
 * to the test and production databases, based on what's needed for app initialization.
 *
 * Usage:
 *   NODE_ENV=development node scripts/copyHelperCollections.js
 */

const mongoose = require("mongoose");
// Set strictQuery to false to address deprecation warning
mongoose.set("strictQuery", false);
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

// Helper collection names identified from initializeApp.js
const HELPER_COLLECTIONS = [
  "alpharesources", // For page resources and constructors
  "appenvs", // App environment settings
  "categories", // Item categories
  "categorylists", // Category lists for states/provinces
  "itemmodels", // Item models
  "menus", // App menus
  "pairedstringlists", // For country phone codes, order status codes, etc.
  "pagecreators", // Page layouts
  "taglists", // Tags
  "unitmatrices", // Unit matrices
];

// Get MongoDB connection string for a specific database
const getConnectionString = (dbName) => {
  return `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_URL}/${dbName}?retryWrites=true&w=majority`;
};

// Source and target database names
const SOURCE_DB = "papiloomdev";
const TARGET_DBS = ["papiloomtest", "papiloomprod"];

/**
 * Copy a single collection from source to target
 */
async function copyCollection(sourceClient, targetClient, collectionName) {
  console.log(`Copying helper collection: ${collectionName}`);

  try {
    // Get documents from source collection
    const sourceDb = sourceClient.db();
    const sourceCollection = sourceDb.collection(collectionName);
    const documents = await sourceCollection.find({}).toArray();

    if (documents.length === 0) {
      console.log(`  Collection ${collectionName} is empty - skipping`);
      return 0;
    }

    // Drop target collection if it exists
    const targetDb = targetClient.db();
    try {
      await targetDb.collection(collectionName).drop();
      console.log(`  Dropped existing collection in target database`);
    } catch (err) {
      // Collection might not exist, which is fine
      console.log(`  Creating new collection in target database`);
    }

    // Insert documents into target collection
    const result = await targetDb
      .collection(collectionName)
      .insertMany(documents);
    console.log(`  Copied ${result.insertedCount} documents`);
    return result.insertedCount;
  } catch (error) {
    console.error(`  Error copying collection ${collectionName}:`, error);
    return 0;
  }
}

/**
 * Main function to copy all helper collections
 */
async function copyHelperCollections() {
  console.log("Starting helper collections migration...");
  console.log(`Source: ${SOURCE_DB}`);
  console.log(`Targets: ${TARGET_DBS.join(", ")}`);
  console.log("-----------------------------------");

  // Connect to source database using MongoClient
  let sourceClient;
  try {
    sourceClient = new MongoClient(getConnectionString(SOURCE_DB));
    await sourceClient.connect();
    console.log(`Connected to source database: ${SOURCE_DB}`);
  } catch (error) {
    console.error(`Failed to connect to source database ${SOURCE_DB}:`, error);
    return;
  }

  // Process each target database
  for (const targetDbName of TARGET_DBS) {
    console.log(`\n=== Processing ${targetDbName} ===`);
    let targetClient;
    let totalDocumentsCopied = 0;

    try {
      // Connect to target database using MongoClient
      targetClient = new MongoClient(getConnectionString(targetDbName));
      await targetClient.connect();
      console.log(`Connected to target database: ${targetDbName}`);

      // Copy each helper collection
      for (const collection of HELPER_COLLECTIONS) {
        const count = await copyCollection(
          sourceClient,
          targetClient,
          collection
        );
        totalDocumentsCopied += count;
      }

      console.log(
        `\nMigration to ${targetDbName} completed - ${totalDocumentsCopied} total documents copied`
      );
    } catch (error) {
      console.error(`Error processing ${targetDbName}:`, error);
    } finally {
      // Close target connection
      if (targetClient) {
        await targetClient.close();
        console.log(`Closed connection to ${targetDbName}`);
      }
    }
  }

  // Close source connection
  if (sourceClient) {
    await sourceClient.close();
    console.log(`\nClosed connection to ${SOURCE_DB}`);
  }

  console.log("\nHelper collections migration completed!");
}

// Execute the script
copyHelperCollections()
  .then(() => {
    console.log("Migration script finished successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error running migration script:", err);
    process.exit(1);
  });

/**
 * Create AppEnv Entry Script
 *
 * This script creates the basic AppEnv entry in test and production databases
 * that is required for app initialization.
 *
 * Usage:
 *   NODE_ENV=development node scripts/createAppEnv.js
 */

const mongoose = require("mongoose");
// Set strictQuery to false to address deprecation warning
mongoose.set("strictQuery", false);
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

// Target databases to update
const TARGET_DBS = ["papiloomtest", "papiloomprod"];

// MongoDB connection string
const getConnectionString = (dbName) => {
  return `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_URL}/${dbName}?retryWrites=true&w=majority`;
};

// Basic AppEnv document template based on environment variables
const getAppEnvTemplate = () => {
  return {
    version: "1.0.0",
    isDark: false,
    fontColor: "#333333",
    appLogo: process.env.BRAND_LOGO_IMAGE_URL,
    appName: process.env.BRAND_NAME,
    mainColor: "#3399cc",
    subColor: "#ff9900",
    defaultDisplayCurrency: process.env.ACTIVECURRENCY || "CAD",
    defaultDisplayLanguage: "en",
    contactEmail: process.env.EMAIL || "info@papiloom.com",
    supportEmail: process.env.SUPPORT_EMAIL || "info@papiloom.com",
    adminPhone: process.env.PHONE || "+1(647)388-3647",
    theme: {
      primaryColor: "#3399cc",
      secondaryColor: "#ff9900",
      accentColor: "#f6f6f6",
      textColor: "#333333",
      backgroundColor: "#ffffff",
    },
    address: {
      line1: process.env.ADDRESS_LINE1 || "22 Battalion Rd",
      line2: process.env.ADDRESS_LINE2 || null,
      city: process.env.ADDRESS_LINE3
        ? process.env.ADDRESS_LINE3.split(" ")[0]
        : "Brampton",
      province: process.env.ADDRESS_LINE3
        ? process.env.ADDRESS_LINE3.split(" ")[1]
        : "Ontario",
      postalCode: process.env.ADDRESS_LINE3
        ? process.env.ADDRESS_LINE3.split(" ")[2]
        : "L7A 4B5",
      country: process.env.ADDRESS_LINE4 || "Canada",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Create or update AppEnv in the specified database
 */
async function createAppEnv(dbName) {
  console.log(`Creating AppEnv in database: ${dbName}`);

  let client;
  try {
    // Connect to database
    client = new MongoClient(getConnectionString(dbName));
    await client.connect();
    console.log(`Connected to database: ${dbName}`);

    const db = client.db();
    const appEnvCollection = db.collection("appenvs");

    // Check if AppEnv exists
    const existingAppEnv = await appEnvCollection.findOne({});

    if (existingAppEnv) {
      console.log("AppEnv already exists, updating...");
      const result = await appEnvCollection.updateOne(
        { _id: existingAppEnv._id },
        { $set: { ...getAppEnvTemplate(), updatedAt: new Date() } }
      );
      console.log(`AppEnv updated: ${result.modifiedCount} document modified`);
    } else {
      console.log("AppEnv does not exist, creating...");
      const result = await appEnvCollection.insertOne(getAppEnvTemplate());
      console.log(`AppEnv created with ID: ${result.insertedId}`);
    }

    return true;
  } catch (error) {
    console.error(`Error creating AppEnv in ${dbName}:`, error);
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log(`Closed connection to ${dbName}`);
    }
  }
}

/**
 * Main function to create AppEnv in all target databases
 */
async function createAppEnvInTargetDatabases() {
  console.log("Starting AppEnv creation in target databases...");

  let results = [];
  for (const dbName of TARGET_DBS) {
    console.log(`\n=== Processing ${dbName} ===`);
    const success = await createAppEnv(dbName);
    results.push({ database: dbName, success });
  }

  console.log("\n===== Summary =====");
  for (const result of results) {
    console.log(
      `${result.database}: ${result.success ? "✅ Success" : "❌ Failed"}`
    );
  }

  console.log("\nAppEnv creation completed!");
}

// Execute the script
createAppEnvInTargetDatabases()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error running script:", err);
    process.exit(1);
  });

const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);
require("dotenv").config();

// Load appropriate .env file based on NODE_ENV
const path = require("path");
if (process.env.NODE_ENV === "production") {
  require("dotenv").config({
    path: path.resolve(__dirname, ".env.production"),
  });
} else if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: path.resolve(__dirname, ".env.test") });
} else {
  // Default to development
  require("dotenv").config({ path: path.resolve(__dirname, ".env") });
}

let MONGO_CONNECTION;
const env = process.env.NODE_ENV || "development";

// In test mode with memory server, this will be set by the test setup
if (process.env.MONGO_CONNECTION) {
  MONGO_CONNECTION = process.env.MONGO_CONNECTION;
} else {
  // Get database name from environment variables or use defaults based on environment
  const database =
    process.env.MONGO_DATABASE ||
    (env === "test"
      ? "papiloomtest"
      : env === "production"
      ? "papiloomprod"
      : "papiloomdev");

  // Construct connection string with the appropriate database
  MONGO_CONNECTION = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_URL}/${database}?retryWrites=true&w=majority`;

  console.log(`Using MongoDB database: ${database} in ${env} environment`);
}

let connectMongo = {
  connect: async () => {
    try {
      mongoose.connect(MONGO_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`Mongoose connection successful [${env} environment]`);
    } catch (err) {
      console.error("Mongoose connection error:", err);
    }
  },
};

// Only connect automatically if not in test environment
// In tests, the connection is managed by the test setup
if (env !== "test" || process.env.CONNECT_DB_IN_TESTS === "true") {
  connectMongo.connect();
}

module.exports = connectMongo;

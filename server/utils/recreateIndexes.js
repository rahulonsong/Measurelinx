const mongoose = require("mongoose");
// Set strictQuery to false to address deprecation warning
mongoose.set("strictQuery", false);
const { User } = require("../models/user");
require("dotenv").config();

async function recreateIndexes() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("🗑️  Dropping old indexes...");
    await User.collection.dropIndexes();
    console.log("✅ Old indexes dropped successfully");

    console.log("🔨 Creating new indexes...");
    await User.syncIndexes();
    console.log("✅ New indexes created successfully");
  } catch (error) {
    console.error("❌ Error:", error);
    console.error(error.stack);
  } finally {
    console.log("👋 Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
}

// Export the function to be used elsewhere if needed
module.exports = { recreateIndexes };

// If running directly (not imported as a module)
if (require.main === module) {
  recreateIndexes().catch(console.error);
}

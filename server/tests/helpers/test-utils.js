const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

/**
 * Create a test user in the database
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user
 */
const createTestUser = async (userData = {}) => {
  const UserModel = mongoose.model("User");

  const defaultUser = {
    firstName: "Test",
    lastName: "User",
    email: `test${Date.now()}@example.com`,
    password: "Password123!",
    phone: "+11234567890",
    isVerified: true,
    role: "user",
    ...userData,
  };

  return await UserModel.create(defaultUser);
};

/**
 * Generate a JWT token for test authentication
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateAuthToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

/**
 * Clear database collections (useful between tests)
 * @param {Array<string>} collections - Collection names to clear
 */
const clearCollections = async (collections = []) => {
  if (collections.length === 0) {
    // Clear all collections if none specified
    const allCollections = mongoose.connection.collections;
    for (const key in allCollections) {
      await allCollections[key].deleteMany({});
    }
  } else {
    // Clear only specified collections
    for (const collectionName of collections) {
      if (mongoose.connection.collections[collectionName]) {
        await mongoose.connection.collections[collectionName].deleteMany({});
      }
    }
  }
};

module.exports = {
  createTestUser,
  generateAuthToken,
  clearCollections,
};

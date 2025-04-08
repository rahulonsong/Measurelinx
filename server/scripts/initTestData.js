/**
 * Test Data Initialization Script
 *
 * This script initializes essential data in the test database to support testing the application.
 * It creates required data structures that the application depends on, like home page data.
 */

const mongoose = require("mongoose");
// Set strictQuery to false to address deprecation warning
mongoose.set("strictQuery", false);
require("dotenv").config();
const path = require("path");

// Load test environment variables
if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env.test") });
}

// Ensure we're connecting to the test database
const database = process.env.MONGO_DATABASE || "papiloomtest";
const MONGO_CONNECTION = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_URL}/${database}?retryWrites=true&w=majority`;

// Import the actual models
const { PageCreator } = require("../models/pageCreator");
const { AlphaResource } = require("../models/alphaResource");

/**
 * Initialize essential test data
 */
async function initializeTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB test database: ${database}`);

    // Check if home page data already exists
    const homePageParam = process.env.HOME_PAGE_PARAM;
    const existingHomePage = await PageCreator.findOne({ name: homePageParam });

    if (!existingHomePage) {
      console.log("Creating home page test data...");

      // Create a simple resource for the page
      const resource = new AlphaResource({
        title: "Test Resource",
        description: "A test resource for the home page",
        imageUrl: "/uploads/test-image.jpg",
        resourceType: "image",
      });

      await resource.save();

      // Create the home page with required fields
      const homePage = new PageCreator({
        name: homePageParam,
        disabled: false,
        routeParam: homePageParam,
        pageRows: [
          {
            numberOfCols: "single",
            rowType: "equal",
            col1: {
              title: "Welcome to Papiloom Test",
              exists: true,
              resource: resource._id,
            },
            col2: {
              exists: false,
            },
            col3: {
              exists: false,
            },
          },
        ],
      });

      await homePage.save();
      console.log("Home page test data created successfully");
    } else {
      console.log("Home page test data already exists");
    }

    // Check if carousel data exists
    const carouselParam = process.env.HOME_PAGE_CAROUSEL_PARAM;
    const existingCarousel = await PageCreator.findOne({ name: carouselParam });

    if (!existingCarousel) {
      console.log("Creating carousel test data...");

      // Create a resource for the carousel
      const carouselResource = new AlphaResource({
        title: "Carousel Resource",
        description: "A test resource for the carousel",
        imageUrl: "/uploads/carousel-image.jpg",
        resourceType: "image",
      });

      await carouselResource.save();

      // Create the carousel page
      const carousel = new PageCreator({
        name: carouselParam,
        disabled: false,
        routeParam: carouselParam,
        pageRows: [
          {
            numberOfCols: "single",
            rowType: "equal",
            col1: {
              title: "Main Carousel",
              exists: true,
              resource: carouselResource._id,
            },
            col2: {
              exists: false,
            },
            col3: {
              exists: false,
            },
          },
        ],
      });

      await carousel.save();
      console.log("Carousel test data created successfully");
    } else {
      console.log("Carousel test data already exists");
    }

    console.log("Test data initialization completed successfully");
  } catch (error) {
    console.error("Error initializing test data:", error);
    console.error(error.stack);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Execute if run directly
if (require.main === module) {
  initializeTestData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to initialize test data:", err);
      process.exit(1);
    });
}

module.exports = initializeTestData;

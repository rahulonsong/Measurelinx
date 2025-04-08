/**
 * Test script for return label email generation
 * Run this with: node test-return-label.js
 */

require("dotenv").config();
const { sendReturnLabelEmail } = require("../utils/returnLabel");

// Mock data for testing
const mockOrder = {
  _id: "12345",
  orderNumber: "TEST-12345",
  orderCurrency: "CAD",
  shippingAddress: {
    addresseeFirst: "Test",
    addresseeLast: "User",
    line1: "123 Test St",
    line2: "Apt 4",
    cityTown: "Toronto",
    stateProvince: "ON",
    postalCode: "M5V 2N1",
    country: "Canada",
  },
  items: [
    {
      item: {
        _id: "item1",
        name: "Test Product 1",
        sku: "TP1",
        price: 49.99, // Direct price format
        discount: 0,
        tax: 13, // 13% tax
      },
      quantity: 2,
      tax: 13.0,
      discount: 0,
    },
    {
      item: {
        _id: "item2",
        name: "Test Product 2",
        sku: "TP2",
        price: {
          // Object price format
          value: 99.99,
        },
        discount: 10, // 10% discount
        tax: 13, // 13% tax
      },
      quantity: 1,
      tax: 11.7,
      discount: 10.0,
    },
  ],
  user: {
    email: process.env.TEST_EMAIL || "test@example.com",
  },
};

// Mock return items
const mockReturnItems = [
  {
    itemId: "item1",
    quantity: 1,
    reason: "Item no longer required",
    comment: "Testing return process",
  },
];

// Mock return label URL
const mockReturnLabelUrl = "https://example.com/test-return-label.pdf";

// Execute the test
async function runTest() {
  console.log("===============================================");
  console.log("TESTING RETURN LABEL EMAIL GENERATION");
  console.log("===============================================");
  console.log("Order Data:", JSON.stringify(mockOrder, null, 2));
  console.log("Return Items:", JSON.stringify(mockReturnItems, null, 2));

  try {
    console.log("Sending test email...");
    await sendReturnLabelEmail(
      mockOrder.user.email,
      mockReturnLabelUrl,
      mockOrder,
      mockReturnItems
    );
    console.log("✅ Email sent successfully!");
    console.log(`Check ${mockOrder.user.email} for the test email.`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    console.error(error.stack);
  }

  console.log("===============================================");
  console.log("TEST COMPLETED");
  console.log("===============================================");
}

// Run the test
runTest();

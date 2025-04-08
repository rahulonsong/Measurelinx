/**
 * Test script for rendering the returnInitiated.ejs template with test data
 * Run this with: node test-template-render.js
 */

require("dotenv").config();
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

// Mock data - Same as test-return-label.js
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
    email: "test@example.com",
  },
};

// Process order data for template use
function processOrderData(order) {
  // Process order items to properly standardize price structures
  const processedOrderItems = order.items.map((orderItem) => {
    // Make a deep copy of the item to avoid mutation
    const processedItem = { ...orderItem };

    // Handle different price structures (direct price or price.value)
    if (orderItem.item) {
      let itemObj = { ...orderItem.item };

      // Standardize price format
      if (
        itemObj.price &&
        typeof itemObj.price === "object" &&
        itemObj.price.value
      ) {
        // It's in price.value format
        itemObj.price = parseFloat(itemObj.price.value || 0);
        itemObj.originalPriceFormat = "object";
      } else {
        // It's a direct value
        itemObj.price = parseFloat(itemObj.price || 0);
        itemObj.originalPriceFormat = "direct";
      }

      // Ensure discount is a number
      itemObj.discount = parseFloat(
        itemObj.discount >= 0 ? itemObj.discount : 0
      );

      // Ensure tax is a number
      itemObj.tax = parseFloat(itemObj.tax >= 0 ? itemObj.tax : 0);

      processedItem.item = itemObj;
    }

    // Standardize other numeric fields
    processedItem.quantity = parseFloat(orderItem.quantity || 1);
    processedItem.tax = parseFloat(orderItem.tax || 0);
    processedItem.discount = parseFloat(orderItem.discount || 0);

    return processedItem;
  });

  return {
    ...order,
    items: processedOrderItems,
  };
}

// Mock return items
const mockReturnItems = [
  {
    itemId: "item1",
    quantity: 1,
    reason: "Item no longer required",
    comment: "Testing return process",
  },
];

// Process return items
const processedReturnItems = mockReturnItems.map((item) => ({
  ...item,
  quantity: parseFloat(item.quantity || 1),
}));

// Calculate fallback total refund amount
function calculateFallbackRefund(order, returnItems) {
  let fallbackTotalRefund = 0;
  const processedOrder = processOrderData(order);

  returnItems.forEach((returnItem) => {
    const orderItem = processedOrder.items.find(
      (oi) =>
        oi.item && oi.item._id && oi.item._id.toString() === returnItem.itemId
    );

    if (orderItem && orderItem.item) {
      const basePrice = orderItem.item.price;

      // Get discount percentage
      let discountPercent = 0;
      if (orderItem.item.discount >= 0) {
        discountPercent = orderItem.item.discount;
      } else if (orderItem.discount > 0) {
        discountPercent = orderItem.discount / orderItem.quantity;
      }

      // Get tax percentage
      let taxPercent = 0;
      if (orderItem.item.tax >= 0) {
        taxPercent = orderItem.item.tax;
      } else if (orderItem.tax > 0) {
        taxPercent = orderItem.tax / orderItem.quantity;
      }

      // Calculate prices
      const priceAfterDiscount = basePrice * (1 - discountPercent / 100);
      const taxAmount = priceAfterDiscount * (taxPercent / 100);
      const returnQuantity = parseFloat(returnItem.quantity || 1);

      // Calculate total refund
      const itemRefund =
        priceAfterDiscount * returnQuantity + taxAmount * returnQuantity;

      console.log(`Item refund calculation for ${orderItem.item.name}:`, {
        basePrice,
        discountPercent,
        taxPercent,
        priceAfterDiscount,
        taxAmount,
        returnQuantity,
        itemRefund,
      });

      if (!isNaN(itemRefund)) {
        fallbackTotalRefund += itemRefund;
      }
    }
  });

  return fallbackTotalRefund;
}

// Execute the test
async function runTest() {
  console.log("===============================================");
  console.log("TESTING RETURN LABEL TEMPLATE RENDERING");
  console.log("===============================================");

  try {
    // Read the EJS template
    const templatePath = path.join(
      __dirname,
      "templates",
      "returnInitiated.ejs"
    );
    const template = fs.readFileSync(templatePath, "utf8");

    // Format date
    const returnInitiatedDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Mock return label URL
    const returnLabelUrl = "https://example.com/test-return-label.pdf";
    const returnLabelUrls = [returnLabelUrl];

    // Calculate fallback refund
    const fallbackTotalRefund = calculateFallbackRefund(
      mockOrder,
      mockReturnItems
    );
    console.log("Fallback total refund:", fallbackTotalRefund.toFixed(2));

    // Template data
    const templateData = {
      orderNumber: mockOrder.orderNumber,
      returnInitiatedDate,
      returnItems: processedReturnItems,
      returnLabelUrl,
      returnLabelUrls,
      orderCurrency: mockOrder.orderCurrency || "USD",
      order: processOrderData(mockOrder),
      fallbackTotalRefund: fallbackTotalRefund.toFixed(2),
      process: {
        env: {
          BRAND_LOGO_IMAGE_URL: process.env.BRAND_LOGO_IMAGE_URL || "",
          BRAND_NAME: process.env.BRAND_NAME || "Test Company",
          COMPANY_NAME: process.env.COMPANY_NAME || "Test Company",
          BUSINESS_NAME: process.env.BUSINESS_NAME || "Test Company",
        },
      },
    };

    // Render the template
    console.log("Rendering template...");
    const html = ejs.render(template, templateData);

    // Write output to a file
    const outputPath = path.join(__dirname, "test-output.html");
    fs.writeFileSync(outputPath, html);

    console.log(`✅ Template rendered successfully!`);
    console.log(`Output saved to: ${outputPath}`);
  } catch (error) {
    console.error("❌ Error rendering template:", error.message);
    console.error(error.stack);
  }

  console.log("===============================================");
  console.log("TEST COMPLETED");
  console.log("===============================================");
}

// Run the test
runTest();

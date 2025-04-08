const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const axios = require("axios");
const { uploadPDF } = require("./s3Actions");

/**
 * Download image from URL
 */
async function downloadImage(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("Error downloading image:", error.message);
    return null;
  }
}

/**
 * Generate a return shipping label as PDF
 */
async function generateReturnLabel(order, returnItems) {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });
  const chunks = [];

  // Collect PDF chunks
  doc.on("data", (chunk) => chunks.push(chunk));

  try {
    // Add company logo at smaller size (similar to invoice)
    if (process.env.BRAND_LOGO_IMAGE_URL) {
      try {
        // Download the image first
        const imageBuffer = await downloadImage(
          process.env.BRAND_LOGO_IMAGE_URL
        );
        if (imageBuffer) {
          // Use the downloaded image buffer with smaller size (reduced further)
          doc.image(imageBuffer, 50, 50, { width: 70 });
        } else {
          // Fallback to text if image download failed
          doc.fontSize(18).text(process.env.BRAND_NAME || "Papiloom", 50, 50);
        }
      } catch (error) {
        console.warn("Could not load logo:", error.message);
        doc.fontSize(18).text(process.env.BRAND_NAME || "Papiloom", 50, 50);
      }
    } else {
      // Fallback to text if no logo URL is available
      doc.fontSize(18).text(process.env.BRAND_NAME || "Papiloom", 50, 50);
    }

    // Add return label header (reduced font size)
    doc
      .fontSize(20)
      .fillColor("#333333")
      .text("RETURN SHIPPING LABEL", 200, 60, { align: "right" });

    doc
      .fontSize(10)
      .fillColor("#555555")
      .text(`Order #: ${order.orderNumber}`, 200, 85, { align: "right" });

    doc
      .fontSize(9)
      .text(`Generated: ${new Date().toLocaleString()}`, 200, 100, {
        align: "right",
      });

    doc.moveDown(2);

    // Add business information (Return To:) with smaller font
    doc.fontSize(12).fillColor("#000000").text("Return To:", 50, 140);
    doc
      .fontSize(10)
      .fillColor("#333333")
      .text(process.env.BUSINESS_NAME || "Company Name")
      .text(process.env.BUSINESS_ADDRESS || "Business Address")
      .text(
        `${process.env.BUSINESS_CITY || "City"}, ${
          process.env.BUSINESS_STATE || "State"
        } ${process.env.BUSINESS_ZIP || "Zip"}`
      )
      .text(process.env.BUSINESS_COUNTRY || "Country")
      .text(`Phone: ${process.env.BUSINESS_PHONE || "Phone Number"}`);

    doc.moveDown(1);
    doc.rect(50, doc.y, 500, 0.5).fill("#cccccc");
    doc.moveDown(1);

    // Add from address (customer) with smaller font
    doc.fontSize(12).fillColor("#000000").text("From:", 50, doc.y);
    doc
      .fontSize(10)
      .fillColor("#333333")
      .text(
        `${order.shippingAddress.addresseeFirst} ${order.shippingAddress.addresseeLast}`
      )
      .text(order.shippingAddress.line1)
      .text(order.shippingAddress.line2 || "")
      .text(
        `${order.shippingAddress.cityTown}, ${order.shippingAddress.stateProvince} ${order.shippingAddress.postalCode}`
      )
      .text(order.shippingAddress.country);

    doc.moveDown(1);
    doc.rect(50, doc.y, 500, 0.5).fill("#cccccc");
    doc.moveDown(1);

    // Add items table with box around it (smaller font)
    doc
      .fontSize(12)
      .fillColor("#000000")
      .text("Items Being Returned:", 50, doc.y);
    doc.moveDown(0.5);

    // Draw a box for the items
    const itemsStartY = doc.y;
    const itemsPerItem = 25; // Reduced height for smaller text
    doc
      .rect(50, itemsStartY, 500, returnItems.length * itemsPerItem + 10)
      .stroke("#aaaaaa");

    // Add returned items in a more condensed format with smaller font
    let yPos = itemsStartY + 10;
    doc.fontSize(10).fillColor("#333333");

    returnItems.forEach((item, index) => {
      const orderItem = order.items.find(
        (i) => i.item._id.toString() === item.itemId
      );

      if (orderItem && orderItem.item) {
        const itemName = orderItem.item.name || "Unknown Item";
        const sku = orderItem.item.sku || "N/A";
        doc.text(
          `${index + 1}. ${itemName} (Qty: ${item.quantity}, SKU: ${sku})`,
          60,
          yPos
        );
      } else {
        doc.text(
          `${index + 1}. Unknown Item (Qty: ${item.quantity})`,
          60,
          yPos
        );
      }

      yPos += itemsPerItem;
    });

    // Add return instructions below items (not overlapping) with smaller font
    const instructionsY = itemsStartY + returnItems.length * itemsPerItem + 20;
    doc
      .fontSize(12)
      .fillColor("#000000")
      .text("Return Instructions:", 50, instructionsY);

    doc.fontSize(10).fillColor("#333333");
    doc.text("1. Cut out this entire label", 50, doc.y + 10);
    doc.text(
      "2. Securely pack items in original packaging if possible",
      50,
      doc.y + 5
    );
    doc.text(
      "3. Attach this label clearly on the outside of the package",
      50,
      doc.y + 5
    );
    doc.text(
      "4. Drop off the package at your nearest postal facility",
      50,
      doc.y + 5
    );
    doc.text("5. Keep your receipt as proof of return", 50, doc.y + 5);

    // Add footer with warning (smaller font)
    doc
      .fontSize(9)
      .fillColor("#999999")
      .text(
        "This label contains important information for processing your return. " +
          "Please ensure it is clearly visible on the package.",
        50,
        700,
        { align: "center" }
      );

    // Finalize PDF
    doc.end();

    // Return the PDF buffer
    return new Promise((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });
  } catch (error) {
    console.error("Error generating PDF return label:", error);
    // Attempt to finish the document even if there was an error
    doc.end();
    // Return whatever we have
    return Buffer.concat(chunks);
  }
}

/**
 * Send return label email to customer
 */
async function sendReturnLabelEmail(
  email,
  returnLabelUrl,
  order,
  returnItems,
  preCalculatedData = null
) {
  try {
    // Import the sendMailBeta function
    const { sendMailBeta } = require("../graphql/resolvers/sendMail");

    console.log(`Sending return label email to: ${email}`);
    console.log(`Return label URL: ${returnLabelUrl}`);

    // If pre-calculated data is provided, use it directly
    let templateData;

    if (preCalculatedData) {
      console.log("Using pre-calculated data for email template");

      // Add environment variables to the pre-calculated data
      templateData = {
        ...preCalculatedData,
        process: {
          env: {
            BRAND_LOGO_IMAGE_URL: process.env.BRAND_LOGO_IMAGE_URL || "",
            BRAND_NAME: process.env.BRAND_NAME || "Papiloom",
            COMPANY_NAME:
              process.env.COMPANY_NAME || process.env.BRAND_NAME || "Papiloom",
            BUSINESS_NAME:
              process.env.BUSINESS_NAME || process.env.BRAND_NAME || "Papiloom",
          },
        },
      };
    } else {
      console.log(
        "Pre-calculated data not provided, calculating in sendReturnLabelEmail"
      );

      // Get user details for personalization (fallback logic)
      const userFirstName =
        order.user?.firstName ||
        (order.user?.name ? order.user.name.split(" ")[0] : null) ||
        order.shippingAddress?.addresseeFirst ||
        "Valued Customer";

      console.log(`User first name: ${userFirstName}`);

      // Format date for the template with a more readable format
      const returnInitiatedDate = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Create the returnLabelUrls array if not available on the order
      const returnLabelUrls = order.returnLabelUrls ||
        (order.returnDetails && order.returnDetails.returnLabelUrls) || [
          returnLabelUrl,
        ];

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
          } else {
            // It's a direct value
            itemObj.price = parseFloat(itemObj.price || 0);
          }

          // Ensure discount is a number
          itemObj.discount =
            typeof itemObj.discount !== "undefined"
              ? parseFloat(itemObj.discount)
              : 0;

          // Ensure tax is a number
          itemObj.tax =
            typeof itemObj.tax !== "undefined" ? parseFloat(itemObj.tax) : 0;

          processedItem.item = itemObj;
        }

        // Standardize other numeric fields
        processedItem.quantity = parseFloat(orderItem.quantity || 1);
        processedItem.tax = parseFloat(orderItem.tax || 0);
        processedItem.discount = parseFloat(orderItem.discount || 0);

        return processedItem;
      });

      // Create a processed order with standardized numeric values
      const processedOrder = {
        ...order,
        items: processedOrderItems,
      };

      // Process return items with pre-calculated values for the template
      const processedItems = returnItems.map((returnItem) => {
        // Find the corresponding order item
        const orderItem = processedOrderItems.find(
          (oi) =>
            oi.item &&
            oi.item._id &&
            oi.item._id.toString() === returnItem.itemId.toString()
        );

        // Initialize calculation values
        let basePrice = 0;
        let discountPercent = 0;
        let taxPercent = 0;
        let itemName = "Product";
        let returnQuantity = parseFloat(returnItem.quantity || 1);

        if (orderItem && orderItem.item) {
          // Get item name
          itemName = orderItem.item.name || "Product";

          // Get base price
          basePrice = parseFloat(orderItem.item.price);

          // Get discount percentage
          if (typeof orderItem.item.discount !== "undefined") {
            discountPercent = parseFloat(orderItem.item.discount);
          } else if (orderItem.discount > 0) {
            discountPercent =
              parseFloat(orderItem.discount) / parseFloat(orderItem.quantity);
          }

          // Get tax percentage
          if (typeof orderItem.item.tax !== "undefined") {
            taxPercent = parseFloat(orderItem.item.tax);
          } else if (orderItem.tax > 0) {
            taxPercent =
              parseFloat(orderItem.tax) / parseFloat(orderItem.quantity);
          }
        }

        // Calculate prices
        const priceAfterDiscount = basePrice * (1 - discountPercent / 100);
        const taxAmount = priceAfterDiscount * (taxPercent / 100);

        // Calculate total item price
        const totalItemPrice = basePrice * returnQuantity;

        // Calculate total discount amount
        const totalDiscountAmount =
          basePrice * (discountPercent / 100) * returnQuantity;

        // Calculate total tax amount
        const totalTaxAmount = taxAmount * returnQuantity;

        // Calculate refund amount for this item
        const itemRefundAmount =
          priceAfterDiscount * returnQuantity + totalTaxAmount;

        // Return processed item with all calculated values
        return {
          itemId: returnItem.itemId,
          name: itemName,
          quantity: returnQuantity,
          reason: returnItem.reason || "Not specified",
          comment: returnItem.comment || "",
          basePrice: basePrice,
          totalPrice: totalItemPrice.toFixed(2),
          discountPercent: discountPercent,
          discount: totalDiscountAmount.toFixed(2),
          taxPercent: taxPercent,
          tax: totalTaxAmount.toFixed(2),
          refundAmount: itemRefundAmount.toFixed(2),
        };
      });

      // Calculate total refund amount
      const totalRefundAmount = processedItems.reduce(
        (total, item) => total + parseFloat(item.refundAmount),
        0
      );

      console.log(`Total refund amount: ${totalRefundAmount.toFixed(2)}`);

      // Prepare template data with complete order object and pre-calculated values
      templateData = {
        orderNumber: order.orderNumber,
        returnInitiatedDate,
        returnItems: processedItems,
        returnLabelUrl,
        returnLabelUrls,
        orderCurrency: order.currency || "CAD",
        totalRefundAmount: totalRefundAmount.toFixed(2),
        userFirstName,
        // Pass environment variables that might be needed in the template
        process: {
          env: {
            BRAND_LOGO_IMAGE_URL: process.env.BRAND_LOGO_IMAGE_URL || "",
            BRAND_NAME: process.env.BRAND_NAME || "Papiloom",
            COMPANY_NAME:
              process.env.COMPANY_NAME || process.env.BRAND_NAME || "Papiloom",
            BUSINESS_NAME:
              process.env.BUSINESS_NAME || process.env.BRAND_NAME || "Papiloom",
          },
        },
      };
    }

    console.log("Template data prepared for email");

    // Set up email options with template data
    const emailOptions = {
      email: email,
      subject: `Return Label for Order #${order.orderNumber}`,
      context: "returnInitiated",
      template: "returnInitiated",
      templateData: {
        ...templateData,
        // Make sure these essential values are present and correctly formatted
        orderNumber: templateData.orderNumber,
        orderCurrency: templateData.orderCurrency,
        returnItems: templateData.returnItems,
        totalRefundAmount: templateData.totalRefundAmount,
        returnLabelUrl: templateData.returnLabelUrl,
        userFirstName: templateData.userFirstName,
        returnInitiatedDate: templateData.returnInitiatedDate,
        process: {
          env: {
            BRAND_LOGO_IMAGE_URL: process.env.BRAND_LOGO_IMAGE_URL || "",
            BRAND_NAME: process.env.BRAND_NAME || "Papiloom",
            COMPANY_NAME:
              process.env.COMPANY_NAME || process.env.BRAND_NAME || "Papiloom",
            BUSINESS_NAME:
              process.env.BUSINESS_NAME || process.env.BRAND_NAME || "Papiloom",
          },
        },
      },
      attachments: [],
    };

    console.log(`Email template data (Summary):
      orderNumber: ${templateData.orderNumber}
      orderCurrency: ${templateData.orderCurrency}
      returnItems: ${
        templateData.returnItems ? templateData.returnItems.length : 0
      } items
      First item sample: ${
        templateData.returnItems && templateData.returnItems.length > 0
          ? JSON.stringify(templateData.returnItems[0], null, 2).substring(
              0,
              200
            ) + "..."
          : "No items"
      }
      totalRefundAmount: ${templateData.totalRefundAmount}
    `);

    // Send email using the application's standard email function
    await sendMailBeta(emailOptions);
    console.log(`Return label email sent to ${email} using sendMailBeta`);
  } catch (error) {
    console.error("Error sending return label email:", error.message);
    throw error;
  }
}

/**
 * Upload return label to S3 using existing s3Actions
 */
async function uploadReturnLabel(pdfBuffer, orderId) {
  try {
    console.log(`Attempting to upload return label for order: ${orderId}`);
    console.log(
      `S3 bucket name for labels: ${process.env.S3_BUCKET_NAME_LABELS}`
    );
    console.log(`S3 bucket region: ${process.env.S3_BUCKET_REGION}`);
    console.log(`Buffer size: ${pdfBuffer.length} bytes`);

    // Ensure the required environment variables are set
    if (!process.env.S3_BUCKET_NAME_LABELS) {
      console.error("S3_BUCKET_NAME_LABELS environment variable is not set");
      throw new Error("S3 labels bucket name not configured");
    }

    if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_ACCESS_KEY) {
      console.error("S3 credentials are not properly configured");
      throw new Error("S3 credentials missing");
    }

    // Create the filename with a timestamp to ensure uniqueness
    const timestamp = Date.now();
    const filename = `return-labels/${orderId}-${timestamp}-return-label.pdf`;

    console.log(`Uploading PDF with filename: ${filename}`);

    // Upload to S3 using the uploadPDF function
    // The function will detect the return-labels/ prefix and use the correct bucket
    const url = await uploadPDF(pdfBuffer, filename);

    console.log(`Return label upload successful. URL: ${url}`);
    return url;
  } catch (error) {
    console.error(`Failed to upload return label to S3: ${error.message}`);
    console.error(error.stack);

    // More detailed error handling to help diagnose permission issues
    if (error.message && error.message.includes("not authorized to perform")) {
      console.error(
        "This appears to be an S3 permission issue. Make sure the IAM user has PutObject permissions on the labels bucket."
      );
      console.error(`S3 Bucket name: ${process.env.S3_BUCKET_NAME_LABELS}`);
      console.error(`IAM User/Role: ${process.env.S3_ACCESS_KEY}`);
    }

    throw new Error(`S3 upload failed: ${error.message}`);
  }
}

/**
 * Helper function to download return label from S3
 */
async function downloadReturnLabelFromS3(returnLabelUrl) {
  try {
    console.log(`Downloading return label from: ${returnLabelUrl}`);
    const { getS3Item } = require("./s3Actions");

    // Get signed URL
    const signedUrl = await getS3Item(
      returnLabelUrl,
      process.env.S3_BUCKET_NAME_LABELS
    );

    // Download the file
    const response = await axios.get(signedUrl, {
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Error downloading return label: ${error.message}`);
    return null;
  }
}

/**
 * Handle Stripe webhook for refund events
 */
const handleStripeRefundWebhook = async (event) => {
  // Check if it's a refund event
  if (
    event.type !== "charge.refund.updated" &&
    event.type !== "charge.refunded"
  ) {
    console.log(`Ignoring event type: ${event.type}`);
    return {
      success: false,
      message: `Event type ${event.type} is not handled by this webhook`,
    };
  }

  console.log(`Processing ${event.type} event...`);

  try {
    // Extract refund data
    const refundObject = event.data.object;
    const refundId = refundObject.id;
    const refundStatus = refundObject.status;

    // Check for metadata
    const metadata = refundObject.metadata || {};
    const orderId = metadata.orderId;
    const returnItemIds = metadata.returnItemIds
      ? JSON.parse(metadata.returnItemIds)
      : [];

    const returnQuantities = metadata.returnQuantities
      ? JSON.parse(metadata.returnQuantities)
      : [];

    const isReturn = metadata.isReturn === "true";

    // Log extracted data
    console.log("Extracted data from webhook:", {
      refundId,
      refundStatus,
      orderId,
      returnItemIds,
      returnQuantities,
      isReturn,
    });

    // Validate that orderId exists
    if (!orderId) {
      console.warn(`No orderId in refund metadata. Refund ID: ${refundId}`);
      return {
        success: false,
        message: "No orderId found in refund metadata",
      };
    }

    // Find the order
    const { Order } = require("../models/order");
    const order = await Order.findById(orderId);

    if (!order) {
      console.warn(`Order not found for ID: ${orderId}`);
      return {
        success: false,
        message: `Order not found for ID: ${orderId}`,
      };
    }

    // Find the matching refund session
    let refundSession = null;
    if (order.returnDetails && order.returnDetails.refundSessions) {
      refundSession = order.returnDetails.refundSessions.find(
        (session) => session.refundId === refundId
      );
    }

    // If no matching session but we have a refund ID, create a new session
    if (!refundSession && refundId) {
      // Initialize the array if it doesn't exist
      if (!order.returnDetails) {
        order.returnDetails = {
          items: [],
          refundSessions: [],
          returnStatus: "initiated",
          totalRefundAmount: 0,
        };
      } else if (!order.returnDetails.refundSessions) {
        order.returnDetails.refundSessions = [];
      }

      // Create a new refund session based on the webhook data
      refundSession = {
        refundId: refundId,
        refundDate: new Date(),
        refundAmount: refundObject.amount / 100, // Convert from cents to dollars
        status: refundStatus === "succeeded" ? "completed" : refundStatus,
        returnStatus: refundStatus === "succeeded" ? "completed" : "processing", // Move from top-level to session
        refundProcessed: refundStatus === "succeeded", // Move from top-level to session
        returnInitiatedDate: new Date(), // Add returnInitiatedDate to session
        items: [],
      };

      // If we have item IDs, add them to the session
      if (returnItemIds.length > 0) {
        returnItemIds.forEach((itemId, index) => {
          const quantity = returnQuantities[index] || 1;

          // Add item to the session
          refundSession.items.push({
            itemId: itemId,
            quantity: quantity,
            amount: 0, // We don't have individual item amounts from the webhook
          });

          // Update the return item status
          if (order.returnDetails.items) {
            const returnItem = order.returnDetails.items.find(
              (item) => item.itemId.toString() === itemId
            );

            if (returnItem) {
              returnItem.refundStatus =
                refundStatus === "succeeded" ? "completed" : "processing";

              if (refundStatus === "succeeded") {
                returnItem.refundDate = new Date();
              }
            }
          }
        });
      }

      // Add the new session to the order
      order.returnDetails.refundSessions.push(refundSession);
    }
    // If we found a matching session, update its status
    else if (refundSession) {
      refundSession.status =
        refundStatus === "succeeded" ? "completed" : refundStatus;

      // Also update the session-level fields
      refundSession.returnStatus =
        refundStatus === "succeeded" ? "completed" : "processing";
      refundSession.refundProcessed = refundStatus === "succeeded";

      // Update the status of the items in this session
      refundSession.items.forEach((sessionItem) => {
        const returnItem = order.returnDetails.items.find(
          (item) => item.itemId.toString() === sessionItem.itemId.toString()
        );

        if (returnItem) {
          returnItem.refundStatus =
            refundStatus === "succeeded" ? "completed" : "processing";

          if (refundStatus === "succeeded") {
            returnItem.refundDate = new Date();
          }
        }
      });
    }
    // If no specific items in metadata but we have return details, update all items
    else if (isReturn && order.returnDetails && order.returnDetails.items) {
      // Mark all returned items as refunded
      order.returnDetails.items.forEach((item) => {
        item.refundStatus =
          refundStatus === "succeeded" ? "completed" : "processing";
        if (refundStatus === "succeeded") {
          item.refundDate = new Date();
        }
      });
    }

    // Update the backward compatibility fields based on session statuses
    if (order.returnDetails && order.returnDetails.refundSessions) {
      const completedSessions = order.returnDetails.refundSessions.filter(
        (session) => session.status === "completed"
      );

      if (completedSessions.length > 0) {
        order.returnDetails.refundProcessed = true;
        order.returnDetails.refundDate = new Date();

        if (
          completedSessions.length === order.returnDetails.refundSessions.length
        ) {
          order.returnDetails.returnStatus = "completed";
        } else {
          order.returnDetails.returnStatus = "processing";
        }
      }
    }

    // Save the updated order
    await order.save();
    console.log(`Successfully updated refund status for order ${orderId}`);

    return {
      success: true,
      message: `Successfully updated refund status for order ${orderId}`,
    };
  } catch (error) {
    console.error("Error processing refund webhook:", error);
    return {
      success: false,
      message: `Error processing webhook: ${error.message}`,
    };
  }
};

module.exports = {
  generateReturnLabel,
  uploadReturnLabel,
  sendReturnLabelEmail,
  handleStripeRefundWebhook,
};

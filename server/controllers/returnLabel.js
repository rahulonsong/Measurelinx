// controllers/returnLabelController.js
const { Order } = require("../models/order");
const { Item } = require("../models/item");
const {
  generateReturnLabel,
  uploadReturnLabel,
  sendReturnLabelEmail,
  handleStripeRefundWebhook,
} = require("../utils/returnLabel");
const { getS3Item } = require("../utils/s3Actions");
const { sendOrderStatusUpdate } = require("../graphql/resolvers/order");
const { getUserId } = require("../utils/getUserId");
const { processReturnRefund } = require("../utils/stripe");
const { User } = require("../models/user");

/**
 * Controller to handle downloading existing return labels
 */
const downloadReturnLabelController = async (req, res) => {
  const { orderId, labelIndex } = req.params;

  try {
    // Get user ID using the utility or from req.userId set by verifyToken
    const userId = getUserId(req) || req.userId;

    if (!userId) {
      return res.status(403).json({ error: "Authentication required" });
    }

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify the user requesting the label is the owner of the order
    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to this order" });
    }

    // Get the appropriate return label URL
    let returnLabelUrl;

    console.log(
      `Attempting to download return label for order: ${orderId}, label index: ${
        labelIndex || "latest"
      }`
    );
    console.log(`Order returnLabelUrl: ${order.returnLabelUrl || "none"}`);
    console.log(
      `Order returnDetails.returnLabelUrls: ${JSON.stringify(
        order.returnDetails?.returnLabelUrls || []
      )}`
    );
    if (order.returnDetails) {
      console.log(
        `Order returnDetails.returnLabelUrl: ${
          order.returnDetails.returnLabelUrl || "none"
        }`
      );
    }

    // If labelIndex is provided, try to get that specific label from the array
    if (labelIndex !== undefined) {
      console.log(`Looking for label at index: ${labelIndex}`);
      // Get from returnLabelUrls array if it exists and has the requested index
      if (
        order.returnDetails &&
        order.returnDetails.returnLabelUrls &&
        order.returnDetails.returnLabelUrls.length > 0 &&
        order.returnDetails.returnLabelUrls[labelIndex]
      ) {
        returnLabelUrl = order.returnDetails.returnLabelUrls[labelIndex];
        console.log(
          `Found returnDetails.returnLabelUrl at index ${labelIndex}: ${returnLabelUrl}`
        );
      } else {
        console.log(`No return label found at index ${labelIndex}`);
        return res
          .status(404)
          .json({ error: "Return label not found at specified index" });
      }
    } else {
      // Otherwise, get the most recent label (either from returnLabelUrl or the last one in the array)
      console.log("Looking for most recent label");
      if (order.returnLabelUrl) {
        returnLabelUrl = order.returnLabelUrl;
        console.log(`Using order.returnLabelUrl: ${returnLabelUrl}`);
      } else if (order.returnDetails && order.returnDetails.returnLabelUrl) {
        returnLabelUrl = order.returnDetails.returnLabelUrl;
        console.log(
          `Using order.returnDetails.returnLabelUrl: ${returnLabelUrl}`
        );
      } else if (
        order.returnDetails &&
        order.returnDetails.returnLabelUrls &&
        order.returnDetails.returnLabelUrls.length > 0
      ) {
        returnLabelUrl =
          order.returnDetails.returnLabelUrls[
            order.returnDetails.returnLabelUrls.length - 1
          ];
        console.log(
          `Using last item from order.returnDetails.returnLabelUrls: ${returnLabelUrl}`
        );
      } else {
        console.log("No return label found for this order");
        return res
          .status(404)
          .json({ error: "No return label found for this order" });
      }
    }

    // Get signed URL from S3
    try {
      console.log(`Generating signed URL for label: ${returnLabelUrl}`);
      const signedUrl = await getS3Item(
        returnLabelUrl,
        process.env.S3_BUCKET_NAME_LABELS
      );
      console.log(`Generated signed URL: ${signedUrl}`);
      res.status(200).json({ signedUrl });
    } catch (s3Error) {
      console.error(`S3 error when getting signed URL: ${s3Error.message}`);
      return res.status(500).json({
        error: "Failed to retrieve return label from storage",
        details: s3Error.message,
      });
    }
  } catch (error) {
    console.error(`Error in downloadReturnLabelController: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch return label" });
  }
};

/**
 * Generate a new return label for specific items in an order
 */
const generateReturnLabelController = async (req, res) => {
  console.log("=== GENERATE RETURN LABEL REQUEST RECEIVED ===");
  console.log("Request URL:", req.originalUrl);
  console.log("Request method:", req.method);
  console.log("Request params:", req.params);
  console.log("Request body:", req.body);

  // Get user ID using the utility or from req.userId set by verifyToken
  const userId = getUserId(req) || req.userId;
  console.log("Authenticated user ID:", userId);
  console.log("Authorization header:", req.headers.authorization);
  console.log("================================================");

  // Check if user is authenticated
  if (!userId) {
    console.log("ERROR: Authentication required");
    return res.status(403).json({ error: "Authentication required" });
  }

  try {
    const { orderId } = req.params;
    const { items } = req.body;

    // Input validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("ERROR: No items specified for return");
      return res.status(400).json({ error: "No items specified for return" });
    }

    // Find the order
    console.log(`Looking up order: ${orderId} for user: ${userId}`);
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    })
      .populate("items.item", null, "Item")
      .populate("shippingAddress billingAddress user");

    if (!order) {
      console.log(`ERROR: Order not found: ${orderId} for user: ${userId}`);
      return res.status(404).json({ error: "Order not found" });
    }

    console.log(
      `Order found: ${order._id}, proceeding with return label generation`
    );

    // Validate the items for return
    const invalidItems = items.filter((item) => {
      const orderItem = order.items.find(
        (i) => i.item._id.toString() === item.itemId
      );

      // Item doesn't exist in the order
      if (!orderItem) {
        return true;
      }

      // Calculate available quantity
      const returnedQuantity = Number(orderItem.returnedQuantity || 0);
      const availableQuantity = Number(orderItem.quantity) - returnedQuantity;

      // Requested quantity exceeds available quantity
      if (Number(item.quantity) > availableQuantity) {
        return true;
      }

      return false;
    });

    if (invalidItems.length > 0) {
      return res
        .status(400)
        .json({ error: "Invalid return request for items" });
    }

    // Update the returned status for each item
    items.forEach((returnItem) => {
      const orderItem = order.items.find(
        (i) => i.item._id.toString() === returnItem.itemId
      );

      if (orderItem) {
        orderItem.returnedQuantity =
          Number(orderItem.returnedQuantity || 0) + Number(returnItem.quantity);
        orderItem.returned = orderItem.returnedQuantity >= orderItem.quantity;
      }
    });

    // Create return items array for the order's returnDetails
    const returnItemsForOrder = await Promise.all(
      items.map(async (item) => {
        const orderItem = order.items.find(
          (i) => i.item && i.item._id && i.item._id.toString() === item.itemId
        );

        // Calculate refund amount for this item
        let refundAmount = 0;
        let itemData = null;

        // If item not populated properly, fetch it directly
        if (!orderItem || !orderItem.item || !orderItem.item.price) {
          try {
            console.log(
              `Directly fetching item data for ${item.itemId} from database`
            );
            itemData = await Item.findById(item.itemId);
            if (itemData) {
              console.log(
                `Found item in database: ${itemData.name}, price: ${itemData.price}`
              );
            } else {
              console.error(`Item ${item.itemId} not found in database`);
            }
          } catch (err) {
            console.error(`Error fetching item data: ${err.message}`);
          }
        }

        // Use orderItem if available, otherwise use directly fetched item
        if ((orderItem && orderItem.item) || itemData) {
          // Get base price from the item object
          let basePrice = 0;
          if (orderItem && orderItem.item && orderItem.item.price) {
            if (typeof orderItem.item.price.value === "number") {
              basePrice = orderItem.item.price.value;
            } else if (typeof orderItem.item.price.value === "string") {
              basePrice = parseFloat(orderItem.item.price.value) || 0;
            } else if (orderItem.item.price.value) {
              // Handle other potential types
              basePrice = Number(orderItem.item.price.value) || 0;
            }
            console.log(
              `Using item price value: ${basePrice} from`,
              orderItem.item.price
            );
          } else if (itemData) {
            if (itemData.price && typeof itemData.price.value === "number") {
              basePrice = itemData.price.value;
            } else if (
              itemData.price &&
              typeof itemData.price.value === "string"
            ) {
              basePrice = parseFloat(itemData.price.value) || 0;
            } else if (typeof itemData.price === "number") {
              basePrice = itemData.price;
            } else if (typeof itemData.price === "string") {
              basePrice = parseFloat(itemData.price) || 0;
            } else if (itemData.price && itemData.price.value) {
              // Handle other potential types
              basePrice = Number(itemData.price.value) || 0;
            }
            console.log(
              `Using itemData price value: ${basePrice} from`,
              itemData.price
            );
          }

          // Get discount percentage from the item
          let discountPercent = 0;
          if (orderItem && orderItem.item) {
            discountPercent =
              typeof orderItem.item.discount === "number"
                ? orderItem.item.discount
                : typeof orderItem.item.discount === "string"
                ? parseFloat(orderItem.item.discount)
                : 0;
          }

          // Get tax percentage from the item
          let taxPercent = 0;
          if (orderItem && orderItem.item) {
            taxPercent =
              typeof orderItem.item.tax === "number"
                ? orderItem.item.tax
                : typeof orderItem.item.tax === "string"
                ? parseFloat(orderItem.item.tax)
                : 0;
          }

          // Get quantity
          const quantity =
            typeof item.quantity === "number"
              ? item.quantity
              : parseInt(item.quantity);

          // Log values for debugging
          console.log(`Item ${item.itemId} calculation values:`, {
            basePrice,
            discountPercent,
            taxPercent,
            quantity,
            itemName:
              orderItem && orderItem.item
                ? orderItem.item.name
                : itemData
                ? itemData.name
                : "Unknown",
            currency:
              orderItem && orderItem.item && orderItem.item.price
                ? orderItem.item.price.currency
                : "Unknown",
          });

          // Calculate price after discount
          const priceAfterDiscount = basePrice * (1 - discountPercent / 100);
          console.log(`Price after discount: ${priceAfterDiscount.toFixed(2)}`);

          // Calculate tax amount
          const taxAmount = priceAfterDiscount * (taxPercent / 100);
          console.log(`Tax amount per unit: ${taxAmount.toFixed(2)}`);

          // Calculate refund amount
          refundAmount = (priceAfterDiscount + taxAmount) * quantity;
          console.log(
            `Final calculated refund amount: ${refundAmount.toFixed(2)}`
          );
        } else {
          console.error(
            `Cannot calculate refund: Item ${item.itemId} not found in order or database`
          );
        }

        return {
          itemId: item.itemId,
          quantity: item.quantity,
          reason: item.reason,
          comment: item.comment || "",
          returnInitiatedDate: new Date(),
          refundAmount: refundAmount,
          refundStatus: "pending", // Initialize with pending status
        };
      })
    );

    // Create or update return details
    if (!order.returnDetails) {
      order.returnDetails = {
        items: returnItemsForOrder,
        returnStatus: "initiated", // Keep for backward compatibility
        returnInitiatedDate: new Date(), // Keep for backward compatibility
        returnCharges: 0,
        refundSessions: [], // Initialize empty array for refund sessions
        totalRefundAmount: returnItemsForOrder.reduce(
          (total, item) => total + item.refundAmount,
          0
        ),
        returnLabelUrls: [],
      };

      // Add initial refund session in pending status
      const initialRefundSession = {
        refundId: null,
        refundDate: null,
        refundAmount: returnItemsForOrder.reduce(
          (total, item) => total + item.refundAmount,
          0
        ),
        paymentIntentId: null,
        items: returnItemsForOrder.map((item) => ({
          itemId: item.itemId,
          quantity: Number(item.quantity),
          amount: item.refundAmount,
        })),
        status: "initiated",
        returnStatus: "initiated", // New field moved from returnDetails
        refundProcessed: false, // New field moved from returnDetails
        returnInitiatedDate: new Date(), // New field moved from returnDetails
      };

      order.returnDetails.refundSessions = [initialRefundSession];
    } else {
      // If returnDetails already exists, append the new items
      order.returnDetails.items = [
        ...order.returnDetails.items,
        ...returnItemsForOrder,
      ];

      // Initialize refundSessions if it doesn't exist
      if (!order.returnDetails.refundSessions) {
        order.returnDetails.refundSessions = [];
      }

      // Calculate refund amount for newly added items
      const newItemsRefundAmount = returnItemsForOrder.reduce(
        (total, item) => total + item.refundAmount,
        0
      );

      // Add a new refund session for these additional items
      const newRefundSession = {
        refundId: null,
        refundDate: null,
        refundAmount: newItemsRefundAmount,
        paymentIntentId: null,
        items: returnItemsForOrder.map((item) => ({
          itemId: item.itemId,
          quantity: Number(item.quantity),
          amount: item.refundAmount,
        })),
        status: "initiated",
        returnStatus: "initiated", // New field moved from returnDetails
        refundProcessed: false, // New field moved from returnDetails
        returnInitiatedDate: new Date(), // New field moved from returnDetails
      };

      // Add this new session to the refundSessions array
      order.returnDetails.refundSessions.push(newRefundSession);

      // Update total refund amount
      order.returnDetails.totalRefundAmount = order.returnDetails.items.reduce(
        (total, item) => total + (item.refundAmount || 0),
        0
      );

      // Update backward compatibility fields based on sessions
      updateReturnDetailsStatusFromSessions(order);
    }

    // Generate the return label
    console.log("Generating return label...");
    const returnLabelBuffer = await generateReturnLabel(order, items);

    try {
      // Upload to S3
      console.log("Uploading return label to S3...");
      const returnLabelUrl = await uploadReturnLabel(
        returnLabelBuffer,
        order._id
      );
      console.log(`Return label uploaded successfully: ${returnLabelUrl}`);

      // Update order with the new label URL
      // First, update the single returnLabelUrl for backward compatibility
      order.returnLabelUrl = returnLabelUrl;

      // Initialize returnDetails if it doesn't exist
      if (!order.returnDetails) {
        order.returnDetails = {
          items: [],
          returnStatus: "initiated",
          returnInitiatedDate: new Date(),
          returnCharges: 0,
          totalRefundAmount: 0,
          returnLabelUrls: [],
        };
      }

      // Initialize returnLabelUrls array if it doesn't exist
      if (!order.returnDetails.returnLabelUrls) {
        order.returnDetails.returnLabelUrls = [];
      }

      // Add to the returnLabelUrls array in returnDetails
      order.returnDetails.returnLabelUrls.push(returnLabelUrl);

      // Also set the single returnLabelUrl in returnDetails for consistency
      order.returnDetails.returnLabelUrl = returnLabelUrl;

      // Save the order
      await order.save();

      // Attempt to send emails
      let emailSent = false;
      try {
        // Prepare data for email - move calculations from template to controller
        console.log(
          `Preparing data for return label email for order: ${order._id}`
        );

        // Get user's first name for personalization
        const userFirstName =
          order.user?.firstName ||
          (order.user?.name ? order.user.name.split(" ")[0] : null) ||
          order.shippingAddress?.addresseeFirst ||
          "Valued Customer";

        console.log(`User first name: ${userFirstName}`);

        // Process items for email - calculate all values here
        const processedItems = await Promise.all(
          items.map(async (returnItem) => {
            console.log(`Processing return item: ${returnItem.itemId}`);

            // Find the item in the order
            const orderItem = order.items.find(
              (oi) =>
                oi.item &&
                oi.item._id &&
                oi.item._id.toString() === returnItem.itemId
            );

            // Check if this item already has a calculated refund amount in returnDetails
            const returnDetailItem = order.returnDetails.items.find(
              (ri) =>
                ri.itemId.toString() === returnItem.itemId &&
                ri.quantity === parseInt(returnItem.quantity) &&
                ri.reason === returnItem.reason
            );

            // If we already have a stored refund amount, use it
            if (returnDetailItem && returnDetailItem.refundAmount) {
              console.log(
                `Using pre-calculated refund amount: ${returnDetailItem.refundAmount}`
              );

              // Try to get item name from order or fetch from database
              let itemName = "Product";
              if (orderItem && orderItem.item && orderItem.item.name) {
                itemName = orderItem.item.name;
              } else {
                try {
                  const itemData = await Item.findById(returnItem.itemId);
                  if (itemData && itemData.name) {
                    itemName = itemData.name;
                    console.log(`Got item name from database: ${itemName}`);
                  }
                } catch (err) {
                  console.error(`Error fetching item name: ${err.message}`);
                }
              }

              return {
                name: itemName,
                quantity: returnItem.quantity,
                reason: returnItem.reason || "Not specified",
                comment: returnItem.comment || "",
                basePrice:
                  orderItem && orderItem.item
                    ? orderItem.item.price
                      ? orderItem.item.price.value || 0
                      : 0
                    : 0,
                discount: orderItem ? orderItem.discount || "0%" : "0%",
                tax: orderItem ? orderItem.tax || "0%" : "0%",
                totalPrice: (orderItem && orderItem.item
                  ? orderItem.item.price
                    ? orderItem.item.price.value || 0
                    : 0
                  : 0
                ).toFixed(2),
                refundAmount: returnDetailItem.refundAmount.toFixed(2),
              };
            }

            // If item not properly populated, fetch it directly
            let itemData = null;
            if (!orderItem || !orderItem.item || !orderItem.item.price) {
              try {
                console.log(
                  `Email prep: Fetching item data for ${returnItem.itemId} from database`
                );
                itemData = await Item.findById(returnItem.itemId);
                if (itemData) {
                  console.log(
                    `Found item in database: ${itemData.name}, price: ${itemData.price}`
                  );
                } else {
                  console.error(
                    `Item ${returnItem.itemId} not found in database`
                  );
                }
              } catch (err) {
                console.error(`Error fetching item data: ${err.message}`);
              }
            }

            // If we don't have item data from either source, return unknown product
            if (!orderItem && !itemData) {
              console.error(
                `Order item and database item not found for ${returnItem.itemId}`
              );
              return {
                name: "Unknown Product",
                quantity: returnItem.quantity || 1,
                reason: returnItem.reason || "Not specified",
                comment: returnItem.comment || "",
                basePrice: 0,
                discount: "0%",
                tax: "0%",
                totalPrice: "0.00",
                refundAmount: "0.00",
              };
            }

            console.log(
              `Found order item:`,
              orderItem
                ? {
                    id: returnItem.itemId,
                    name: orderItem.item ? orderItem.item.name : "No name",
                    price:
                      orderItem.item && orderItem.item.price
                        ? orderItem.item.price.value
                        : "No price",
                  }
                : "Not found"
            );

            // Get base price from the item object
            let basePrice = 0;
            if (orderItem && orderItem.item && orderItem.item.price) {
              if (typeof orderItem.item.price.value === "number") {
                basePrice = orderItem.item.price.value;
              } else if (typeof orderItem.item.price.value === "string") {
                basePrice = parseFloat(orderItem.item.price.value) || 0;
              } else if (orderItem.item.price.value) {
                // Handle other potential types
                basePrice = Number(orderItem.item.price.value) || 0;
              }
              console.log(
                `Using item price value: ${basePrice} from`,
                orderItem.item.price
              );
            } else if (itemData) {
              if (itemData.price && typeof itemData.price.value === "number") {
                basePrice = itemData.price.value;
              } else if (
                itemData.price &&
                typeof itemData.price.value === "string"
              ) {
                basePrice = parseFloat(itemData.price.value) || 0;
              } else if (typeof itemData.price === "number") {
                basePrice = itemData.price;
              } else if (typeof itemData.price === "string") {
                basePrice = parseFloat(itemData.price) || 0;
              } else if (itemData.price && itemData.price.value) {
                // Handle other potential types
                basePrice = Number(itemData.price.value) || 0;
              }
              console.log(
                `Using itemData price value: ${basePrice} from`,
                itemData.price
              );
            }

            // Get discount percentage from the item
            let discountPercent = 0;
            if (orderItem && orderItem.item) {
              discountPercent =
                typeof orderItem.item.discount === "number"
                  ? orderItem.item.discount
                  : typeof orderItem.item.discount === "string"
                  ? parseFloat(orderItem.item.discount)
                  : 0;
            }

            // Get tax percentage from the item
            let taxPercent = 0;
            if (orderItem && orderItem.item) {
              taxPercent =
                typeof orderItem.item.tax === "number"
                  ? orderItem.item.tax
                  : typeof orderItem.item.tax === "string"
                  ? parseFloat(orderItem.item.tax)
                  : 0;
            }

            // Get quantity and ensure it's a number
            const quantity =
              typeof returnItem.quantity === "number"
                ? returnItem.quantity
                : parseInt(returnItem.quantity);

            console.log(
              `Calculation values - basePrice: ${basePrice}, discount: ${discountPercent}%, tax: ${taxPercent}%, quantity: ${quantity}`
            );

            // Calculate price after any discount
            const priceAfterDiscount = basePrice * (1 - discountPercent / 100);
            console.log(
              `Price after discount: ${priceAfterDiscount.toFixed(2)}`
            );

            // Calculate tax amount based on price after discount
            const taxAmount = priceAfterDiscount * (taxPercent / 100);
            console.log(`Tax amount per unit: ${taxAmount.toFixed(2)}`);

            // Calculate total price for display purposes only
            const totalItemPrice = basePrice * quantity;
            console.log(`Total item price: ${totalItemPrice.toFixed(2)}`);

            // Calculate actual refund amount (this is what matters for the refund)
            const itemRefundAmount =
              priceAfterDiscount * quantity + taxAmount * quantity;
            console.log(`Item refund amount: ${itemRefundAmount.toFixed(2)}`);

            // Get item name from available sources
            const itemName =
              orderItem && orderItem.item && orderItem.item.name
                ? orderItem.item.name
                : itemData && itemData.name
                ? itemData.name
                : "Product";

            return {
              name: itemName,
              quantity: quantity,
              reason: returnItem.reason || "Not specified",
              comment: returnItem.comment || "",
              basePrice: basePrice,
              discount: `${discountPercent}%`,
              tax: `${taxPercent}%`,
              // Format for display in email template - don't include currency here
              totalPrice: basePrice.toFixed(2),
              refundAmount: itemRefundAmount.toFixed(2),
            };
          })
        );

        // Calculate total refund amount from the individual refund amounts
        const totalRefundAmount = processedItems.reduce(
          (total, item) => total + parseFloat(item.refundAmount),
          0
        );

        // If we have a total refund amount in returnDetails, use it
        const finalTotalRefundAmount = order.returnDetails.totalRefundAmount
          ? order.returnDetails.totalRefundAmount
          : totalRefundAmount;

        if (order.returnDetails.totalRefundAmount) {
          console.log(
            `Using stored total refund amount: ${order.returnDetails.totalRefundAmount.toFixed(
              2
            )}`
          );
        }

        // Make sure the order has a valid currency
        const orderCurrency = order.orderCurrency || "CAD";

        // Prepare data for email template
        const emailData = {
          orderNumber: order.orderNumber,
          orderCurrency: orderCurrency,
          returnLabelUrl,
          returnLabelUrls: order.returnDetails.returnLabelUrls,
          returnItems: processedItems.map((item) => ({
            ...item,
            // Add currency to formatted values
            totalPrice: `${orderCurrency} ${item.totalPrice}`,
            refundAmount: `${orderCurrency} ${item.refundAmount}`,
          })),
          totalRefundAmount: finalTotalRefundAmount.toFixed(2),
          userFirstName,
          returnInitiatedDate: new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        console.log(
          "Email data prepared:",
          JSON.stringify(
            {
              orderNumber: emailData.orderNumber,
              orderCurrency: emailData.orderCurrency,
              returnItems: emailData.returnItems.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                refundAmount: item.refundAmount,
              })),
              totalRefundAmount: emailData.totalRefundAmount,
            },
            null,
            2
          )
        );

        // Send the return label email with pre-calculated data
        console.log(`Sending return label email to: ${order.user.email}`);
        await sendReturnLabelEmail(
          order.user.email,
          returnLabelUrl,
          order,
          items,
          emailData // Pass the pre-calculated data
        );

        // Remove the order status update email - only send the return label email
        // await sendOrderStatusUpdate(
        //   order.user.email,
        //   order,
        //   "orderStatusUpdate"
        // );

        emailSent = true;
        console.log("Return label email sent successfully");
      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
        // Don't throw error, continue with the process
      }

      // Return the signed URL to the client
      const signedUrl = await getS3Item(
        returnLabelUrl,
        process.env.S3_BUCKET_NAME_LABELS
      );

      res.status(200).json({
        success: true,
        message: emailSent
          ? "Return request submitted successfully. Check your email for the return label."
          : "Return request submitted successfully, but there was an issue sending the email.",
        returnLabelUrl,
        signedUrl,
      });
    } catch (s3Error) {
      console.error("S3 upload error:", s3Error);

      // Handle S3 specific errors and provide better error messages
      if (
        s3Error.message &&
        s3Error.message.includes("AccessControlListNotSupported")
      ) {
        return res.status(500).json({
          error:
            "Storage configuration issue. Please contact support with code: S3-ACL-CONFIG",
        });
      } else if (
        s3Error.message &&
        s3Error.message.includes("not authorized")
      ) {
        return res.status(500).json({
          error:
            "Storage permission issue. Please contact support with code: S3-AUTH",
        });
      } else {
        return res.status(500).json({
          error:
            "Failed to upload return label to storage. Please contact support with code: S3-UPLOAD-ERR",
        });
      }
    }
  } catch (error) {
    console.error("Error generating return label:", error);
    res.status(500).json({
      error: "Failed to generate return label",
      errorCode: error.code || "UNKNOWN",
    });
  }
};

/**
 * Controller to retrieve all return labels associated with an order
 */
const getReturnLabelsController = async (req, res) => {
  const { orderId } = req.params;

  try {
    console.log(`Fetching return labels for order: ${orderId}`);

    // Get user ID using the utility or from req.userId set by verifyToken
    const userId = getUserId(req) || req.userId;

    if (!userId) {
      console.log("Authentication required for fetching return labels");
      return res.status(403).json({ error: "Authentication required" });
    }

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      console.log(`Order not found: ${orderId}`);
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify the user requesting the labels is the owner of the order
    if (order.user.toString() !== userId) {
      console.log(`Unauthorized access to order ${orderId} by user ${userId}`);
      return res
        .status(403)
        .json({ error: "Unauthorized access to this order" });
    }

    // Get all return labels
    let returnLabelUrls = [];

    // Get from returnDetails.returnLabelUrls
    if (
      order.returnDetails &&
      order.returnDetails.returnLabelUrls &&
      order.returnDetails.returnLabelUrls.length > 0
    ) {
      returnLabelUrls = [...order.returnDetails.returnLabelUrls];
      console.log(
        `Found ${returnLabelUrls.length} labels in order.returnDetails.returnLabelUrls`
      );
    }

    // Add the single returnLabelUrl if it exists and is not already in the array
    if (
      order.returnLabelUrl &&
      !returnLabelUrls.includes(order.returnLabelUrl)
    ) {
      returnLabelUrls.push(order.returnLabelUrl);
      console.log(`Added single returnLabelUrl: ${order.returnLabelUrl}`);
    } else if (
      order.returnDetails &&
      order.returnDetails.returnLabelUrl &&
      !returnLabelUrls.includes(order.returnDetails.returnLabelUrl)
    ) {
      returnLabelUrls.push(order.returnDetails.returnLabelUrl);
      console.log(
        `Added single returnDetails.returnLabelUrl: ${order.returnDetails.returnLabelUrl}`
      );
    }

    // Return the returnLabelUrls to the client
    res.status(200).json({ returnLabelUrls });
  } catch (error) {
    console.error("Error fetching return labels:", error);
    res.status(500).json({ error: "Failed to fetch return labels" });
  }
};

/**
 * Handle Stripe webhook for refund events
 */
const handleStripeRefundWebhookController = async (req, res) => {
  // Check for Stripe signature
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(200).json({
      success: false,
      message: "No Stripe signature provided",
    });
  }

  let event;

  // Verify the webhook signature using the secret
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_REFUND;
    // console.log("Verifying webhook signature");
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    // console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(200).json({
      success: false,
      message: `Webhook signature verification failed: ${err.message}`,
    });
  }

  // console.log(`Webhook verified for event: ${event.type}`);

  // Process the webhook
  try {
    const result = await handleStripeRefundWebhook(event);
    // console.log("Webhook processing result:", result);

    // Always return 200 to Stripe, even if there's an error in our processing
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    // Return 200 to prevent Stripe from retrying
    return res.status(200).json({
      success: false,
      message: "Error processing webhook",
    });
  }
};

/**
 * Process a refund for returned items
 */
const processReturnRefundController = async (req, res) => {
  try {
    // Check authentication
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });
    }

    const user = await User.findById(userId);
    if (!user || !user.admin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admin privileges required",
      });
    }

    // Get order ID from URL parameter
    const { orderId } = req.params;
    // console.log(`Processing refund for order ${orderId}`);

    // Get required data from request body
    const { paymentIntentId, amount, items } = req.body;

    if (!paymentIntentId || !amount || !items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: paymentIntentId, amount, or items",
      });
    }

    // Validate items
    for (const item of items) {
      if (!item.itemId || !item.quantity || !item.amount) {
        return res.status(400).json({
          success: false,
          message: "Each item must include itemId, quantity, and amount",
        });
      }
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if return exists
    if (
      !order.returnDetails ||
      !order.returnDetails.items ||
      order.returnDetails.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No return has been initiated for this order",
      });
    }

    // Validate items in refund request
    const invalidItems = items.filter((item) => {
      const returnedItem = order.returnDetails.items.find(
        (ri) => ri.itemId.toString() === item.itemId
      );

      if (!returnedItem) {
        return true;
      }

      if (Number(item.quantity) > Number(returnedItem.quantity)) {
        return true;
      }

      return false;
    });

    if (invalidItems.length > 0) {
      // console.log("Invalid items found:", invalidItems);
      return res.status(400).json({
        success: false,
        message:
          "Invalid refund request - some items were not returned or quantities exceed returned amounts",
      });
    }

    // Process refund through Stripe
    // console.log("Processing refund with Stripe...");
    try {
      const refund = await processReturnRefund(
        paymentIntentId,
        amount,
        orderId,
        items
      );

      // Create a new refund session or update an existing one
      const refundSession = {
        refundId: refund?.id || null,
        refundDate: new Date(),
        refundAmount: parseFloat(amount),
        paymentIntentId: paymentIntentId,
        items: items.map((item) => ({
          itemId: item.itemId,
          quantity: Number(item.quantity),
          amount: parseFloat(item.amount),
        })),
        status: "completed",
        returnStatus: "completed", // Set the session status
        refundProcessed: true, // Mark as processed
        returnInitiatedDate: order.returnDetails.returnInitiatedDate, // Keep original initiation date
      };

      // Initialize refundSessions array if it doesn't exist
      if (!order.returnDetails.refundSessions) {
        order.returnDetails.refundSessions = [];
        // Just add the new session
        order.returnDetails.refundSessions.push(refundSession);
      } else {
        // Check if we can update an existing session instead of creating a new one
        // Specifically, look for sessions with status "initiated" that have matching items
        let matchingSessionFound = false;

        for (let i = 0; i < order.returnDetails.refundSessions.length; i++) {
          const session = order.returnDetails.refundSessions[i];

          // Skip sessions that are already completed
          if (session.status === "completed") {
            continue;
          }

          // Check if this session contains the items we're refunding
          const itemsMatch = items.every((refundItem) => {
            return session.items.some(
              (sessionItem) =>
                sessionItem.itemId.toString() === refundItem.itemId &&
                sessionItem.quantity >= Number(refundItem.quantity)
            );
          });

          if (itemsMatch) {
            // Update this session instead of creating a new one
            order.returnDetails.refundSessions[i] = {
              ...session,
              refundId: refund?.id || null,
              refundDate: new Date(),
              paymentIntentId: paymentIntentId,
              status: "completed",
              returnStatus: "completed", // Set the session status
              refundProcessed: true, // Mark as processed
            };
            matchingSessionFound = true;
            break;
          }
        }

        // If no matching session was found, add a new one
        if (!matchingSessionFound) {
          order.returnDetails.refundSessions.push(refundSession);
        }
      }

      // Update total refund amount - accumulate from all sessions
      order.returnDetails.totalRefundAmount =
        (order.returnDetails.totalRefundAmount || 0) + parseFloat(amount);

      // Update individual item refund status
      items.forEach((refundItem) => {
        const returnItem = order.returnDetails.items.find(
          (ri) => ri.itemId.toString() === refundItem.itemId
        );

        if (returnItem) {
          returnItem.refundStatus = "completed";
          returnItem.refundDate = new Date();
          returnItem.refundAmount = parseFloat(refundItem.amount || 0);
        }
      });

      // Update backward compatibility fields based on sessions
      updateReturnDetailsStatusFromSessions(order);

      // Save changes
      await order.save();
      // console.log("Order updated with refund status");

      // Send notification to customer about the refund
      try {
        const customer = await User.findById(order.user);
        if (customer && customer.email) {
          // Send refund notification email
          // This should be implemented based on your email system
          // console.log(`Sending refund notification to ${customer.email}`);
        }
      } catch (emailError) {
        console.error("Error sending refund notification:", emailError);
        // Continue processing even if email fails
      }

      return res.status(200).json({
        success: true,
        message: `Refund processed successfully for order ${orderId}`,
      });
    } catch (stripeError) {
      console.error("Stripe refund error:", stripeError);
      return res.status(500).json({
        success: false,
        message: `Stripe refund error: ${stripeError.message}`,
      });
    }
  } catch (error) {
    console.error(`Error processing refund: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Failed to process refund: ${error.message}`,
    });
  }
};

/**
 * Helper function to update return details status from refund sessions
 */
const updateReturnDetailsStatusFromSessions = (order) => {
  if (
    !order.returnDetails ||
    !order.returnDetails.refundSessions ||
    order.returnDetails.refundSessions.length === 0
  ) {
    return;
  }

  // Get all completed sessions
  const completedSessions = order.returnDetails.refundSessions.filter(
    (session) => session.status === "completed"
  );

  // If there are any completed sessions, the refund is at least partially processed
  if (completedSessions.length > 0) {
    order.returnDetails.refundProcessed = true;

    // Use the date of the most recent completed session
    const latestCompletedSession = completedSessions.sort(
      (a, b) => new Date(b.refundDate || 0) - new Date(a.refundDate || 0)
    )[0];

    order.returnDetails.refundDate = latestCompletedSession.refundDate;

    // If all sessions are completed, mark overall status as completed
    if (
      completedSessions.length === order.returnDetails.refundSessions.length
    ) {
      order.returnDetails.returnStatus = "completed";
    } else {
      order.returnDetails.returnStatus = "processing";
    }
  } else {
    // If no completed sessions, use status of most recent session
    const latestSession = order.returnDetails.refundSessions.sort(
      (a, b) =>
        new Date(b.returnInitiatedDate || 0) -
        new Date(a.returnInitiatedDate || 0)
    )[0];

    order.returnDetails.returnStatus =
      latestSession.returnStatus || "initiated";
    order.returnDetails.returnInitiatedDate = latestSession.returnInitiatedDate;
  }
};

module.exports = {
  downloadReturnLabelController,
  generateReturnLabelController,
  getReturnLabelsController,
  handleStripeRefundWebhookController,
  processReturnRefundController,
};

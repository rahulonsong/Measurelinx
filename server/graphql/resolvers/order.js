if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { Order } = require("../../models/order.js");
const { User } = require("../../models/user.js");
const { sendMailBeta } = require("./sendMail");
// const { TagList } = require("../../models/tagList");

// const { User } = require("../../models/user");

// const shortid = require("shortid");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const { transformOrders } = require("../resolvers/merge");
// Use the transformSingleOrder function from merge.js
const { transformSingleOrder } = require("./merge");
const { PairedStringList } = require("../../models/pairedStringList.js");
const { ObjectId } = require("mongoose").Types;
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const BRAND_NAME = `${process.env.BRAND_NAME}`;
const { processReturnRefund } = require("../../utils/stripe");

const sendOrderStatusUpdate = async (
  email,
  orderInfo,
  templateType = "orderStatusUpdate"
) => {
  try {
    // For returnInitiated template, we'll skip here as it's handled by sendReturnLabelEmail
    if (templateType === "returnInitiated") {
      console.log(
        "Return initiated email is handled separately by sendReturnLabelEmail function"
      );
      return;
    }

    // From here, we're only handling standard order status updates
    const templateName = "orderStatusUpdate.ejs";

    // Load the EJS template
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, `../../templates/${templateName}`),
      "utf-8"
    );

    // Render the EJS template with the provided data
    const html = ejs.render(emailTemplate, orderInfo);

    // Set the email subject based on the order status
    const subject = `${orderInfo.orderNumber} - Your ${BRAND_NAME} Order - ${orderInfo.orderStatus}!`;

    // Email options
    const emailOptions = {
      email,
      subject,
      text: `Your Order is ${orderInfo.orderStatus}!`,
      html,
      context: "orderStatusUpdate",
    };

    await sendMailBeta(emailOptions); // Sending the email
    console.log(`Order status update email sent!`);
  } catch (error) {
    console.error("Error sending order status update email:", error);
    throw error;
  }
};

const orderResolver = {
  Query: {
    ordersByUser: async (
      _parent,
      { page = 1, year, searchQuery, sortOrder },
      { req }
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        const limit = parseInt(process.env.USER_ORDERS_PER_PAGE) || 10;
        const skip = (page - 1) * limit;

        // Clean up search query: trim spaces at the start and end but preserve spaces between words
        const searchText = searchQuery ? searchQuery.trim() : "";

        // Build the common pipeline for filtering
        const basePipeline = [
          {
            $match: { user: ObjectId(userId) }, // Filter by user ID
          },
          {
            $lookup: {
              from: "items", // Fetch item details from the 'items' collection
              localField: "items.item",
              foreignField: "_id",
              as: "itemDetails", // Embed item details into each order's items array
            },
          },
          {
            $lookup: {
              from: "addresses", // Fetch billingAddress details from the 'addresses' collection
              localField: "billingAddress",
              foreignField: "_id",
              as: "billingAddressDetails",
            },
          },
          {
            $lookup: {
              from: "addresses", // Fetch shippingAddress details from the 'addresses' collection
              localField: "shippingAddress",
              foreignField: "_id",
              as: "shippingAddressDetails",
            },
          },
          {
            $addFields: {
              billingAddress: {
                $arrayElemAt: ["$billingAddressDetails", 0], // Extract first matching billing address
              },
              shippingAddress: {
                $arrayElemAt: ["$shippingAddressDetails", 0], // Extract first matching shipping address
              },
              items: {
                $map: {
                  input: "$items", // Process items array
                  as: "orderItem",
                  in: {
                    quantity: "$$orderItem.quantity",
                    item: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$itemDetails", // Match itemDetails by item ID
                            as: "itemDetail",
                            cond: {
                              $eq: ["$$itemDetail._id", "$$orderItem.item"],
                            },
                          },
                        },
                        0,
                      ], // Extract the first item detail matching the item ID
                    },
                  },
                },
              },
            },
          },
          // Ensure required fields for billing and shipping address are present
          {
            $match: {
              "billingAddress.line1": { $exists: true, $ne: null },
              "billingAddress.stateProvince": { $exists: true, $ne: null },
              "billingAddress.cityTown": { $exists: true, $ne: null },
              "billingAddress.country": { $exists: true, $ne: null },
              "billingAddress.postalCode": { $exists: true, $ne: null },
              "shippingAddress.line1": { $exists: true, $ne: null },
              "shippingAddress.stateProvince": { $exists: true, $ne: null },
              "shippingAddress.cityTown": { $exists: true, $ne: null },
              "shippingAddress.country": { $exists: true, $ne: null },
              "shippingAddress.postalCode": { $exists: true, $ne: null },
            },
          },
        ];

        // Apply sorting based on sortOrder input (newest or oldest first)
        if (sortOrder === "Oldest First") {
          basePipeline.push({
            $sort: { orderDate: 1 }, // Oldest orders first
          });
        } else {
          basePipeline.push({
            $sort: { orderDate: -1 }, // Newest orders first (default)
          });
        }

        // Apply year filter if provided
        if (year) {
          const startOfYear = new Date(Date.UTC(year, 0, 1));
          const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

          basePipeline.push({
            $addFields: {
              parsedOrderDate: {
                $dateFromString: { dateString: "$orderDate" },
              },
            },
          });

          basePipeline.push({
            $match: {
              parsedOrderDate: { $gte: startOfYear, $lte: endOfYear },
            },
          });
        }

        // Apply search filter if searchText is provided
        if (searchText) {
          basePipeline.push({
            $match: {
              $or: [
                { orderNumber: { $regex: searchText, $options: "i" } }, // Match orderNumber
                {
                  items: {
                    $elemMatch: {
                      $or: [
                        { "item.name": { $regex: searchText, $options: "i" } }, // Match item name
                        {
                          "item.description": {
                            $regex: searchText,
                            $options: "i",
                          },
                        }, // Match item description
                      ],
                    },
                  },
                },
              ],
            },
          });
        }

        // Clone the base pipeline for counting the total orders
        const countPipeline = [...basePipeline];
        countPipeline.push({ $count: "totalOrders" });

        // Add pagination (skip and limit) to the main pipeline for fetching orders
        const fetchPipeline = [
          ...basePipeline,
          { $skip: skip },
          { $limit: limit },
        ];

        // Execute the count pipeline to get the total number of orders
        const totalOrdersResult = await Order.aggregate(countPipeline);
        const totalOrders = totalOrdersResult.length
          ? totalOrdersResult[0].totalOrders
          : 0;
        const numberOfOrderPages = Math.ceil(totalOrders / limit);

        // Execute the main pipeline to fetch the orders
        const orders = await Order.aggregate(fetchPipeline);

        // Transform the orders as per your transformOrders function
        const transformedOrders = await transformOrders(orders);

        return {
          orders: transformedOrders,
          numberOfOrderPages,
        };
      } catch (error) {
        throw error;
      }
    },
    singleOrder: async (_parent, { orderId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Use findOne instead of find to get a single document
        const order = await Order.findOne({
          _id: orderId,
          user: userId,
        })
          .populate({
            path: "items.item",
            select:
              "name routeParam defaultImage category price tax discount images",
          })
          .populate({
            path: "shippingAddress",
          })
          .populate({
            path: "billingAddress",
          });

        if (!order) {
          throw new Error("Invalid order!");
        }

        return transformSingleOrder(order);
      } catch (error) {
        throw error;
      }
    },
    ordersByAdmin: async (_parent, {}, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin) {
        throw new Error("Forbidden!");
      }
      try {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const orders = await Order.find({
          createdAt: { $gte: twoMonthsAgo },
        })
          .populate({
            path: "items.item",
          })
          .populate({
            path: "shippingAddress",
          })
          .populate({
            path: "billingAddress",
          })
          .sort({ createdAt: -1 });

        return orders;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Order
    addOrderData: async (_parent, { orderInput }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // Creating order Model in database
      const order = new Order({
        deliveryEstimate: orderInput.deliveryEstimate,
        orderEstimate: orderInput.orderEstimate,
        items: orderInput.items,
        subTotal: orderInput.subTotal,
        promotion: orderInput.promotion,
        promoCode: orderInput.promoCode,
        billingAddress: orderInput.billingAddress,
        shippingAddress: orderInput.shippingAddress,
        paymentMethod: orderInput.paymentMethod,
        tax: orderInput.tax,
        orderValue: orderInput.orderValue,
        orderCurrency: orderInput.orderCurrency,
        orderStatus: orderInput.orderStatus,
        canceled: orderInput.canceled,
        orderComplete: orderInput.orderComplete,
        trackingNumber: "",
        remarks: "",
        invoiceUrl: "",
        user: userId,
      });
      try {
        const result = await order.save();
        // console.log("result:", result);
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    // canceling an order
    cancelOrder: async (_parent, { orderId }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        let order = await Order.findById(orderId)
          .populate({
            path: "creator",
          })
          .exec();
        // Checking if the user is the owner of this order Model
        if (order.creator._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        let updates = {};
        // Checking if already in transit
        if (
          order.orderStatus == "shipped" ||
          order.orderStatus == "delivered"
        ) {
          throw new Error(
            "The order cannot be canceled at this point as the shipment is already in transit. You are advised to return the item once delivered. Thank you for your understanding."
          );
        }
        // Canceling the order
        updates.orderStatus = "canceled";
        updates.canceled = true;
        let canceledOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            $set: updates,
          },
          { new: true }
        );
        return {
          message: `Order with order number #${canceledOrder.orderNumber} was canceled successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // Multiple order upadtes by Admin
    updateMultipleOrders: async (_parent, { orderInput }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin) {
        throw new Error("Forbidden!");
      }
      // get order Sttauss paired StringList
      const orderStatusCodes = await PairedStringList.findOne({
        pairedStringListName: "orderStatusCodes",
      });
      let statusCodesList;
      if (orderStatusCodes) {
        statusCodesList = orderStatusCodes.pairedStringList;
      }
      try {
        const bulkOps = orderInput.map((order) => ({
          updateOne: {
            filter: { _id: order._id },
            update: {
              orderStatus: order.orderStatus,
              trackingNumber: order.trackingNumber,
            },
          },
        }));

        await Order.bulkWrite(bulkOps);

        // Sending Emails to the respective users for the order status
        for (const order of orderInput) {
          const orderInfo = await Order.findById(order._id)
            .populate({
              path: "user",
              select: "email firstName",
            })
            .populate({
              path: "shippingAddress",
            })
            .populate({
              path: "billingAddress",
            });

          if (orderInfo.user && orderInfo.user.email) {
            // Get status value
            const currentStatus = statusCodesList.find(
              (status) => status.key === orderInfo.orderStatus
            );
            if (currentStatus) {
              orderInfo.orderStatus = currentStatus.stringValue;
            }
            // Ensure orderInfo.orderDate is a valid date and format it to YYYY-MM-DD
            try {
              const orderDate = new Date(orderInfo.orderDate);
              if (!isNaN(orderDate.getTime())) {
                orderInfo.orderDate = orderDate.toISOString().split("T")[0];
              } else {
                throw new Error("Invalid date format for orderInfo.orderDate");
              }

              await sendOrderStatusUpdate(orderInfo.user.email, orderInfo);
            } catch (error) {
              console.error("Error while processing order date:", error);
              throw new Error("Invalid date format for orderInfo.orderDate");
            }
          }
        }

        return { message: "Orders updated successfully" };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // add new fields
    addNewFieldsOrder: async (_parent, {}, { req }, _info) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(userId);
      if (!user.masterAdmin) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }

      try {
        // Adding new fields to  model
        await Order.updateMany(
          {},
          {
            $set: {
              trackingNumber: "",
            },
          },
          { upsert: false }
        );

        // Returning Success message
        return {
          message: "New fields added successfully!",
        };
      } catch (err) {
        throw err;
      }
    },
    // Process return refund
    processReturnRefund: async (
      _parent,
      { orderId, paymentIntentId, amount, items },
      { req },
      _info
    ) => {
      // Check authentication
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      // Check admin privileges
      const user = await User.findById(userId);
      if (!user.admin) {
        throw new Error("Unauthorized: Admin privileges required!");
      }

      try {
        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
          throw new Error("Order not found");
        }

        // Check if return exists
        if (
          !order.returnDetails ||
          !order.returnDetails.items ||
          order.returnDetails.items.length === 0
        ) {
          throw new Error("No return has been initiated for this order");
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
          throw new Error(
            "Invalid refund request - some items were not returned or quantities exceed returned amounts"
          );
        }

        // Process refund through Stripe
        const refund = await processReturnRefund(
          paymentIntentId,
          amount,
          orderId,
          items
        );

        // Create a new refund session
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
          order.returnDetails.refundSessions.reduce(
            (total, session) => total + session.refundAmount,
            0
          );

        // Update individual items
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

        // Calculate overall status based on sessions
        const allSessionsCompleted = order.returnDetails.refundSessions.every(
          (session) => session.status === "completed"
        );

        if (allSessionsCompleted) {
          order.returnDetails.returnStatus = "completed";
        } else {
          order.returnDetails.returnStatus = "processing";
        }

        // At this point, the refund is at least partially processed
        order.returnDetails.refundProcessed = true;
        order.returnDetails.refundDate = new Date();

        // Save changes
        await order.save();

        return {
          message: `Refund processed successfully for order ${orderId}`,
        };
      } catch (error) {
        console.error(`Error processing refund: ${error.message}`);
        throw new Error(`Failed to process refund: ${error.message}`);
      }
    },
  },
};

module.exports = { orderResolver, sendOrderStatusUpdate };

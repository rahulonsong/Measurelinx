const stripe = require("stripe")(process.env.STRIPE_KEY);
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { User } = require("../models/user");
const { Payment } = require("../models/payment");
const { Order } = require("../models/order");
const { getS3Item } = require("../utils/s3Actions");

const { sendMailBeta } = require("../graphql/resolvers/sendMail.js");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

// Instantiating Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const sendOrderConfirmationEmail = async (email, orderInfo) => {
  // Sednging Subscription confirmation email
  const text = `Thank you for Order to ${process.env.BRAND_NAME}.`;
  // html = `<p>Thank you for subscribing to ${process.env.BRAND_NAME}!</p></br><a href="${process.env.VUE_APP_BASE_URL}/unsubscribe/${email}">Unsubscribe</a> here to opt-out from these messages</a>`;
  const context = "orderConfirmation";

  // Load the EJS template from another folder
  const emailTemplate = fs.readFileSync(
    path.join(__dirname, "../templates/orderConfirmation.ejs"),
    "utf-8"
  );

  // Render the EJS template with your data
  const html = ejs.render(emailTemplate, orderInfo);

  // <a sb-type="UNSUBSCRIBE" href="{{${process.env.VUE_APP_BASE_URL}/unsubscribe/${email}}}" style="font-family:Arial, Helvetica, sans-serif;color:#333333;font-size:11px;"></a>
  emailOptions = Object.assign(
    {},
    {
      email,
      subject: `${process.env.BRAND_NAME} Order Confirmation - ${orderInfo.orderNumber}!`,
      text,
      html,
      context,
    }
  );
  try {
    await sendMailBeta(emailOptions);
    console.log("Order Confirmation sent!");
  } catch (error) {
    throw error;
  }
};

const generateTransactionId = () => {
  const id = crypto.randomBytes(4).toString("hex");
  return id.toUpperCase();
};

// Update the function to handle both successful and failed payments
const processPaymentAndSendConfirmation = async (
  paymentIntent,
  status = "success"
) => {
  // get Order details from the order
  let lastOrder;
  let transactionId;
  try {
    lastOrder = await Order.findById(paymentIntent.storeOrderId)
      .populate({
        path: "items.item",
      })
      .populate({
        path: "shippingAddress",
      })
      .populate({
        path: "billingAddress",
      });

    if (!lastOrder) {
      console.error(`Order not found: ${paymentIntent.storeOrderId}`);
      return;
    }

    // For successful payments, only process if not already marked successful
    if (status === "success" && lastOrder.orderStatus === "paymentSuccess") {
      return;
    }

    // Generate transaction ID
    transactionId = generateTransactionId();

    // Format amount properly - use EXACT value from Stripe
    const amountFromStripe = paymentIntent.amount / 100;
    const formattedAmount = amountFromStripe.toFixed(2);

    console.log(
      `Updating order amount from ${lastOrder.orderValue} to ${formattedAmount}`
    );

    // Create payment instance in database with appropriate status
    const payment = new Payment({
      amount: formattedAmount,
      currency: process.env.CURRENCY,
      date: new Date().toISOString(),
      transactionId: transactionId,
      orderId: lastOrder._doc ? lastOrder._doc._id : lastOrder._id,
      paymentIntentId: paymentIntent.id,
      status: status,
      failureReason:
        status === "failed" ? paymentIntent.failureReason : undefined,
      user: lastOrder._doc ? lastOrder._doc.user : lastOrder.user,
    });

    const paymentResult = await payment.save();

    // Update the order with payment information
    lastOrder.payment = paymentResult._id;
    lastOrder.transactionId = transactionId;

    // Update the order with the exact amount from Stripe
    lastOrder.orderValue = formattedAmount;

    // Set appropriate order status based on payment status
    if (status === "success") {
      // Update payment intent metadata if using CAD currency
      if (process.env.CURRENCY === "cad") {
        const stripeNew = require("stripe")(process.env.STRIPE_KEY);
        const newMetadata = {
          transactionId: transactionId,
          billingAddress: `${lastOrder.billingAddress._id}`,
          shippingAddress: `${lastOrder.shippingAddress._id}`,
          paymentId: `${paymentResult._id}`,
        };
        await stripeNew.paymentIntents.update(paymentIntent.id, {
          metadata: newMetadata,
        });
      }

      lastOrder.orderStatus = "paymentSuccess";
    } else if (status === "failed") {
      lastOrder.orderStatus = "pendingPayment";
      lastOrder.paymentFailureReason = paymentIntent.failureReason;
    }

    let updatedOrder = await lastOrder.save();

    // Get the user
    let user = await User.findById(paymentResult.user);

    // Only send confirmation email for successful payments
    if (status === "success") {
      // Prepare items with images for the email
      const itemsWithImages = await Promise.all(
        updatedOrder.items.map(async (itemEl) => {
          let defaultImage = "";
          if (itemEl.item.images && itemEl.item.images.length) {
            defaultImage = await getS3Item(
              itemEl.item.images[0].filename,
              process.env.S3_BUCKET_NAME_ITEM
            );
          }
          return {
            item: {
              defaultImage: defaultImage,
              name: itemEl.item.name,
              sku: itemEl.item.sku,
              price: itemEl.item.price,
              discount: itemEl.item.discount || 0,
              tax: itemEl.item.tax || 0,
            },
            quantity: itemEl.quantity,
          };
        })
      );

      let orderInfo = {
        url: process.env.BRAND_WEBSITE,
        userFirstName: user.firstName,
        orderNumber: updatedOrder.orderNumber,
        tax: updatedOrder.tax,
        deliveryFee: updatedOrder.deliveryFee,
        discount: updatedOrder.discount,
        promotion: updatedOrder.promotion,
        orderCurrency: updatedOrder.orderCurrency === "cad" ? "CAD" : "INR",
        orderCurrencySymbol: updatedOrder.orderCurrency === "cad" ? "$" : "₹",
        subTotal: updatedOrder.subTotal,
        orderValue: updatedOrder.orderValue,
        shippingAddress: updatedOrder.shippingAddress,
        billingAddress: updatedOrder.billingAddress,
        items: itemsWithImages,
      };

      // Send email confirmation for successful orders
      await sendOrderConfirmationEmail(user.email, orderInfo);
    } else if (status === "failed") {
      try {
        // Add detailed logging for failed payment emails
        console.log(
          `Attempting to send failure email for order ${updatedOrder.orderNumber}`
        );

        // Ensure we have all required data for the email
        if (!user || !user.email) {
          console.error(
            `Missing user data for failed payment email: ${updatedOrder._id}`
          );
          return updatedOrder;
        }

        // Include additional diagnostic info in email options
        const failureEmailData = {
          orderNumber: updatedOrder.orderNumber,
          firstName: user.firstName || "Customer",
          failureReason:
            paymentIntent.failureReason ||
            "The payment could not be processed.",
          attemptedAmount: formattedAmount,
          orderCurrency: updatedOrder.orderCurrency === "cad" ? "CAD" : "INR",
          orderCurrencySymbol: updatedOrder.orderCurrency === "cad" ? "$" : "₹",
        };

        // Send failure notification with better error handling
        await sendPaymentFailureEmail(user.email, failureEmailData);
        console.log(`Payment failure email sent successfully to ${user.email}`);
      } catch (emailError) {
        console.error(
          `Failed to send payment failure email: ${emailError.message}`
        );
        // Don't throw here, just log the error
      }
    }

    return updatedOrder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Create a payment failure email function using EJS template
const sendPaymentFailureEmail = async (email, orderInfo) => {
  const text = `Your payment for order ${orderInfo.orderNumber} could not be processed.`;
  const context = "paymentFailure";

  try {
    console.log(
      `Preparing payment failure email for order ${orderInfo.orderNumber}`
    );

    // Check if template exists
    const templatePath = path.join(
      __dirname,
      "../templates/paymentFailure.ejs"
    );
    if (!fs.existsSync(templatePath)) {
      console.error(
        `Payment failure email template not found at: ${templatePath}`
      );
      // Create a simple HTML fallback if template is missing
      const html = `
        <h2>Payment Failed</h2>
        <p>Hello ${orderInfo.firstName},</p>
        <p>Unfortunately, your payment for order #${orderInfo.orderNumber} could not be processed.</p>
        <p>Reason: ${orderInfo.failureReason}</p>
        <p>Please try again or contact customer support for assistance.</p>
      `;

      const emailOptions = {
        email,
        subject: `${process.env.BRAND_NAME} Payment Failed - Order ${orderInfo.orderNumber}`,
        text,
        html,
        context,
      };

      await sendMailBeta(emailOptions);
      console.log("Payment failure notification sent successfully!");
    } else {
      // Load the EJS template if it exists
      const emailTemplate = fs.readFileSync(templatePath, "utf-8");

      // Render the EJS template with the order info
      const html = ejs.render(emailTemplate, orderInfo);

      const emailOptions = {
        email,
        subject: `${process.env.BRAND_NAME} Payment Failed - Order ${orderInfo.orderNumber}`,
        text,
        html,
        context,
      };

      // Add more details to help debug
      console.log(`Sending payment failure email to: ${email}`);

      await sendMailBeta(emailOptions);
    }
  } catch (error) {
    console.error("Error sending payment failure notification:", error);
  }
};

// Update the webhook handler for failed payments
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_SIGN_KEY
    );

    switch (event.type) {
      // Handle successful payment intent
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        // Extract payment and order details
        const paymentId = paymentIntent.id;
        const paymentAmount = paymentIntent.amount_received; // In smallest unit
        const storeOrderId = paymentIntent.metadata?.orderId;

        if (!storeOrderId) {
          throw new Error("Order ID not found in payment intent metadata");
        }

        // Prepare payment details for processing
        const paymentDetails = {
          orderId: paymentId,
          id: paymentId,
          amount: paymentAmount, // Keep in cents for consistent handling
          storeOrderId,
        };

        // Call the common function to process payment and send confirmation
        await processPaymentAndSendConfirmation(paymentDetails);

        console.log(`Payment succeeded for paymentIntent: ${paymentIntent.id}`);
        break;

      // Handle failed payment intent
      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object;
        const failedStoreOrderId = failedPaymentIntent.metadata?.orderId;

        if (!failedStoreOrderId) {
          console.error(
            "Order ID not found in payment intent metadata for failed payment"
          );
          return res.status(200).send({ received: true });
        }

        try {
          // Get order details to prepare email information
          const failedOrder = await Order.findById(failedStoreOrderId).populate(
            "user"
          );

          if (!failedOrder) {
            console.error(`Order not found: ${failedStoreOrderId}`);
            return res.status(200).send({ received: true });
          }

          // Generate transaction ID for the failed attempt
          const failedTransactionId = generateTransactionId();

          // Convert amount from cents to dollars with 2 decimal places - EXACT value from Stripe
          const amountInDollars = failedPaymentIntent.amount / 100;
          const formattedAmount = amountInDollars.toFixed(2);

          console.log(
            `Failed payment for order ${failedStoreOrderId}, amount: ${formattedAmount}`
          );

          // Create a payment record for the failed attempt
          const failedPayment = new Payment({
            amount: formattedAmount,
            currency: process.env.CURRENCY,
            date: new Date().toISOString(),
            transactionId: failedTransactionId,
            orderId: failedStoreOrderId,
            paymentIntentId: failedPaymentIntent.id,
            status: "failed",
            failureReason:
              failedPaymentIntent.last_payment_error?.message ||
              "Payment processing failed",
            user: failedOrder.user._id,
          });

          const failedPaymentResult = await failedPayment.save();

          // Update order with payment reference, failure reason, and orderValue - use EXACT Stripe amount
          await Order.findByIdAndUpdate(failedStoreOrderId, {
            $set: {
              orderStatus: "pendingPayment",
              payment: failedPaymentResult._id,
              paymentFailureReason:
                failedPaymentIntent.last_payment_error?.message ||
                "Payment processing failed",
              orderValue: formattedAmount, // Use the precise amount from Stripe
            },
          });

          // Get user details for the email
          const user = await User.findById(failedOrder.user);

          // Improved error handling for email sending
          try {
            // Send email notification about failed payment with additional diagnostic info
            await sendPaymentFailureEmail(user.email, {
              orderNumber: failedOrder.orderNumber,
              firstName: user.firstName,
              attemptedAmount: formattedAmount,
              orderCurrency:
                failedOrder.orderCurrency === "cad" ? "CAD" : "INR",
              orderCurrencySymbol:
                failedOrder.orderCurrency === "cad" ? "$" : "₹",
              failureReason:
                failedPaymentIntent.last_payment_error?.message ||
                "The payment could not be processed.",
            });
            console.log(
              `Failed payment email sent for order: ${failedOrder.orderNumber}`
            );
          } catch (emailError) {
            console.error(
              `Failed to send payment failure email: ${emailError.message}`
            );
            // Don't rethrow, continue processing
          }

          console.log(
            `Order status updated for failed payment: ${failedStoreOrderId}, new amount: ${formattedAmount}`
          );
        } catch (updateError) {
          console.error(
            `Error handling failed payment: ${updateError.message}`
          );
        }

        console.warn(
          `Payment failed for paymentIntent: ${failedPaymentIntent.id}`
        );
        break;

      // Handle completed checkout session
      case "checkout.session.completed":
        const session = event.data.object;

        // Retrieve the associated payment intent
        const sessionPaymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent
        );

        // Extract payment and order details
        const sessionPaymentId = sessionPaymentIntent.id;
        const sessionPaymentAmount = sessionPaymentIntent.amount_received; // In smallest unit
        const sessionStoreOrderId = sessionPaymentIntent.metadata?.orderId;

        if (!sessionStoreOrderId) {
          throw new Error(
            "Order ID not found in checkout session payment intent metadata"
          );
        }

        // Prepare payment details for processing
        const sessionPaymentDetails = {
          orderId: sessionPaymentId,
          id: sessionPaymentId,
          amount: sessionPaymentAmount,
          storeOrderId: sessionStoreOrderId,
        };

        // Call the common function to process payment and send confirmation
        await processPaymentAndSendConfirmation(sessionPaymentDetails);

        console.log(`Checkout session completed for session: ${session.id}`);
        break;

      // Handle expired checkout session (abandoned cart/payment)
      case "checkout.session.expired":
        const expiredSession = event.data.object;

        try {
          // Only process if payment_intent exists
          if (!expiredSession.payment_intent) {
            console.log("No payment intent in expired session, skipping");
            break;
          }

          // Get the payment intent to extract order ID from metadata
          const expiredPaymentIntent = await stripe.paymentIntents.retrieve(
            expiredSession.payment_intent
          );

          const expiredOrderId = expiredPaymentIntent.metadata?.orderId;

          if (expiredOrderId) {
            // Format the amount properly - EXACT value from Stripe
            const expiredAmountInDollars = expiredPaymentIntent.amount / 100;
            const formattedExpiredAmount = expiredAmountInDollars.toFixed(2);

            // Get order to retrieve user information for email
            const expiredOrder = await Order.findById(expiredOrderId).populate(
              "user"
            );

            if (!expiredOrder) {
              console.error(
                `Order not found for expired session: ${expiredOrderId}`
              );
              break;
            }

            // Generate transaction ID for the record
            const expiredTransactionId = generateTransactionId();

            // Create a payment record for the expired attempt
            const expiredPayment = new Payment({
              amount: formattedExpiredAmount,
              currency: process.env.CURRENCY,
              date: new Date().toISOString(),
              transactionId: expiredTransactionId,
              orderId: expiredOrderId,
              paymentIntentId: expiredPaymentIntent.id,
              status: "expired",
              failureReason: "Checkout session expired (payment abandoned)",
              user: expiredOrder.user._id,
            });

            const expiredPaymentResult = await expiredPayment.save();

            await Order.findByIdAndUpdate(expiredOrderId, {
              $set: {
                orderStatus: "canceled",
                canceled: true,
                paymentFailureReason:
                  "Checkout session expired (payment abandoned)",
                orderValue: formattedExpiredAmount, // Use the precise amount from Stripe
              },
            });

            // Try to send an abandoned cart email
            try {
              if (expiredOrder.user && expiredOrder.user.email) {
                // You might want to create a specific email template for abandoned carts
                await sendPaymentFailureEmail(expiredOrder.user.email, {
                  orderNumber: expiredOrder.orderNumber,
                  firstName: expiredOrder.user.firstName || "Customer",
                  attemptedAmount: formattedExpiredAmount,
                  orderCurrency:
                    expiredOrder.orderCurrency === "cad" ? "CAD" : "INR",
                  orderCurrencySymbol:
                    expiredOrder.orderCurrency === "cad" ? "$" : "₹",
                  failureReason: "Your checkout session has expired.",
                });
                console.log(
                  `Session expired email sent for order: ${expiredOrder.orderNumber}`
                );
              }
            } catch (emailError) {
              console.error(
                `Failed to send session expired email: ${emailError.message}`
              );
            }

            console.log(
              `Order marked as abandoned for expired session: ${expiredSession.id}`
            );
          }
        } catch (error) {
          console.error(
            `Error processing expired checkout session: ${error.message}`
          );
        }
        break;

      // Handle async payment failed events
      case "checkout.session.async_payment_failed":
        const asyncFailedSession = event.data.object;

        try {
          // Get the payment intent to extract order ID from metadata
          const asyncFailedPaymentIntent = await stripe.paymentIntents.retrieve(
            asyncFailedSession.payment_intent
          );

          const asyncFailedOrderId = asyncFailedPaymentIntent.metadata?.orderId;

          if (asyncFailedOrderId) {
            // Convert amount from cents to dollars with 2 decimal places
            const amountInDollars = asyncFailedPaymentIntent.amount / 100;
            const formattedAmount = amountInDollars.toFixed(2);

            console.log(
              `Async payment failed for order ${asyncFailedOrderId}, amount: ${formattedAmount}`
            );

            // Get order to retrieve user information for email
            const failedOrder = await Order.findById(
              asyncFailedOrderId
            ).populate("user");

            if (!failedOrder) {
              console.error(
                `Order not found for async payment failure: ${asyncFailedOrderId}`
              );
              break;
            }

            // Generate transaction ID for the failed attempt
            const asyncFailedTransactionId = generateTransactionId();

            // Create a payment record for the failed attempt
            const asyncFailedPayment = new Payment({
              amount: formattedAmount,
              currency: process.env.CURRENCY,
              date: new Date().toISOString(),
              transactionId: asyncFailedTransactionId,
              orderId: asyncFailedOrderId,
              paymentIntentId: asyncFailedPaymentIntent.id,
              status: "failed",
              failureReason: "Async payment failed",
              user: failedOrder.user._id,
            });

            const asyncFailedPaymentResult = await asyncFailedPayment.save();

            // Update order status and orderValue
            await Order.findByIdAndUpdate(asyncFailedOrderId, {
              $set: {
                orderStatus: "pendingPayment",
                payment: asyncFailedPaymentResult._id,
                paymentFailureReason: "Async payment failed",
                orderValue: formattedAmount, // Use the precise amount from Stripe
              },
            });

            // Try to send email notification
            try {
              if (failedOrder.user && failedOrder.user.email) {
                await sendPaymentFailureEmail(failedOrder.user.email, {
                  orderNumber: failedOrder.orderNumber,
                  firstName: failedOrder.user.firstName || "Customer",
                  attemptedAmount: formattedAmount,
                  orderCurrency:
                    failedOrder.orderCurrency === "cad" ? "CAD" : "INR",
                  orderCurrencySymbol:
                    failedOrder.orderCurrency === "cad" ? "$" : "₹",
                  failureReason: "The payment could not be processed.",
                });
                console.log(
                  `Async payment failure email sent for order: ${failedOrder.orderNumber}`
                );
              }
            } catch (emailError) {
              console.error(
                `Failed to send async payment failure email: ${emailError.message}`
              );
            }

            console.log(
              `Order status updated for async payment failure: ${asyncFailedOrderId}`
            );
          }
        } catch (error) {
          console.error(
            `Error processing async payment failure: ${error.message}`
          );
        }
        break;

      // Handle async payment succeeded events
      case "checkout.session.async_payment_succeeded":
        const asyncSuccessSession = event.data.object;

        try {
          // Get the payment intent from the session
          const asyncSuccessPaymentIntent =
            await stripe.paymentIntents.retrieve(
              asyncSuccessSession.payment_intent
            );

          const asyncSuccessOrderId =
            asyncSuccessPaymentIntent.metadata?.orderId;

          if (asyncSuccessOrderId) {
            // Process this like a regular successful payment
            const asyncSuccessPaymentDetails = {
              orderId: asyncSuccessPaymentIntent.id,
              id: asyncSuccessPaymentIntent.id,
              amount: asyncSuccessPaymentIntent.amount,
              storeOrderId: asyncSuccessOrderId,
            };

            // Use the existing function to process successful payments
            await processPaymentAndSendConfirmation(asyncSuccessPaymentDetails);
            console.log(
              `Async payment succeeded for order: ${asyncSuccessOrderId}`
            );
          }
        } catch (error) {
          console.error(
            `Error processing async payment success: ${error.message}`
          );
        }
        break;

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send({ received: true });
  } catch (error) {
    console.error(`Error handling webhook: ${error.message}`);
    res.status(400).send(`Webhook error: ${error.message}`);
  }
};

const handleRazorpayPayment = async (req, res) => {
  // ... existing code ...
};

const handlePaymentWebhook = async (req, res) => {
  try {
    // Differentiating based on payload structure or separate URL paths
    if (req.originalUrl === "/stripe/webhook") {
      await handleStripeWebhook(req, res);
    } else if (req.originalUrl === "/razorpay/webhook") {
      await handleRazorpayPayment(req, res);
    }
  } catch (error) {
    console.error("Payment Webhook Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Export all necessary functions
module.exports = {
  handlePaymentWebhook, // Make sure handlePaymentWebhook is exported
  handleStripeWebhook, // Export other functions as needed
  handleRazorpayPayment, // Export other functions as needed
};

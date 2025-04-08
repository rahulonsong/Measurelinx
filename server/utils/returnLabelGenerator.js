require("dotenv").config();
const { Shippo } = require("shippo");
const shippoInstance = new Shippo(process.env.SHIPPO_API_KEY);

const axios = require("axios"); // Required to download the label PDF
const { uploadPDF } = require("../utils/s3Actions"); // S3 PDF upload function

// Helper function to create a shipment using Shippo
const createShipment = async (order) => {
  try {
    const shipment = await shippoInstance.shipment.create({
      address_from: {
        name: process.env.BUSINESS_NAME,
        street1: process.env.BUSINESS_ADDRESS,
        city: process.env.BUSINESS_CITY,
        state: process.env.BUSINESS_STATE,
        zip: process.env.BUSINESS_ZIP,
        country: process.env.BUSINESS_COUNTRY,
        phone: process.env.BUSINESS_PHONE,
        email: process.env.BUSINESS_EMAIL,
      },
      address_to: {
        name: `${order.shippingAddress.addresseeFirst} ${order.shippingAddress.addresseeLast}`,
        street1: order.shippingAddress.line1,
        city: order.shippingAddress.cityTown,
        state: order.shippingAddress.stateProvince,
        zip: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phoneNumber,
        email: order.user.email, // Assuming order.user has an email
      },
      parcels: [
        {
          length: parseFloat(process.env.PACKAGE_LENGTH),
          width: parseFloat(process.env.PACKAGE_WIDTH),
          height: parseFloat(process.env.PACKAGE_HEIGHT),
          distance_unit: process.env.PACKAGE_DIMENSION_UNIT,
          weight: order.returnDetails.items.reduce((total, item) => {
            const orderItem = order.items.find(
              (i) => i.item.toString() === item.itemId
            );
            if (!orderItem)
              throw new Error(`Item ${item.itemId} not found in order.`);
            return total + (orderItem.weight || 0) * item.quantity;
          }, 0),
          mass_unit: process.env.PACKAGE_WEIGHT_UNIT,
        },
      ],
      async: false, // Do not perform async calls, wait for the response
    });

    return shipment;
  } catch (error) {
    console.error(
      `Error creating shipment for order ${order.orderNumber}:`,
      error.message
    );
    throw error;
  }
};

// Function to generate return label and upload it to S3
const generateReturnLabelAndUpload = async (order) => {
  try {
    // Step 1: Create a shipment object
    const shipment = await createShipment(order);

    if (!shipment || !shipment.rates) {
      throw new Error("No rates found for this shipment.");
    }

    // Step 2: Get shipping rate based on service level
    let rate = shipment.rates.find(
      (rate) => rate.servicelevel.name === process.env.SHIPPO_SERVICE_LEVEL
    );

    if (!rate) {
      // Fallback to the first available rate if the preferred one is not found
      console.warn(
        `Preferred service level ${process.env.SHIPPO_SERVICE_LEVEL} not found. Using first available rate.`
      );
      rate = shipment.rates[0];
    }

    // Step 3: Purchase the shipping label
    const transaction = await shippoInstance.transaction.create({
      rate: rate.object_id,
      label_file_type: "PDF", // Ensure PDF format for the label
    });

    if (transaction.status !== "SUCCESS") {
      console.error(`Failed to generate label for order ${order.orderNumber}`);
      throw new Error(`Transaction failed for order ${order.orderNumber}.`);
    }

    // Step 4: Download the label PDF
    const labelPdf = await axios.get(transaction.label_url, {
      responseType: "arraybuffer",
    });

    // Validate the content type before proceeding (optional but recommended)
    if (!labelPdf.headers["content-type"].includes("application/pdf")) {
      throw new Error("Returned label is not in PDF format.");
    }

    // Step 5: Upload the label PDF to S3
    const s3LabelUrl = await uploadPDF(
      labelPdf.data,
      `return-labels/${order.orderNumber}.pdf`
    );

    console.log(
      `Label uploaded successfully for order ${order.orderNumber}. URL: ${s3LabelUrl}`
    );

    return s3LabelUrl;
  } catch (error) {
    console.error(
      `Error generating return label for order ${order.orderNumber}:`,
      error.message
    );
    throw new Error("Failed to generate return label.");
  }
};

module.exports = {
  generateReturnLabelAndUpload,
};

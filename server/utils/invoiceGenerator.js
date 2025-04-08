if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PDFDocument = require("pdfkit");
const { Order } = require("../models/order");
const { uploadPDF } = require("../utils/s3Actions");
const { downloadImage } = require("../utils/downloadImage");
const path = require("path");
const fs = require("fs");
const APP_CURRENCY = process.env.APP_CURRENCY;
const CUSTOMER_INFORMATION_TOP = 200;
const CUSTOMER_INFORMATION_END = 140;

async function generateInvoice(orderId) {
  const order = await Order.findById(orderId).populate(
    "items.item billingAddress shippingAddress user"
  );

  if (!order) {
    throw new Error("Order not found");
  }

  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // Register and use the custom font
  doc.registerFont(
    "NotoSans",
    path.join(__dirname, "../fonts/NotoSans-Regular.ttf")
  );
  doc.registerFont(
    "NotoSans-Bold",
    path.join(__dirname, "../fonts/NotoSans-Bold.ttf")
  );
  doc.font("NotoSans");

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  const pdfGenerationPromise = new Promise((resolve, reject) => {
    doc.on("end", async () => {
      try {
        const pdfData = Buffer.concat(buffers);
        const filename = `${order.orderNumber}_${Date.now()}.pdf`;
        const url = await uploadPDF(pdfData, filename);
        order.invoiceUrl = filename; // Store the key, not the full URL
        await order.save();
        resolve(filename); // Return the key, not the full URL
      } catch (error) {
        reject(error);
      }
    });
  });

  await generateHeader(doc);
  generateCustomerInformation(doc, order);
  generateInvoiceTable(doc, order);
  generateFooter(doc, doc.y + 30); // Adjusted footer position

  doc.end();

  // Wait for the PDF generation and upload to finish
  return pdfGenerationPromise;
}

async function generateHeader(doc) {
  const logoUrl = process.env.BRAND_LOGO_IMAGE_URL;
  if (logoUrl) {
    const logoPath = path.join(__dirname, "../temp/logo.png"); // Temporary path for the logo
    await downloadImage(logoUrl, logoPath);
    doc.image(logoPath, 50, 45, { width: 50 });
    fs.unlinkSync(logoPath); // Remove the temporary logo file
  }
  doc
    .fillColor("#444444")
    .fontSize(18) // Adjusted font size
    .text(process.env.BRAND_NAME, 110, 57)
    .fontSize(10)
    .text(process.env.BRAND_NAME, 200, 50, { align: "right" })
    .text(process.env.ADDRESS_LINE1, 200, 65, { align: "right" })
    .text(process.env.ADDRESS_LINE2, 200, 80, { align: "right" })
    .text(process.env.ADDRESS_LINE3, 200, 95, { align: "right" })
    .text(process.env.ADDRESS_LINE4, 200, 110, { align: "right" })
    .text(`Email: ${process.env.EMAIL}`, 200, 125, { align: "right" })
    .text(`Phone: ${process.env.PHONE}`, 200, 140, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, order) {
  doc.fillColor("#444444").fontSize(16).text("Invoice", 50, 160);
  generateHr(doc, 180);

  const customerInformationTop = CUSTOMER_INFORMATION_TOP;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("NotoSans-Bold")
    .text(order.orderNumber, 150, customerInformationTop)
    .font("NotoSans")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Invoiced Amount:", 50, customerInformationTop + 30)
    .text(formatCurrency(order.orderValue), 150, customerInformationTop + 30);

  doc
    .font("NotoSans-Bold")
    .text("Billing Address", 50, customerInformationTop + 60)
    .text("Shipping Address", 300, customerInformationTop + 60)
    .font("NotoSans")
    .text(order.billingAddress.name, 50, customerInformationTop + 75)
    .text(order.shippingAddress.name, 300, customerInformationTop + 75)
    .text(order.billingAddress.line1, 50, customerInformationTop + 90)
    .text(order.shippingAddress.line1, 300, customerInformationTop + 90)
    .text(
      `${order.billingAddress.cityTown || ""}, ${
        order.billingAddress.stateProvince || ""
      }, ${order.billingAddress.country}`,
      50,
      customerInformationTop + 105
    )
    .text(
      `${order.shippingAddress.cityTown || ""}, ${
        order.shippingAddress.stateProvince || ""
      }, ${order.shippingAddress.country}`,
      300,
      customerInformationTop + 105
    )
    .moveDown();

  generateHr(doc, customerInformationTop + CUSTOMER_INFORMATION_END);
}

function generateInvoiceTable(doc, order) {
  let i;
  const invoiceTableTop =
    CUSTOMER_INFORMATION_TOP + CUSTOMER_INFORMATION_END + 5; // Adjusted table position

  doc.font("NotoSans-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Product",
    "Title",
    "Qty",
    "Gross Amount(" + APP_CURRENCY + ")",
    "Discount(" + APP_CURRENCY + ")",
    "Taxable Value(" + APP_CURRENCY + ")",
    "Tax Amount(" + APP_CURRENCY + ")",
    "Total(" + APP_CURRENCY + ")"
  );
  generateHr(doc, invoiceTableTop + 25);
  doc.font("NotoSans");
  let position;
  for (i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    position = invoiceTableTop + (i + 1) * 30;
    const itemPrice = Number(item.item.price.value);
    const itemDiscount = item.item.discount
      ? Math.round(item.quantity * itemPrice * item.item.discount * 100) / 10000
      : 0;
    const taxableValue =
      Math.round(
        item.quantity * itemPrice * (1 - item.item.discount / 100) * 100
      ) / 100;
    const taxAmount =
      Math.round(
        item.quantity *
          itemPrice *
          (1 - item.item.discount / 100) *
          (item.item.tax / 100) *
          100
      ) / 100;
    const total = taxableValue + taxAmount;

    generateTableRow(
      doc,
      position,
      item.item.sku,
      item.item.name || "",
      item.quantity,
      formatCurrencyItem(itemPrice * item.quantity),
      formatCurrencyItem(itemDiscount),
      formatCurrencyItem(taxableValue),
      formatCurrencyItem(taxAmount),
      formatCurrencyItem(total)
    );

    // generateHr(doc, position + 20);
  }
  generateHr(doc, position + 30);

  const subtotalPosition = invoiceTableTop + (i + 1) * 30 + 10;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(order.subTotal)
  );

  // Add promotion before tax if exists
  let currentPosition = subtotalPosition + 20;
  if (order.promotion && order.promotion.value > 0) {
    generateTableRow(
      doc,
      currentPosition,
      "",
      "",
      "",
      "",
      "",
      "Promotion",
      "",
      order.promotion.isPercentage
        ? `${order.promotion.value}%`
        : formatCurrency(order.promotion.value)
    );
    currentPosition += 20;
  }

  // Calculate tax on subtotal minus promotion
  const taxAmount =
    order.promotion && order.promotion.value > 0
      ? order.promotion.isPercentage
        ? (order.subTotal * (1 - order.promotion.value / 100) * order.tax) / 100
        : ((order.subTotal - order.promotion.value) * order.tax) / 100
      : (order.subTotal * order.tax) / 100;

  // Add tax
  generateTableRow(
    doc,
    currentPosition,
    "",
    "",
    "",
    "",
    "",
    "Tax",
    "",
    formatCurrency(taxAmount)
  );
  currentPosition += 20;

  // Add delivery fee
  generateTableRow(
    doc,
    currentPosition,
    "",
    "",
    "",
    "",
    "",
    "Delivery Fee",
    "",
    order.deliveryFee > 0 ? formatCurrency(order.deliveryFee) : "Free"
  );
  currentPosition += 20;

  // Add grand total
  doc.font("NotoSans-Bold");
  generateTableRow(
    doc,
    currentPosition,
    "",
    "",
    "",
    "",
    "",
    "Grand Total",
    "",
    formatCurrency(order.orderValue)
  );
  doc.font("NotoSans");
}

function generateTableRow(
  doc,
  y,
  product,
  title,
  qty,
  grossAmount,
  discount,
  taxableValue,
  taxAmount,
  total
) {
  const colWidths = {
    product: 80, // Increased width for product
    title: 110, // Increased width for title
    qty: 30,
    grossAmount: 55,
    discount: 55,
    taxableValue: 55,
    taxAmount: 55,
    total: 55,
  };

  const maxLengths = {
    product: 50,
    title: 100,
  };

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "...";
    }
    return text;
  }

  const startX = 50;
  const columnSpacing = 10; // Added spacing between columns

  doc
    .fontSize(8)
    .text(truncateText(product, maxLengths.product), startX, y, {
      width: colWidths.product - columnSpacing,
      align: "left",
    })
    .text(
      truncateText(title, maxLengths.title),
      startX + colWidths.product,
      y,
      {
        width: colWidths.title - columnSpacing,
        align: "left",
      }
    )
    .text(qty, startX + colWidths.product + colWidths.title, y, {
      width: colWidths.qty,
      align: "center",
    })
    .text(
      grossAmount,
      startX + colWidths.product + colWidths.title + colWidths.qty,
      y,
      { width: colWidths.grossAmount, align: "right" }
    )
    .text(
      discount,
      startX +
        colWidths.product +
        colWidths.title +
        colWidths.qty +
        colWidths.grossAmount,
      y,
      { width: colWidths.discount, align: "right" }
    )
    .text(
      taxableValue,
      startX +
        colWidths.product +
        colWidths.title +
        colWidths.qty +
        colWidths.grossAmount +
        colWidths.discount,
      y,
      { width: colWidths.taxableValue, align: "right" }
    )
    .text(
      taxAmount,
      startX +
        colWidths.product +
        colWidths.title +
        colWidths.qty +
        colWidths.grossAmount +
        colWidths.discount +
        colWidths.taxableValue,
      y,
      { width: colWidths.taxAmount, align: "right" }
    )
    .text(
      total,
      startX +
        colWidths.product +
        colWidths.title +
        colWidths.qty +
        colWidths.grossAmount +
        colWidths.discount +
        colWidths.taxableValue +
        colWidths.taxAmount,
      y,
      { width: colWidths.total, align: "right" }
    );
}

function formatCurrencyItem(value) {
  return Number(value).toFixed(2);
}

function formatCurrency(value) {
  return APP_CURRENCY + Number(value).toFixed(2);
}

function generateFooter(doc) {
  const footerYPosition = 770; // Adjust this to place the footer at the bottom of the page

  doc.fontSize(10).text("Thank you for your business.", 50, footerYPosition, {
    align: "center",
    width: 500,
  });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = { generateInvoice };

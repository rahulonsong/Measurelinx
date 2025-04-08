if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const crypto = require("crypto");
const sharp = require("sharp");
const shortid = require("shortid");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3BucketRegion = process.env.S3_BUCKET_REGION;
const s3AccessKey = process.env.S3_ACCESS_KEY;
const s3SecretAccesskey = process.env.S3_SECRET_ACCESS_KEY;
const s3BucketNameInvoice = process.env.S3_BUCKET_NAME_INVOICE;
const s3BucketNameLabels = process.env.S3_BUCKET_NAME_LABELS;

const s3 = new S3Client({
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretAccesskey,
  },
  region: s3BucketRegion,
});

const uploadImg = async (file, context) => {
  const buffer = await sharp(file.buffer)
    .resize({
      fit: sharp.fit.contain,
      width: 1080,
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  const id = shortid.generate();
  const filename = `${id}_${Date.now()}_${file.originalname}`;

  let s3BucketName;
  switch (context) {
    case "item":
      s3BucketName = process.env.S3_BUCKET_NAME_ITEM;
      break;
    case "itemModel":
      s3BucketName = process.env.S3_BUCKET_NAME_ITEM;
      break;
    case "resource":
      s3BucketName = process.env.S3_BUCKET_NAME_ITEM;
      break;
    case "logo":
      s3BucketName = process.env.S3_BUCKET_NAME_ITEM;
      break;
    case "profilePic":
      s3BucketName = process.env.S3_BUCKET_NAME_ITEM;
      break;
    default:
      throw new Error("Invalid context provided for S3 upload");
  }

  const params = {
    Bucket: s3BucketName,
    Key: filename,
    Body: buffer,
    ContentType: file.mimetype,
    // No ACL parameter to ensure compatibility with Object Ownership settings
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  const getObjectParams = {
    Bucket: s3BucketName,
    Key: filename,
  };
  const getCommand = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

  file.path = url;
  file.filename = filename;
  return file;
};

// Upload function for PDFs
const uploadPDF = async (pdfData, filename) => {
  try {
    // Determine the appropriate bucket based on filename prefix
    let bucketName;

    // If the filename indicates it's a return label, use the labels bucket
    if (filename.startsWith("return-labels/")) {
      bucketName = s3BucketNameLabels;
      // console.log(`Using labels bucket for return label: ${bucketName}`);
    } else {
      bucketName = s3BucketNameInvoice;
      // console.log(`Using invoice bucket for document: ${bucketName}`);
    }

    // Ensure the bucket name is set
    if (!bucketName) {
      console.error(`Bucket name is undefined for file: ${filename}`);
      if (filename.startsWith("return-labels/")) {
        throw new Error("S3_BUCKET_NAME_LABELS is not configured");
      } else {
        throw new Error("S3_BUCKET_NAME_INVOICE is not configured");
      }
    }

    // console.log(`Uploading ${filename} to bucket: ${bucketName}`);
    // console.log(`File size: ${pdfData.length} bytes`);
    // console.log(`S3 Bucket Region: ${s3BucketRegion}`);
    // console.log(`AWS credentials used: ${s3AccessKey}`);

    // Create parameters for S3 upload - removed ACL parameter
    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: pdfData,
      ContentType: "application/pdf",
      // ACL parameter removed as bucket doesn't allow ACLs
    };

    // Create a new S3 client instance specifically for this upload
    // This ensures we're using fresh credentials for this specific operation
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretAccesskey,
      },
      region: s3BucketRegion,
    });

    const command = new PutObjectCommand(params);

    try {
      await s3Client.send(command);
      // console.log(`Successfully uploaded ${filename} to ${bucketName}`);
    } catch (uploadError) {
      console.error(`Error uploading to S3: ${uploadError.message}`);
      console.error(`Error details: ${JSON.stringify(uploadError)}`);
      throw uploadError;
    }

    // Construct the object URL based on bucket region and filename
    // This works if bucket has bucket owner enforced setting and public access
    const objectUrl = `https://${bucketName}.s3.${s3BucketRegion}.amazonaws.com/${filename}`;

    // For return labels, return the direct URL
    if (filename.startsWith("return-labels/")) {
      // console.log(`Generated URL for label: ${objectUrl}`);
      return objectUrl;
    }

    // For invoices, generate a signed URL for temporary access
    const getObjectParams = {
      Bucket: bucketName,
      Key: filename,
    };

    const getCommand = new GetObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 3600,
    });
    // console.log(`Generated signed URL: ${signedUrl}`);

    return signedUrl;
  } catch (error) {
    console.error(`Error in uploadPDF: ${error.message}`);
    throw error;
  }
};

// Retrieve S3 item URL
const getS3Item = async (
  key,
  s3BucketName = process.env.S3_BUCKET_NAME_ITEM
) => {
  try {
    // console.log(
    //   `Getting S3 item with key: ${key} from bucket: ${s3BucketName}`
    // );

    // Check if the key is a full URL, and if so, extract just the key portion
    let parsedKey = key;
    if (key.startsWith("http")) {
      try {
        // Extract just the path portion of the URL (the key)
        const url = new URL(key);
        const pathParts = url.pathname.split("/");

        // Remove the first empty element from the split
        if (pathParts[0] === "") {
          pathParts.shift();
        }

        // If the first part is the bucket name, remove it
        if (pathParts[0] === s3BucketName) {
          pathParts.shift();
        }

        // Join the remaining parts to get the key
        parsedKey = pathParts.join("/");
        // console.log(`Parsed key from URL: ${parsedKey}`);
      } catch (urlError) {
        console.error(`Error parsing URL ${key}:`, urlError);
        // Keep using the original key if URL parsing fails
      }
    }

    const getObjectParams = {
      Bucket: s3BucketName,
      Key: parsedKey,
    };
    // console.log(`S3 GetObject params: ${JSON.stringify(getObjectParams)}`);

    const getCommand = new GetObjectCommand(getObjectParams);

    const region = process.env.AWS_REGION || s3BucketRegion;
    let url;
    if (s3BucketName === process.env.S3_BUCKET_NAME_ITEM) {
      url = `https://${s3BucketName}.s3.${region}.amazonaws.com/${parsedKey}`;
    } else {
      url = await getSignedUrl(s3, getCommand, {
        expiresIn: parseInt(process.env.S3_EXPIRATION_PERIOD || "3600", 10),
      });
    }

    // console.log(`Generated S3 URL: ${url}`);
    return url;
  } catch (error) {
    console.error(`Error in getS3Item for key ${key}:`, error);
    throw error;
  }
};

// Delete S3 item
const deleteS3Item = async (key, s3BucketName) => {
  const deleteObjectParams = {
    Bucket: s3BucketName,
    Key: key,
  };

  const command = new DeleteObjectCommand(deleteObjectParams);
  await s3.send(command);
};

module.exports = { uploadImg, uploadPDF, getS3Item, deleteS3Item };

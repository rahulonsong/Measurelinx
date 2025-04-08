const { parse, join } = require("path");
// @ts-ignore
const { GraphQLUpload } = require("graphql-upload-minimal");

// const { User } = require("../../models/user");

const { getUserId } = require("../../utils/getUserId");

const shortid = require("shortid");
const { createWriteStream, mkdir } = require("fs");
// import our model
const { File } = require("../../models/file.js");

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  const path = `uploads/itemImages/${id}-${filename}`;
  const context = "item";
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ id, path, filename, mimetype, context }))
      .on("error", reject)
  );
};

// processing upload
const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};

const itemImageUploadResolver = {
  Upload: GraphQLUpload,
  Query: {
    itemImage: async (_parent, { itemImageId }, { req }, _info) => {
      const userId = getUserId(req);
      // Checking if user is authenticated
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        const itemImage = await File.findById(itemImageId);
        return itemImage._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    uploadItemImage: async (_parent, { file }, { req }, _info) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const upload = await processUpload(file);

      try {
        // Adding user to upload
        upload.user = userId;
        const result = await File.create(upload); // save our file to the mongodb
        return result;
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { itemImageUploadResolver };

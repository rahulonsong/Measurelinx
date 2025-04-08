// const { parse, join } = require("path");
// @ts-ignore
const { GraphQLUpload } = require("graphql-upload-minimal");

const { User } = require("../../models/user");

const { transformLogo } = require("./merge");

const { getUserId } = require("../../utils/getUserId");

const shortid = require("shortid");

const { createWriteStream, mkdir } = require("fs");
// import our model
const { File } = require("../../models/file.js");

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  const path = `uploads/logos/${id}-${filename}`;
  const context = "logo";
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

const logoUploadResolver = {
  Upload: GraphQLUpload,
  Query: {
    logo: async (_parent, { logoId }, { req }, _info) => {
      const userId = getUserId(req);
      // Checking if user is authenticated
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        const logo = await File.findById(logoId);
        return transformLogo(logo);
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    uploadLogo: async (_parent, { file }, { req }, _info) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // Upload files into MongoDbx
      // mkdir("uploads", { recursive: true }, (err) => {
      //   if (err) throw err;
      // });
      const upload = await processUpload(file);

      let createdLogo;

      try {
        // Adding user to upload
        upload.user = userId;
        const result = await File.create(upload); // save our file to the mongodb
        createdLogo = transformLogo(result);
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found!");
        }
        user.logo = result;
        await user.save();
        return createdLogo;
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { logoUploadResolver };

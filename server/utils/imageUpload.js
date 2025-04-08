const shortid = require("shortid");
const multer = require("multer");
var fs = require("fs");

exports.upload = (folderName) => {
  const id = shortid.generate();
  return (imageUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const path = `./uploads/${folderName}/`;
        if (!fs.existsSync(path)) {
          // CREATE DIRECTORY IF NOT FOUND
          fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path);
      },

      // By default, multer removes file extensions so let's add them back
      filename: function (req, file, cb) {
        cb(null, id + "_" + Date.now() + "_" + file.originalname);
      },
    }),
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
      if (
        !file.originalname.match(
          /\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/
        )
      ) {
        req.fileValidationError = "Only image files are allowed!";
        return cb(null, false);
      }
      cb(null, true);
    },
  }));
};

const { uploadImg } = require("../utils/s3Actions");

// import our model
const { File } = require("../models/file");

const uploadImage = async (req, res) => {
  req.file = await uploadImg(req.file, req.context);

  // Updating database
  let file = new File({
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    path: req.file.path,
    context: req.context,
    user: req.user,
  });
  await file.save();
  // console.log("req.file:", req.file);
  // Sending the image path to client
  res.send(req.file);
};

module.exports = { uploadImage };

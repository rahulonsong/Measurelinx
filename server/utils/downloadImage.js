const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadImage(url, imagePath) {
  const dir = path.dirname(imagePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const response = await axios({
    url,
    responseType: "arraybuffer",
  });
  fs.writeFileSync(imagePath, response.data);
  return imagePath;
}

module.exports = { downloadImage };

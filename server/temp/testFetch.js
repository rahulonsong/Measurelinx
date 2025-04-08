const axios = require("axios");

(async () => {
  try {
    const response = await axios.get(
      "https://use.fontawesome.com/releases/v5.0.13/css/all.css"
    );
    console.log("Successfully fetched:", response.data.substring(0, 100)); // Print first 100 characters
  } catch (error) {
    console.error("Error fetching URL:", error.message);
  }
})();

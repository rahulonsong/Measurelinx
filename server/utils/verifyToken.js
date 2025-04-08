const jwt = require("jsonwebtoken");
const { getUserId } = require("./getUserId");

// Verify Token Middleware
exports.verifyToken = (req, res, next) => {
  // console.log("verifyToken middleware called");
  // console.log("Headers:", JSON.stringify(req.headers));

  // Attempt to extract token directly for debugging
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log("Token extracted directly:", token);

    try {
      // Directly verify the token
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      // console.log("Token verified manually:", decoded);
    } catch (err) {
      console.error("Manual token verification failed:", err.message);
    }
  } else {
    console.log("No Authorization header with Bearer token found");
  }

  // Use getUserId utility to get the user ID
  const userId = getUserId(req);
  console.log("getUserId returned:", userId);

  if (userId) {
    // Attach the user ID to the request
    req.userId = userId;
    console.log("User authenticated, proceeding to next middleware");
    next(); // Proceed to the next middleware
  } else {
    // If no valid user ID is found, respond with forbidden status
    console.log("Authentication failed, returning 403");
    res.status(403).json({ error: "Authentication required" });
  }
};

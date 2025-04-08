const jwt = require("jsonwebtoken");

const getUserId = (request, requireAuth = true) => {
  try {
    let token;

    // Check for token in cookies
    if (request.cookies && request.cookies.papiloomToken) {
      token = request.cookies.papiloomToken;
      // console.log("🔹 Extracted Token from Cookies:", token);
    }

    // Check for token in Authorization header
    if (!token) {
      const header = request.req
        ? request.req.headers.authorization
        : request.headers
        ? request.headers.authorization
        : request.connection && request.connection.context
        ? request.connection.context.Authorization
        : null;

      if (header && header.startsWith("Bearer ")) {
        token = header.replace("Bearer ", "");
        // console.log("🔹 Extracted Token from Authorization Header:", token);
      }
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      return decoded.userId;
    }

    // Instead of throwing an error, return null when no token is found
    return null;
  } catch (error) {
    // Instead of throwing an error, return null for any error
    return null;
  }
};

module.exports = { getUserId };

const jwt = require("jsonwebtoken");
const { getUserId } = require("../../../utils/getUserId");

// Mock the jsonwebtoken module
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("getUserId Utility", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Set environment variable needed for the utility
    process.env.JWT_KEY = "test-jwt-key";
  });

  test("should extract userId from cookies", () => {
    // Setup
    const mockRequest = {
      cookies: {
        papiloomToken: "valid-token-from-cookie",
      },
    };

    jwt.verify.mockReturnValue({ userId: "user-from-cookie" });

    // Execute
    const userId = getUserId(mockRequest);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      "valid-token-from-cookie",
      "test-jwt-key"
    );
    expect(userId).toBe("user-from-cookie");
  });

  test("should extract userId from Authorization header (request.headers)", () => {
    // Setup
    const mockRequest = {
      cookies: {}, // Empty cookies
      headers: {
        authorization: "Bearer valid-token-from-header",
      },
    };

    jwt.verify.mockReturnValue({ userId: "user-from-header" });

    // Execute
    const userId = getUserId(mockRequest);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      "valid-token-from-header",
      "test-jwt-key"
    );
    expect(userId).toBe("user-from-header");
  });

  test("should extract userId from Authorization header (request.req.headers)", () => {
    // Setup
    const mockRequest = {
      cookies: {}, // Empty cookies
      req: {
        headers: {
          authorization: "Bearer valid-token-from-req",
        },
      },
    };

    jwt.verify.mockReturnValue({ userId: "user-from-req" });

    // Execute
    const userId = getUserId(mockRequest);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      "valid-token-from-req",
      "test-jwt-key"
    );
    expect(userId).toBe("user-from-req");
  });

  test("should extract userId from connection context (for subscriptions)", () => {
    // Setup
    const mockRequest = {
      cookies: {}, // Empty cookies
      connection: {
        context: {
          Authorization: "Bearer valid-token-from-connection",
        },
      },
    };

    jwt.verify.mockReturnValue({ userId: "user-from-connection" });

    // Execute
    const userId = getUserId(mockRequest);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      "valid-token-from-connection",
      "test-jwt-key"
    );
    expect(userId).toBe("user-from-connection");
  });

  test("should return null if no token is found", () => {
    // Setup
    const mockRequest = {
      cookies: {}, // Empty cookies
      headers: {}, // No authorization header
    };

    // Execute
    const userId = getUserId(mockRequest);

    // Assert
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(userId).toBeNull();
  });

  test("should return null if token verification fails", () => {
    // Setup
    const mockRequest = {
      cookies: {
        papiloomToken: "invalid-token",
      },
    };

    // Mock the verify function to throw an error
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Execute
    const userId = getUserId(mockRequest);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith("invalid-token", "test-jwt-key");
    expect(userId).toBeNull();
  });

  test("should prioritize token from cookies over header", () => {
    // Setup
    const mockRequest = {
      cookies: {
        papiloomToken: "token-from-cookie",
      },
      headers: {
        authorization: "Bearer token-from-header",
      },
    };

    jwt.verify.mockReturnValue({ userId: "user-from-cookie" });

    // Execute
    const userId = getUserId(mockRequest);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      "token-from-cookie",
      "test-jwt-key"
    );
    expect(userId).toBe("user-from-cookie");
  });

  test("should ignore non-Bearer authorization headers", () => {
    // Setup
    const mockRequest = {
      cookies: {}, // Empty cookies
      headers: {
        authorization: "Basic some-basic-auth",
      },
    };

    // Execute
    const userId = getUserId(mockRequest);

    // Assert
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(userId).toBeNull();
  });
});

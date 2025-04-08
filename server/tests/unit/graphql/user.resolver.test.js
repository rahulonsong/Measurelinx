const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock models and dependencies
jest.mock("../../../models/user", () => ({
  User: {
    findOne: jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    })),
    findById: jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    })),
    deleteMany: jest.fn().mockResolvedValue(),
    create: jest.fn(),
  },
}));

jest.mock("../../../models/order", () => ({
  Order: {
    countDocuments: jest.fn().mockResolvedValue(0),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
  },
}));

jest.mock("../../../models/userVerification", () => {
  const mockSave = jest.fn().mockResolvedValue(true);
  const mockDeleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
  const mockFindOne = jest.fn().mockResolvedValue(null);

  function MockUserVerification(data) {
    this.userId = data.userId;
    this.email = data.email;
    this.otp = data.otp;
    this.context = data.context;
    this.expiresAt = data.expiresAt;
    this.save = mockSave;
  }

  MockUserVerification.deleteMany = mockDeleteMany;
  MockUserVerification.findOne = mockFindOne;

  return {
    UserVerification: MockUserVerification,
    mockSave,
    mockDeleteMany,
    mockFindOne,
  };
});

jest.mock("../../../models/appEnv", () => ({
  AppEnv: {
    findOne: jest.fn().mockResolvedValue({
      _id: "appenv123",
      brandName: "Papiloom",
      supportEmail: "support@papiloom.com",
    }),
    find: jest.fn().mockReturnValue([
      {
        brandName: "Papiloom",
        supportEmail: "support@papiloom.com",
      },
    ]),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn().mockImplementation((password, hash) => {
    return Promise.resolve(password === "password123");
  }),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockJWTToken"),
}));

jest.mock("../../../utils/getUserId", () => ({
  getUserId: jest.fn(),
}));

// Mock other required functions
jest.mock("../../../graphql/resolvers/sendMail", () => ({
  sendMail: jest.fn().mockResolvedValue(true),
  saveOtpVerificationRecord: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../../graphql/resolvers/sendEmailVerification", () => ({
  sendEmailVerificationOtp: jest.fn().mockResolvedValue(true),
}));

// Mock transformUser function
jest.mock("../../../graphql/resolvers/merge", () => {
  return {
    transformUser: jest.fn().mockImplementation((user) => {
      return { ...user, transformed: true };
    }),
    transformAddress: jest.fn(),
  };
});

// Mock user data
const mockUser = {
  _id: "user123",
  id: "user123",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  password: "$2a$10$SomeHashedPasswordString",
  googleId: null,
  facebookId: null,
  verified: true,
  trial: { isActive: true },
  createdAt: new Date(),
  _doc: {
    _id: "user123",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    password: "$2a$10$SomeHashedPasswordString",
  },
};

const mockUserOAuth = {
  _id: "oauth123",
  id: "oauth123",
  email: "oauth@example.com",
  firstName: "OAuth",
  lastName: "User",
  password: "$2a$10$SomeHashedPasswordString",
  googleId: "google123",
  facebookId: null,
  verified: true,
  _doc: {
    _id: "oauth123",
    email: "oauth@example.com",
    firstName: "OAuth",
    lastName: "User",
    password: "$2a$10$SomeHashedPasswordString",
    googleId: "google123",
  },
};

const mockUserUnverified = {
  _id: "unverified123",
  id: "unverified123",
  email: "unverified@example.com",
  firstName: "Unverified",
  lastName: "User",
  password: "$2a$10$SomeHashedPasswordString",
  googleId: null,
  facebookId: null,
  verified: false,
  _doc: {
    _id: "unverified123",
    email: "unverified@example.com",
    firstName: "Unverified",
    lastName: "User",
    password: "$2a$10$SomeHashedPasswordString",
  },
};

// Mock sendWelcomeEmailWithVerification function
const sendWelcomeEmailMock = jest.fn().mockResolvedValue(true);

// Import the userResolver (note: import case needs to match exactly)
const { userResolver } = require("../../../graphql/resolvers/user");
const { getUserId } = require("../../../utils/getUserId");
const { User } = require("../../../models/user");
const {
  UserVerification,
  mockSave,
  mockDeleteMany,
  mockFindOne,
} = require("../../../models/userVerification");
const { Order } = require("../../../models/order");
const { AppEnv } = require("../../../models/appEnv");

describe("User Resolver Tests", () => {
  // Set up environment variables
  beforeAll(() => {
    process.env.JWT_KEY = "test-jwt-key";
    process.env.JWT_EXPIRATION = "1d";
    process.env.JWT_EXPIRATION_DAYS = "7";
    process.env.SALT_ROUNDS_OTP = "10";
    process.env.OTP_EXPIRY = "3600000"; // 1 hour in milliseconds
  });

  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock implementations
    mockDeleteMany.mockClear();
    mockFindOne.mockClear();
    mockSave.mockClear();

    // Setup User.findOne mock to return appropriate data with proper chaining
    User.findOne.mockImplementation((query) => {
      let result = null;

      if (query && query.email === "test@example.com") {
        result = mockUser;
      } else if (query && query.email === "oauth@example.com") {
        result = mockUserOAuth;
      } else if (query && query.email === "unverified@example.com") {
        result = mockUserUnverified;
      }

      return {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(result),
      };
    });

    // Setup User.findById mock with proper chaining
    User.findById.mockImplementation((id) => {
      let result = null;

      if (id === "user123" || id === "testUserId") {
        result = mockUser;
      }

      return {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(result),
      };
    });

    // Mock getUserData to return a user with _doc property
    userResolver.getUserData = jest
      .fn()
      .mockImplementation(({ userId, email }) => {
        if (userId === "testUserId" || userId === "user123") {
          return Promise.resolve({
            ...mockUser,
            numberOfOrderPages: 1,
          });
        } else if (email === "test@example.com") {
          return Promise.resolve({
            ...mockUser,
            numberOfOrderPages: 1,
          });
        } else if (email === "unverified@example.com") {
          return Promise.resolve({
            ...mockUserUnverified,
            numberOfOrderPages: 0,
          });
        } else if (email === "oauth@example.com") {
          return Promise.resolve({
            ...mockUserOAuth,
            numberOfOrderPages: 1,
          });
        }
        return Promise.resolve(null);
      });

    // Mock the welcome email function
    userResolver.sendWelcomeEmailWithVerification = sendWelcomeEmailMock;

    // Mock AppEnv.find for getAppEnv test
    AppEnv.find.mockReturnValue([
      {
        brandName: "Papiloom",
        supportEmail: "support@papiloom.com",
      },
    ]);
  });

  describe("login method", () => {
    const mockReq = {};
    const mockRes = {
      cookie: jest.fn(),
    };

    test("should throw error for non-existent user", async () => {
      // Mock User.findOne to return null for this test
      User.findOne.mockResolvedValueOnce(null);

      // Assert and Act
      await expect(
        userResolver.Query.login(
          null,
          { email: "nonexistent@example.com", password: "password123" },
          { req: mockReq, res: mockRes }
        )
      ).rejects.toThrow("User not found!");
    });

    test("should throw error for OAuth users trying password login", async () => {
      // Assert and Act
      await expect(
        userResolver.Query.login(
          null,
          { email: "oauth@example.com", password: "password123" },
          { req: mockReq, res: mockRes }
        )
      ).rejects.toThrow("Please log in using Google or Facebook.");
    });

    test("should send verification email for unverified users", async () => {
      const result = await userResolver.Query.login(
        null,
        { email: "unverified@example.com", password: "password123" },
        { req: mockReq, res: mockRes }
      );

      expect(sendWelcomeEmailMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );
      expect(result).toEqual({
        userId: "unverified123",
        message: "Please verify your email before logging in.",
      });
    });

    test("should return token and user data for valid login", async () => {
      const result = await userResolver.Query.login(
        null,
        { email: "test@example.com", password: "password123" },
        { req: mockReq, res: mockRes }
      );

      expect(mockRes.cookie).toHaveBeenCalled();
      expect(result).toHaveProperty("token", "mockJWTToken");
      expect(result).toHaveProperty("userId", "user123");
    });
  });

  describe("getCurrentUser query", () => {
    test("should throw error if user not authenticated", async () => {
      // Mock getUserId to return null
      getUserId.mockReturnValueOnce(null);

      await expect(
        userResolver.Query.getCurrentUser(null, {}, { req: {} }, null)
      ).rejects.toThrow("Unauthenticated!");
    });

    test("should return user data for authenticated users", async () => {
      // Mock getUserId to return a user ID
      getUserId.mockReturnValueOnce("testUserId");

      const result = await userResolver.Query.getCurrentUser(
        null,
        {},
        { req: { headers: { cookie: "auth=token" } } },
        null
      );

      expect(result).toEqual({
        _id: "user123",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      });
    });
  });

  describe("getAppEnv query", () => {
    test("should return application environment variables", async () => {
      // Mock AppEnv.find to return expected data
      AppEnv.find.mockReturnValueOnce([
        {
          brandName: "Papiloom",
          supportEmail: "support@papiloom.com",
        },
      ]);

      const result = await userResolver.Query.getAppEnv(null, {}, {}, null);

      expect(result).toEqual({
        brandName: "Papiloom",
        supportEmail: "support@papiloom.com",
      });
    });
  });
});

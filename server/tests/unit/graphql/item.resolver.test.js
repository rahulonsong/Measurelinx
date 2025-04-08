const mongoose = require("mongoose");

// Mock mongoose ObjectId
jest.mock("mongoose", () => {
  const originalModule = jest.requireActual("mongoose");
  return {
    ...originalModule,
    Types: {
      ObjectId: jest.fn().mockImplementation((id) => id),
    },
  };
});

// Mock dependencies
jest.mock("../../../models/item", () => ({
  Item: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("../../../models/category", () => ({
  Category: {
    find: jest.fn(),
  },
}));

jest.mock("../../../models/appEnv", () => ({
  AppEnv: {
    find: jest.fn().mockReturnValue([
      {
        currencySymbol: "$",
        baseUrl: "http://localhost:3000",
      },
    ]),
    findOne: jest.fn().mockResolvedValue({
      currencySymbol: "$",
      baseUrl: "http://localhost:3000",
    }),
  },
}));

jest.mock("../../../models/user", () => ({
  User: {
    findById: jest.fn(),
  },
}));

jest.mock("../../../utils/getUserId", () => ({
  getUserId: jest.fn(),
}));

jest.mock("../../../utils/s3Actions", () => ({
  deleteS3Item: jest.fn(),
}));

// Mock the merge functions
jest.mock("../../../graphql/resolvers/merge", () => ({
  transformItemMinimal: jest.fn((item, appEnv) => ({
    ...item,
    transformed: true,
    currencySymbol: appEnv ? appEnv.currencySymbol : "$",
  })),
  transformItem: jest.fn((item) => ({ ...item, transformed: true })),
  transformReview: jest.fn(),
}));

jest.mock("../../../graphql/resolvers/userSearch", () => ({
  getProjectedItemFields: jest.fn().mockReturnValue({}),
}));

// Import necessary modules after mocking
const { Item } = require("../../../models/item");
const { Category } = require("../../../models/category");
const { User } = require("../../../models/user");
const { getUserId } = require("../../../utils/getUserId");
const { itemResolver } = require("../../../graphql/resolvers/item");
const {
  transformItemMinimal,
  transformItem,
} = require("../../../graphql/resolvers/merge");

describe("Item Resolver Tests", () => {
  beforeAll(() => {
    // Set environment variables used in the resolver
    process.env.DEAL_ITEMS_LIMIT = "6";
    process.env.CATEGORY_ITEMS_LIMIT = "8";
    process.env.ITEMS_PER_PAGE = "10";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Query: getAllCategoryItems", () => {
    test("should return all items for a specific category", async () => {
      // Mock data
      const mockItems = [
        {
          _id: "item1",
          name: "Phone",
          price: 599,
          category: "Electronics",
          published: true,
          disabled: false,
          _doc: {
            _id: "item1",
            name: "Phone",
            price: 599,
            published: true,
            disabled: false,
          },
        },
        {
          _id: "item2",
          name: "Laptop",
          price: 999,
          category: "Electronics",
          published: true,
          disabled: false,
          _doc: {
            _id: "item2",
            name: "Laptop",
            price: 999,
            published: true,
            disabled: false,
          },
        },
      ];

      // Mock Item.find with sort chaining
      const mockSort = jest.fn().mockReturnValue(mockItems);
      Item.find.mockReturnValue({
        sort: mockSort,
      });

      // Mock transformItemMinimal to return the transformed items
      transformItemMinimal.mockImplementation((item) => ({
        ...item,
        transformed: true,
        currencySymbol: "$",
      }));

      // Execute the resolver
      const result = await itemResolver.Query.getAllCategoryItems(
        null,
        { itemCategoryInput: { itemCategoryName: "Electronics" } },
        { req: {} }
      );

      // Assertions
      expect(Item.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ discount: -1 });
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("transformed", true);
    });
  });

  describe("Query: singleItem", () => {
    test("should return a single item and update view count for logged in user", async () => {
      // Mock user ID
      getUserId.mockReturnValueOnce("user123");

      // Mock user
      const mockUser = {
        _id: "user123",
        viewedItems: [{ item: "item2", viewedDate: new Date() }],
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValue(mockUser);

      // Mock item
      const mockItem = {
        _id: "item1",
        name: "Product 1",
        price: 99.99,
        viewsCount: 10,
        published: true,
        disabled: false,
        reviews: [],
        save: jest.fn().mockResolvedValue(true),
        _doc: {
          _id: "item1",
          name: "Product 1",
          price: 99.99,
          published: true,
          disabled: false,
          reviews: [],
        },
      };

      // Mock Item.findById with chained populate methods
      const mockPopulate3 = jest.fn().mockReturnThis();
      const mockPopulate2 = jest.fn().mockReturnThis();
      const mockPopulate1 = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue(mockItem);

      Item.findById.mockReturnValue({
        populate: mockPopulate1,
      });

      mockPopulate1.mockReturnValue({
        populate: mockPopulate2,
      });

      mockPopulate2.mockReturnValue({
        populate: mockPopulate3,
      });

      mockPopulate3.mockReturnValue({
        exec: mockExec,
      });

      // Mock transformItem
      transformItem.mockImplementation((item) => ({
        ...item,
        transformed: true,
      }));

      // Execute the resolver
      const result = await itemResolver.Query.singleItem(
        null,
        { itemId: "item1" },
        { req: {} }
      );

      // Assertions
      expect(Item.findById).toHaveBeenCalledWith("item1");
      expect(mockItem.save).toHaveBeenCalled();
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    test("should throw error if item not found", async () => {
      // Mock user ID
      getUserId.mockReturnValueOnce("user123");

      // Mock user
      const mockUser = {
        _id: "user123",
        viewedItems: [],
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValue(mockUser);

      // Mock Item.findById to return null
      const mockPopulate3 = jest.fn().mockReturnThis();
      const mockPopulate2 = jest.fn().mockReturnThis();
      const mockPopulate1 = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue(null);

      Item.findById.mockReturnValue({
        populate: mockPopulate1,
      });

      mockPopulate1.mockReturnValue({
        populate: mockPopulate2,
      });

      mockPopulate2.mockReturnValue({
        populate: mockPopulate3,
      });

      mockPopulate3.mockReturnValue({
        exec: mockExec,
      });

      // Assert and Act
      await expect(
        itemResolver.Query.singleItem(
          null,
          { itemId: "nonexistent" },
          { req: {} }
        )
      ).rejects.toThrow("Invalid item!");
    });
  });
});

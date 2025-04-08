const { Item } = require("../../models/item.js");
const { Review } = require("../../models/review.js");
const {
  transformReview,
  transformReviewForUser,
} = require("../resolvers/merge");

// const { TagList } = require("../../models/tagList");

const { User } = require("../../models/user");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const reviewResolver = {
  Query: {
    reviewsByUser: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        // Filtering out disabled reviews
        const reviews = await Review.find({
          user: userId,
        })
          .populate({
            path: "item",
          })
          .populate({
            path: "rating",
          })
          .exec();
        let transformedReviews = [
          ...reviews.map((review) => {
            return transformReviewForUser(review, userId);
          }),
        ];
        // console.log("Reviews by User:", transformedReviews);
        return transformedReviews;
      } catch (error) {
        throw error;
      }
    },
    reviewsByItem: async (_parent, { itemId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        // Filtering out disabled reviews
        const reviews = await Review.find({
          item: itemId,
        })
          .populate({ path: "user" })
          .exec();
        return reviews.map((review) => {
          return transformReview(review);
        });
      } catch (error) {
        throw error;
      }
    },
    singleReview: async (_parent, { reviewId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        const review = await Review.findById(reviewId)
          .populate({ path: "user" })
          .exec();
        if (!review) {
          throw new Error("Invalid Review!");
        }
        return transformReview(review);
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Review
    addReviewData: async (_parent, { reviewInput }, { req }, _info) => {
      const userId = getUserId(req);

      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // creating review in database
      let user;
      try {
        user = await User.findById(userId)
          .populate({
            path: "defaultAddress",
          })
          .exec();
      } catch (error) {
        throw error;
      }
      let country = user.defaultAddress ? user.defaultAddress.country : "";

      // Check if rating exists for the user and item
      const existingReviews = await Review.find({
        user: userId,
        item: reviewInput.item,
      });
      // console.log("ext rating:", existingRatings);
      if (existingReviews.length) {
        if (existingReviews[0].user.valueOf() !== userId) {
          throw new Error("Unautherized!");
        }
        // Updating review
        updates = {};
        if (reviewInput !== undefined) {
          updates.rating = reviewInput.rating;
          updates.caption = reviewInput.caption;
          updates.nickName = reviewInput.nickName;
          updates.text = reviewInput.text;
          updates.country = reviewInput.ckountry;
          updates.item = reviewInput.item;
          updates.user = userId;
        }

        try {
          const review = await Review.findByIdAndUpdate(
            existingReviews[0]._id,
            {
              $set: updates,
            },
            { new: true }
          );
          return review._doc;
        } catch (error) {
          throw error;
        }
      }

      const review = new Review({
        nickName: reviewInput.nickName,
        rating: reviewInput.rating,
        caption: reviewInput.caption,
        text: reviewInput.text,
        country: country,
        item: reviewInput.item,
        foundHelpful: [],
        user: userId,
      });
      let result;
      try {
        result = await review.save();
        // console.log("result:", result);
      } catch (error) {
        throw error;
      }
      // Updating item with the review info
      const itemId = reviewInput.item;
      let item = await Item.findById(itemId);
      item.reviews.push(result._id);
      await item.save();
      // Updating user with the review info
      user.reviews.push(result._id);
      await user.save();

      result = await Review.findById(result.id)
        .populate({ path: "user" })
        .populate({ path: "rating" })
        .exec();
      return transformReview(result, userId);
    },
    //updating review
    updateReviewData: async (
      _parent,
      { reviewId, reviewInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // Checking if user is authorized
      try {
        let review = await Review.findById(reviewId)
          .populate({
            path: "user",
          })
          .exec();
        // Checking if the user is the owner of this alpha Resource
        if (review.user._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
      } catch (error) {
        throw error;
      }
      // Updating review
      updates = {};
      if (reviewInput !== undefined) {
        updates.rating = reviewInput.rating;
        updates.caption = reviewInput.caption;
        updates.nickName = reviewInput.nickName;
        updates.text = reviewInput.text;
        updates.country = reviewInput.ckountry;
        updates.item = reviewInput.item;
        updates.user = userId;
      }

      try {
        const review = await Review.findByIdAndUpdate(
          reviewId,
          {
            $set: updates,
          },
          { new: true }
        )
          .populate({ path: "user" })
          .populate({
            path: "rating",
          })
          .exec();
        return transformReview(review, userId);
      } catch (error) {
        throw error;
      }
    },
    // Incrementing Found Helpful
    incrementFoundHelpful: async (_parent, { reviewId }, { req }, _info) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        let review = await Review.findById(reviewId)
          .populate({
            path: "user",
          })
          .exec();
        review.foundHelpful.push(userId);
        await review.save();
        return {
          message: `Review found helpful incremented!`,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { reviewResolver };

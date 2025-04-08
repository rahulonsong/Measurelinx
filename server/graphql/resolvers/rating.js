const { Item } = require("../../models/item.js");
const { Rating } = require("../../models/rating.js");

// const { TagList } = require("../../models/tagList");

const { User } = require("../../models/user");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const ratingResolver = {
  Query: {
    ratingsByUser: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        // Filtering out disabled ratings
        const ratings = await Rating.find({
          user: userId,
        });
        return ratings.map((rating) => rating._doc);
      } catch (error) {
        throw error;
      }
    },
    ratingsByItem: async (_parent, { itemId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        // Filtering out disabled ratings
        const ratings = await Rating.find({
          item: itemId,
        });
        return ratings.map((rating) => rating._doc);
      } catch (error) {
        throw error;
      }
    },
    singleRating: async (_parent, { ratingId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        const rating = await Rating.findById(ratingId);
        if (!rating) {
          throw new Error("Invalid Rating!");
        }
        return rating._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Rating
    addRatingData: async (_parent, { ratingInput }, { req }, _info) => {
      const userId = getUserId(req);

      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // Check if rating exists for the user and item
      const existingRatings = await Rating.find({
        user: userId,
        item: ratingInput.item,
      });
      // console.log("ext rating:", existingRatings);
      if (existingRatings.length) {
        if (existingRatings[0].user.valueOf() !== userId) {
          throw new Error("Unautherized!");
        }
        try {
          let item = await Item.findById(existingRatings[0].item.valueOf());
          // console.log("item:", item);
          if (existingRatings[0].value !== ratingInput.value) {
            // decrementing old rate Count
            switch (existingRatings[0].value) {
              case 1:
                item.rating.rateCount1--;
                break;
              case 2:
                item.rating.rateCount2--;
                break;
              case 3:
                item.rating.rateCount3--;
                break;
              case 4:
                item.rating.rateCount4--;
                break;
              case 5:
                item.rating.rateCount5--;
                break;

              default:
                break;
            }

            // incrementing new rate Count
            switch (ratingInput.value) {
              case 1:
                item.rating.rateCount1++;
                break;
              case 2:
                item.rating.rateCount2++;
                break;
              case 3:
                item.rating.rateCount3++;
                break;
              case 4:
                item.rating.rateCount4++;
                break;
              case 5:
                item.rating.rateCount5++;
                break;

              default:
                break;
            }
          }
          item.rating.rateAvg =
            (item.rating.rateAvg * item.rating.rateCount -
              existingRatings[0].value +
              ratingInput.value) /
            item.rating.rateCount;
          await item.save();
        } catch (error) {
          throw error;
        }
        // Updating rating
        updates = {};
        if (ratingInput !== undefined) {
          updates.value = ratingInput.value;
          updates.item = ratingInput.item;
        }

        try {
          const rating = await Rating.findByIdAndUpdate(
            existingRatings[0]._id,
            {
              $set: updates,
            },
            { new: true }
          );
          return rating._doc;
        } catch (error) {
          throw error;
        }
      }
      // creating rating in database
      const rating = new Rating({
        value: ratingInput.value,
        item: ratingInput.item,
        user: userId,
      });
      let result;
      try {
        result = await rating.save();
        // console.log("result:", result);
      } catch (error) {
        throw error;
      }
      // Updating item with the rating info
      const itemId = ratingInput.item;
      let item = await Item.findById(itemId);
      if (!item.rating.rateAvg) item.rating.rateAvg = 0;
      if (!item.rating.rateCount) item.rating.rateCount = 0;
      if (!item.rating.rateCount1) item.rating.rateCount1 = 0;
      if (!item.rating.rateCount2) item.rating.rateCount2 = 0;
      if (!item.rating.rateCount34) item.rating.rateCount3 = 0;
      if (!item.rating.rateCount4) item.rating.rateCount4 = 0;
      if (!item.rating.rateCount5) item.rating.rateCount5 = 0;

      // Incrementing ratging count based on value
      switch (ratingInput.value) {
        case 1:
          item.rating.rateCount1++;
          break;
        case 2:
          item.rating.rateCount2++;
          break;
        case 3:
          item.rating.rateCount3++;
          break;
        case 4:
          item.rating.rateCount4++;
          break;
        case 5:
          item.rating.rateCount5++;
          break;

        default:
          break;
      }
      // console.log("rating:", item.rating);
      item.rating.rateAvg =
        (parseFloat(item.rating.rateAvg) * item.rating.rateCount +
          parseInt(ratingInput.value)) /
        (item.rating.rateCount + 1);
      item.rating.rateCount++;
      // Pushing rating to item
      item.rating.ratings.push(result._id);
      await item.save();

      // Updating user with the rating info
      let user = await User.findById(userId);
      user.ratings.push(result._id);
      await user.save();
      // returning rating
      return result._doc;
    },
    //updating rating
    updateRatingData: async (
      _parent,
      { ratingId, ratingInput },
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
        let rating = await Rating.findById(ratingId)
          .populate({
            path: "user",
          })
          .exec();
        // Checking if the user is the owner of this alpha Resource
        if (rating.user._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
      } catch (error) {
        throw error;
      }
      // Existing rating info

      let existingRating = await Rating.findById(ratingId);
      if (!existingRating) throw new Error("Invalid rating!");
      // Checking authorizayion
      if (existingRating.user.valueOf() !== userId) {
        throw new Error("Unautherized!");
      }
      // Updating item with the rating info
      const itemId = ratingInput.item;

      try {
        let item = await Item.findById(itemId);
        if (existingRating.value !== ratingInput.value) {
          // decrementing old rate Count
          switch (existingRating.value) {
            case 1:
              item.rating.rateCount1--;
              break;
            case 2:
              item.rating.rateCount2--;
              break;
            case 3:
              item.rating.rateCount3--;
              break;
            case 4:
              item.rating.rateCount4--;
              break;
            case 5:
              item.rating.rateCount5--;
              break;

            default:
              break;
          }

          // incrementing new rate Count
          switch (ratingInput.value) {
            case 1:
              item.rating.rateCount1++;
              break;
            case 2:
              item.rating.rateCount2++;
              break;
            case 3:
              item.rating.rateCount3++;
              break;
            case 4:
              item.rating.rateCount4++;
              break;
            case 5:
              item.rating.rateCount5++;
              break;

            default:
              break;
          }
        }
        item.rating.rateAvg =
          (item.rating.rateAvg * item.rating.rateCount -
            existingRating.value +
            ratingInput.value) /
          item.rating.rateCount;
        await item.save();
      } catch (error) {
        throw error;
      }
      // Updating rating
      updates = {};
      if (ratingInput !== undefined) {
        updates.value = ratingInput.value;
        updates.item = ratingInput.item;
      }

      try {
        const rating = await Rating.findByIdAndUpdate(
          ratingId,
          {
            $set: updates,
          },
          { new: true }
        );
        return rating._doc;
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { ratingResolver };

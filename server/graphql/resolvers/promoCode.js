const { PromoCode } = require("../../models/promoCode.js");
// const { TagList } = require("../../models/tagList");

const { User } = require("../../models/user");

// const shortid = require("shortid");

const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const promoCodeResolver = {
  Query: {
    promoCodes: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Filtering out user specific promoCodes
        const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
        return promoCodes.map((code) => code._doc);
      } catch (error) {
        throw error;
      }
    },
    singlePromoCode: async (_parent, { promoCodeId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Finding promoCode by ID
        const promoCode = await PromoCode.findById(promoCodeId);
        if (!promoCode) {
          throw new Error("Promo code not found!");
        }

        return promoCode._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    checkPromoCodeData: async (
      _parent,
      { checkPromoCodeInput },
      { req },
      _info
    ) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Find promo code object based on input promoCode
        const promoCode = await PromoCode.findOne({
          code: checkPromoCodeInput.promoCode.toUpperCase(),
        });
        if (!promoCode) {
          throw new Error("Invalid promo code!");
        }

        // Check if promo code has expired
        const today = new Date();
        const validFrom = new Date(promoCode.validFrom);
        const validTo = new Date(promoCode.validTo);
        if (today < validFrom || today > validTo) {
          throw new Error("Promo code has expired!");
        }

        // Check if promo code has been maxed out
        if (
          promoCode.maxRedemptions &&
          promoCode.redeemed >= promoCode.maxRedemptions
        ) {
          throw new Error("Promo code has reached max redemptions!");
        }

        return {
          valid: true,
          discountType: promoCode.discountType,
          discountValue: promoCode.discountValue,
        };
      } catch (error) {
        throw error;
      }
    },
    addPromoCodeData: async (_parent, { promoCodeInput }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Creating a new promoCode
        const promoCode = new PromoCode({
          ...promoCodeInput,
          createdAt: new Date().toISOString(),
        });

        // Saving the promoCode to the database
        const result = await promoCode.save();

        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    updatePromoCodeData: async (
      _parent,
      { promoCodeId, promoCodeInput },
      { req },
      _info
    ) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Fetching the promoCode to be updated
        const promoCode = await PromoCode.findById(promoCodeId);
        if (!promoCode) {
          throw new Error("Promo code not found!");
        }

        // Updating the promoCode with new data
        promoCode.code = promoCodeInput.code;
        promoCode.discountType = promoCodeInput.discountType;
        promoCode.discountValue = promoCodeInput.discountValue;
        promoCode.validFrom = promoCodeInput.validFrom;
        promoCode.validTo = promoCodeInput.validTo;
        promoCode.maxRedemptions = promoCodeInput.maxRedemptions;

        // Saving the updated promoCode to the database
        const result = await promoCode.save();

        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    deletePromoCodeData: async (_parent, { promoCodeId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Deleting the promoCode
        await PromoCode.findByIdAndDelete(promoCodeId);

        return { message: "Promo code deleted successfully!" };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { promoCodeResolver };

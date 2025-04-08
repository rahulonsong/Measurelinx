const { Organization } = require("../../models/organization");
const { File } = require("../../models/file");
const { User } = require("../../models/user");
const { AppEnv } = require("../../models/appEnv.js");
const { getS3Item } = require("../../utils/s3Actions");

// const { dateToString } = require("../../helpers/date");

const transformUser = async (user, appEnv) => {
  try {
    // Getting app env
    let dealName = "";
    let siteWideDiscount = 0;
    if (appEnv && Date.now() > appEnv._doc.dealExpiry) {
      dealName = appEnv._doc.dealName;
    } else {
      dealName = "Sale";
    }
    if (
      appEnv &&
      Date.now() > appEnv._doc.dealExpiry &&
      appEnv._doc.siteWideDiscount > 0
    ) {
      siteWideDiscount = appEnv._doc.siteWideDiscount;
    }
    // Tranforming organization
    if (user.organization) {
      user.organization = Object.assign(
        {},
        {
          _id: user.organization._id,
          organizationName: user.organization.organizationName,
        }
      );
    }
    // Tranforming logo
    if (user.logo) {
      user.logo = Object.assign(
        {},
        {
          _id: user.logo._id,
          path: user.logo.path,
          filename: user.logo.filename,
        }
      );
    }
    // Tranforming Addresses
    if (user.defaultAddress) {
      user.defaultAddress = Object.assign(
        {},
        {
          _id: user.defaultAddress._id,
          category: user.defaultAddress.category || "default",
          addresseeFirst: user.defaultAddress.addresseeFirst || "",
          addresseeLast: user.defaultAddress.addresseeLast || "",
          line1: user.defaultAddress.line1 || "",
          line2: user.defaultAddress.line2 || "",
          landmark: user.defaultAddress.landmark || "",
          stateProvince: user.defaultAddress.stateProvince || "",
          cityTown: user.defaultAddress.cityTown || "",
          country: user.defaultAddress.country || "",
          postalCode: user.defaultAddress.postalCode || "",
          phoneNumber: user.defaultAddress.phoneNumber || "",
        }
      );
    }
    // Tranforming Addresses
    if (user.addresses && user.addresses.length) {
      user.addresses = [
        ...user.addresses.map((el) => {
          return {
            _id: el._id,
            category: el.category || "default",
            addresseeFirst: el.addresseeFirst || "",
            addresseeLast: el.addresseeLast || "",
            line1: el.line1 || "",
            line2: el.line2 || "",
            landmark: el.landmark || "",
            stateProvince: el.stateProvince || "",
            cityTown: el.cityTown || "",
            country: el.country || "",
            postalCode: el.postalCode || "",
            phoneNumber: el.phoneNumber || "",
          };
        }),
      ];
    }
    // Transforming payment methods
    if (user.paymentMethods.length) {
      user.paymentMethods = [
        ...user.paymentMethods.map((el) => {
          return {
            _id: el._id,
            name: el.name,
            cardNumber: el.cardNumber,
            expirationMonth: el.expirationMonth,
            expirationYear: el.expirationYear,
            defaultCard: el.defaultCard,
          };
        }),
      ];
    }
    // Transforming Orders
    // Ensure orders are populated
    if (user.orders && Array.isArray(user.orders) && user.orders.length) {
      try {
        user.orders = await Promise.all(
          user.orders.map(async (el) => {
            try {
              // Ensure el.items is not null or undefined
              if (!el || !el.items || !Array.isArray(el.items)) {
                return null;
              }

              const items = await Promise.all(
                el.items.map(async (elItem) => {
                  try {
                    // setting defaultImage
                    let defaultImage = "";
                    if (
                      elItem.item &&
                      elItem.item.images &&
                      Array.isArray(elItem.item.images) &&
                      elItem.item.images.length
                    ) {
                      try {
                        const s3Item = await getS3Item(
                          elItem.item.images[0].filename,
                          process.env.S3_BUCKET_NAME_ITEM
                        );
                        defaultImage = s3Item;
                      } catch (imageError) {
                        console.error(
                          "Error fetching S3 item image:",
                          imageError
                        );
                      }
                    }
                    return {
                      item: {
                        _id: elItem.item._id,
                        name: elItem.item.name || "",
                        category: elItem.item.category || "",
                        defaultImage: defaultImage,
                        price: elItem.item.price || {
                          value: 0,
                          currency: "CAD",
                        },
                        stock: elItem.item.stock || 0,
                        tax: elItem.item.tax || 0,
                        routeParam: elItem.item.routeParam || "",
                        discount:
                          elItem.item.discount > 0 &&
                          elItem.item.discount > siteWideDiscount
                            ? elItem.item.discount
                            : siteWideDiscount,
                        dealName: elItem.item.discount > 0 ? dealName : "",
                      },
                      quantity: elItem.quantity || 1,
                    };
                  } catch (itemError) {
                    console.error("Error processing order item:", itemError);
                    return {
                      item: {
                        _id: elItem.item?._id || null,
                        name: "Error loading item",
                        category: "",
                        defaultImage: "",
                        price: { value: 0, currency: "CAD" },
                        stock: 0,
                        tax: 0,
                        routeParam: "",
                        discount: 0,
                        dealName: "",
                      },
                      quantity: 1,
                    };
                  }
                })
              );

              return {
                _id: el._id,
                orderNumber: el.orderNumber || "",
                transactionId: el.transactionId || "",
                deliveryEstimate: el.deliveryEstimate || "",
                items: items,
                subTotal: el.subTotal || 0,
                promotion: el.promotion || 0,
                billingAddress: el.billingAddress
                  ? {
                      _id: el.billingAddress._id,
                      addresseeFirst: el.billingAddress.addresseeFirst || "",
                      addresseeLast: el.billingAddress.addresseeLast || "",
                      line1: el.billingAddress.line1 || "",
                      line2: el.billingAddress.line2 || "",
                      landmark: el.billingAddress.landmark || "",
                      stateProvince: el.billingAddress.stateProvince || "",
                      cityTown: el.billingAddress.cityTown || "",
                      country: el.billingAddress.country || "",
                      postalCode: el.billingAddress.postalCode || "",
                      phoneNumber: el.billingAddress.phoneNumber || "",
                    }
                  : null,
                paymentMethod: el.paymentMethod || null,
                shippingAddress: el.shippingAddress
                  ? {
                      _id: el.shippingAddress._id,
                      addresseeFirst: el.shippingAddress.addresseeFirst || "",
                      addresseeLast: el.shippingAddress.addresseeLast || "",
                      line1: el.shippingAddress.line1 || "",
                      line2: el.shippingAddress.line2 || "",
                      landmark: el.shippingAddress.landmark || "",
                      stateProvince: el.shippingAddress.stateProvince || "",
                      cityTown: el.shippingAddress.cityTown || "",
                      country: el.shippingAddress.country || "",
                      postalCode: el.shippingAddress.postalCode || "",
                      phoneNumber: el.shippingAddress.phoneNumber || "",
                    }
                  : null,
                tax: el.tax || 0,
                orderValue: el.orderValue || 0,
                orderDate: el.orderDate || new Date().toISOString(),
                orderCurrency: el.orderCurrency || "CAD",
                orderStatus: el.orderStatus || "pending",
                orderComplete: el.orderComplete || false,
                canceled: el.canceled || false,
              };
            } catch (orderError) {
              console.error("Error processing order:", orderError);
              return null;
            }
          })
        );

        // Filter out any null values that might have resulted from the null checks
        user.orders = user.orders.filter((order) => order !== null);
      } catch (ordersError) {
        console.error("Error processing orders array:", ordersError);
        user.orders = []; // Set to empty array on error
      }
    } else {
      user.orders = []; // Ensure orders is always an array
    }

    // Create default empty address object
    const createEmptyAddress = () => ({
      _id: null,
      addresseeFirst: "",
      addresseeLast: "",
      line1: "",
      line2: "",
      landmark: "",
      stateProvince: "",
      cityTown: "",
      country: "",
      postalCode: "",
      phoneNumber: {
        category: "",
        countryCode: "",
        areaCode: "",
        localNumber: "",
        mobileNumber: "",
      },
    });

    // Transform orders and ensure addresses exist
    if (user.orders && user.orders.length) {
      user.orders = user.orders.map((order) => {
        const orderObj = order.toObject ? order.toObject() : order;
        return {
          ...orderObj,
          billingAddress: orderObj.billingAddress || createEmptyAddress(),
          shippingAddress: orderObj.shippingAddress || createEmptyAddress(),
        };
      });
    }

    if (user.ratings.length) {
      // filtering out orders for which payment is pending
      // user.orders = [
      //   ...user.orders.filter((order) => order.orderStatus !== "pendingPayment"),
      // ];
      // Transforming ratings
      user.ratings = [
        ...user.ratings.map((el) => {
          return {
            _id: el._id,
            item: el.item,
          };
        }),
      ];
    }
    // Transforming review
    if (user.reviews.length) {
      user.reviews = [
        ...user.reviews.map((el) => {
          return {
            _id: el._id,
            item: el.item,
          };
        }),
      ];
    }
    //  Transforming item arrays
    // Saved items
    if (user.savedItems.length) {
      user.savedItems = [
        ...user.savedItems.map((el) => {
          return {
            _id: el._id,
            name: el.name,
            defaultImage: el.defaultImage,
            price: el.price,
            tax: el.tax,
            stock: {
              runningLow: el.item.stock < el.item.maximumOrderQuantity * 2,
              outOfStock: el.item.stock <= 3,
              quantity: el.item.stock,
            },
            discount:
              el.discount > 0 && el.discount > siteWideDiscount
                ? el.discount
                : siteWideDiscount,
            dealName: el.discount > 0 ? dealName : "",
            routeParam: el.routeParam,
            category: el.category,
            rating: el.rating,
          };
        }),
      ];
    }
    // Favorites
    if (user.favorites.length) {
      user.favorites = [
        ...user.favorites.map(async (el) => {
          // setting defaultImage
          let defaultImage = "";
          if (el.images && el.images.length) {
            defaultImage = await getS3Item(
              el.images[0].filename,
              process.env.S3_BUCKET_NAME_ITEM
            );
          }
          return {
            _id: el._id,
            name: el.name,
            defaultImage: defaultImage,
            price: el.price,
            tax: el.tax,
            stock: {
              runningLow: el.stock < el.maximumOrderQuantity * 2,
              outOfStock: el.stock <= 3,
              quantity: el.stock,
            },
            discount:
              el.discount > 0 && el.discount > siteWideDiscount
                ? el.discount
                : siteWideDiscount,
            dealName: el.discount > 0 ? dealName : "",
            routeParam: el.routeParam,
            category: el.category,
            rating: el.rating,
          };
        }),
      ];
    }
    // Wishlist
    if (user.wishList.length) {
      user.wishList = [
        ...user.wishList.map(async (el) => {
          // setting defaultImage
          let defaultImage = "";
          if (el.images && el.images.length) {
            defaultImage = await getS3Item(
              el.images[0].filename,
              process.env.S3_BUCKET_NAME_ITEM
            );
          }
          return {
            _id: el._id,
            name: el.name,
            defaultImage: defaultImage,
            price: el.price,
            tax: el.tax,
            stock: {
              runningLow: el.stock < el.maximumOrderQuantity * 2,
              outOfStock: el.stock <= 3,
              quantity: el.stock,
            },
            discount:
              el.discount > 0 && el.discount > siteWideDiscount
                ? el.discount
                : siteWideDiscount,
            dealName: el.discount > 0 ? dealName : "",
            routeParam: el.routeParam,
            category: el.category,
            rating: el.rating,
          };
        }),
      ];
    }
    // Vieweditems (Last 10 items)
    if (user.viewedItems.length) {
      user.viewedItems = await Promise.all(
        user.viewedItems.map(async (el) => {
          // Ensure el.item is not null
          if (!el.item) {
            return null;
          }

          // setting defaultImage
          let defaultImage = "";
          if (el.item.images && el.item.images.length) {
            defaultImage = await getS3Item(
              el.item.images[0].filename,
              process.env.S3_BUCKET_NAME_ITEM
            );
          }
          return {
            viewedDate: el.viewedDate,
            item: {
              _id: el.item._id,
              name: el.item.name,
              defaultImage: defaultImage,
              price: el.item.price,
              tax: el.item.tax,
              stock: {
                runningLow: el.item.stock < el.item.maximumOrderQuantity * 2,
                outOfStock: el.item.stock <= 3,
                quantity: el.item.stock,
              },
              discount:
                el.item.discount > 0 && el.item.discount > siteWideDiscount
                  ? el.item.discount
                  : siteWideDiscount,
              dealName: el.item.discount > 0 ? dealName : "",
              routeParam: el.item.routeParam,
              category: el.item.category,
              rating: el.item.rating,
            },
          };
        })
      );

      // Filter out any null values that might have resulted from the null checks
      user.viewedItems = user.viewedItems.filter((item) => item !== null);
    }

    if (user.viewedItems.length > process.env.VIEWED_ITEMS_COUNT) {
      user.viewedItems = [
        ...user.viewedItems.slice(
          user.viewedItems.length - (process.env.VIEWED_ITEMS_COUNT + 1),
          process.env.VIEWED_ITEMS_COUNT
        ),
      ];
    }
    // Orderd items (Last 10 items)
    if (user.orderedItems.length) {
      user.orderedItems = [
        ...user.orderedItems.map((el) => {
          return {
            orderDate: el.orderDate,
            item: {
              _id: el.item._id,
              name: el.item.name,
              defaultImage: el.item.defaultImage,
              price: el.item.price,
              tax: el.item.tax,
              stock: {
                runningLow: el.item.stock < el.item.maximumOrderQuantity * 2,
                outOfStock: el.item.stock <= 3,
                quantity: el.item.stock,
              },
              discount:
                el.item.discount > 0 && el.item.discount > siteWideDiscount
                  ? el.item.discount
                  : siteWideDiscount,
              dealName: el.item.discount > 0 ? dealName : "",
              routeParam: el.item.routeParam,
              category: el.item.category,
              rating: el.item.rating,
            },
          };
        }),
      ];
    }
    if (user.orderedItems.lengthk > process.env.ORDERED_ITEMS_COUNT) {
      user.orderedItems = [
        ...user.orderedItems.slice(
          user.orderedItems.length - (process.env.ORDERED_ITEMS_COUNT + 1),
          process.env.ORDERED_ITEMS_COUNT
        ),
      ];
    }
    // Transforming Cart (Ensuring it's always JSON)
    if (user.cart) {
      user.cart = user.cart.toObject ? user.cart.toObject() : user.cart; // Convert if still a Mongoose document
    }

    if (user.cart.items && user.cart.items.length) {
      user.cart.items = await Promise.all(
        user.cart.items.map(async (el) => {
          // setting defaultImage
          let defaultImage = "";
          if (el.item.images && el.item.images.length) {
            const s3Item = await getS3Item(
              el.item.images[0].filename,
              process.env.S3_BUCKET_NAME_ITEM
            );
            defaultImage = s3Item;
          }
          return {
            item: {
              _id: el.item._id,
              name: el.item.name,
              defaultImage: defaultImage,
              price: el.item.price,
              stock: {
                runningLow: el.item.stock < el.item.maximumOrderQuantity * 2,
                outOfStock: el.item.stock <= 3,
                quantity: el.item.stock,
              },
              tax: el.item.tax,
              discount:
                el.item.discount > 0 && el.item.discount > siteWideDiscount
                  ? el.item.discount
                  : siteWideDiscount,
              dealName: el.item.discount > 0 ? dealName : "",
              routeParam: el.item.routeParam,
            },
            quantity: el.quantity,
          };
        })
      );
    }

    if (user.googleId || user.facebookId) {
      user.password = null; // Prevents password usage for social logins
      user.verified = true; // Social logins should be auto-verified
    }
    user.password = null;
    user.firstName =
      user.firstName ||
      (user.displayName ? user.displayName.split(" ")[0] : "");
    user.lastName =
      user.lastName ||
      (user.displayName ? user.displayName.split(" ")[1] || "" : "");

    return user;
  } catch (error) {
    throw error;
  }
};

const transformCart = async (cart) => {
  try {
    const updatedItems = await Promise.all(
      cart.items.map(async (el) => {
        let defaultImage = "";
        if (el.item.images && el.item.images.length) {
          defaultImage = await getS3Item(
            el.item.images[0].filename,
            process.env.S3_BUCKET_NAME_ITEM
          );
        }
        return {
          item: {
            _id: el.item._id,
            name: el.item.name,
            defaultImage: defaultImage,
            price: el.item.price,
            stock: el.item.stock,
            tax: el.item.tax,
            discount: el.item.discount,
            routeParam: el.item.routeParam,
          },
          quantity: el.quantity,
        };
      })
    );
    cart.items = updatedItems;
    return cart;
  } catch (error) {
    throw error;
  }
};

const transformReview = (review, userId) => {
  try {
    const userMinimal = {
      firstName: review.user.firstName,
      lastName: review.user.lastName,
    };
    review.user = userMinimal;
    const reviewedUser = review.foundHelpful.find(
      (el) => el._id.valueOf() === userId
    );
    const foundHelpful = {
      count: review.foundHelpful.length,
      applied: reviewedUser ? true : false,
    };
    delete review._doc.foundHelpful;
    review = {
      ...review._doc,
      helpful: foundHelpful,
    };
    return review;
  } catch (error) {
    throw error;
  }
};
// tranforming item minimal
const transformItemMinimal = async (item, appEnv) => {
  try {
    // Ensure item exists and has required properties
    if (!item) {
      console.warn("transformItemMinimal called with null or undefined item");
      return null;
    }

    let dealName = "Sale";
    let siteWideDiscount = 0;

    if (appEnv) {
      if (appEnv._doc && Date.now() > appEnv._doc.dealExpiry) {
        dealName = appEnv._doc.dealName || "Sale";
      }

      if (
        appEnv._doc &&
        Date.now() > appEnv._doc.dealExpiry &&
        appEnv._doc.siteWideDiscount > 0
      ) {
        siteWideDiscount = appEnv._doc.siteWideDiscount;
      }
    }

    // setting defaultImage
    let defaultImage = "";
    if (
      item.images &&
      Array.isArray(item.images) &&
      item.images.length &&
      item.images[0] &&
      item.images[0].filename
    ) {
      try {
        defaultImage = await getS3Item(
          item.images[0].filename,
          process.env.S3_BUCKET_NAME_ITEM
        );
      } catch (imageError) {
        console.error("Error loading image:", imageError);
      }
    }

    const maximumOrderQuantity = item.maximumOrderQuantity || 5;
    const stock = item.stock !== undefined ? item.stock : 0;

    const transformedItem = {
      _id: item._id || null,
      name: item.name || "Unnamed Item",
      routeParam: item.routeParam || "",
      defaultImage: defaultImage,
      discount:
        item.discount > 0 && item.discount > siteWideDiscount
          ? item.discount
          : siteWideDiscount,
      tax: item.tax || 0,
      maximumOrderQuantity: maximumOrderQuantity,
      dealName: item.discount > 0 ? dealName : "",
      price: item.price || { value: 0, currency: "CAD" },
      category: item.category || "",
      subCategory: item.subCategory || "",
      group: item.group || "",
      stock: {
        runningLow: stock < maximumOrderQuantity * 2 && stock > 3,
        outOfStock: stock <= 3,
        quantity: stock,
      },
      rating: {
        rateCount: item.rating?.rateCount || 0,
        rateAvg: item.rating?.rateAvg || 0,
      },
    };
    return transformedItem;
  } catch (error) {
    console.error("Error in transformItemMinimal:", error);
    // Return a safe default object to prevent null errors
    return {
      _id: item?._id || null,
      name: "Error loading item",
      routeParam: "",
      defaultImage: "",
      discount: 0,
      tax: 0,
      maximumOrderQuantity: 5,
      dealName: "",
      price: { value: 0, currency: "CAD" },
      category: "",
      subCategory: "",
      group: "",
      stock: {
        runningLow: false,
        outOfStock: true,
        quantity: 0,
      },
      rating: {
        rateCount: 0,
        rateAvg: 0,
      },
    };
  }
};
// tranforming item
const transformItem = async (item, appEnv) => {
  try {
    let dealName = "";
    let siteWideDiscount = 0;
    if (appEnv && Date.now() > appEnv._doc.dealExpiry) {
      dealName = appEnv._doc.dealName;
    } else {
      dealName = "Sale";
    }
    if (
      appEnv &&
      Date.now() > appEnv._doc.dealExpiry &&
      appEnv._doc.siteWideDiscount > 0
    ) {
      siteWideDiscount = appEnv._doc.siteWideDiscount;
    }

    let defaultImage = "";
    if (item.images && item.images.length) {
      for (const image of item.images) {
        image.imageLink = await getS3Item(
          image.filename,
          process.env.S3_BUCKET_NAME_ITEM
        );
      }
      // setting defaultImage
      defaultImage = item.images[0].imageLink;
    }

    const transformedItem = {
      _id: item._id,
      description: item.description,
      category: item.category,
      subCategory: item.subCategory,
      group: item.group,
      additionalInfo: item.additionalInfo,
      tags: item.tags,
      name: item.name,
      routeParam: item.routeParam,
      defaultImage: defaultImage,
      discount:
        item.discount > 0 && item.discount > siteWideDiscount
          ? item.discount
          : siteWideDiscount,
      tax: item.tax,
      dealName: item.discount > 0 ? dealName : "",
      price: item.price,
      sku: item.sku,
      supplier: item.supplier,
      model: item.model,
      stock: {
        runningLow: item.stock < item.maximumOrderQuantity * 2,
        outOfStock: item.stock <= 3,
        quantity: item.stock,
      },
      maximumOrderQuantity: item.maximumOrderQuantity,
      featuresDetails: item.featuresDetails,
      customerQuestions: item.customerQuestions,
      reviews: item.reviews,
      images: item.images,
      specs: item.specs,
      rating: {
        rateCount: item.rating.rateCount,
        rateCount1: item.rating.rateCount1,
        rateCount2: item.rating.rateCount2,
        rateCount3: item.rating.rateCount3,
        rateCount4: item.rating.rateCount4,
        rateCount5: item.rating.rateCount5,
        rateAvg: item.rating.rateAvg,
        ratings: item.rating.ratings.map((rtng) => {
          return {
            value: rtng.value,
          };
        }),
      },
      length: item.length,
      width: item.width,
      height: item.height,
      weight: item.weight,
      size: item.size,
      color: item.color,
      colorOptions: item.colorOptions,
      isColorApplicable: item.isColorApplicable,
      isSizeApplicable: item.isSizeApplicable,
      published: item.published,
      disabled: item.disabled,
    };
    return transformedItem;
  } catch (error) {
    throw error;
  }
};
// transform item search Minimal
const transformItemSearchMinimal = async (item) => {
  try {
    // setting defaultImage
    let defaultImage = "";
    if (item.images && item.images.length) {
      defaultImage = await getS3Item(
        item.images[0].filename,
        process.env.S3_BUCKET_NAME_ITEM
      );
    }
    const transformedItem = {
      _id: item._id,
      name: item.name,
      routeParam: item.routeParam,
      defaultImage: defaultImage,
      category: item.category,
    };
    return transformedItem;
  } catch (error) {
    throw error;
  }
};
// tranforming item model
const transformItemModel = async (itemModel) => {
  try {
    if (itemModel.images && itemModel.images.length) {
      for (const image of itemModel.images) {
        image.imageLink = await getS3Item(
          image.filename,
          process.env.S3_BUCKET_NAME_ITEM
        );
      }
    }

    const transformedItemModel = {
      _id: itemModel._id,
      description: itemModel.description,
      catId: itemModel.catId,
      category: itemModel.category,
      subCategory: itemModel.subCategory,
      group: itemModel.group,
      tags: itemModel.tags,
      name: itemModel.name,
      routeParam: itemModel.routeParam,
      published: itemModel.published,
      images: itemModel.images,
      specs: itemModel.specs,
      colors: itemModel.colors,
      disabled: itemModel.disabled,
    };
    return transformedItemModel;
  } catch (error) {
    throw error;
  }
};

const transformReviewForUser = (review, userId) => {
  try {
    const userMinimal = {
      firstName: review.user.firstName,
      lastName: review.user.lastName,
    };
    review.user = userMinimal;
    const reviewedUser = review.foundHelpful.find(
      (el) => el._id.valueOf() === userId
    );

    const rating = review._doc.rating
      ? {
          _id: review._doc.rating._id,
          value: review._doc.rating.value,
        }
      : null;
    delete review._doc.rating;
    const item = {
      _id: review._doc.item._id,
      images: review._doc.item.images,
      name: review._doc.item.name,
    };
    delete review._doc.item;
    const foundHelpful = {
      count: review.foundHelpful.length,
      applied: reviewedUser ? true : false,
    };
    delete review._doc.foundHelpful;
    review = {
      ...review._doc,
      item: item,
      helpful: foundHelpful,
      rating: rating,
    };
    return review;
  } catch (error) {
    throw error;
  }
};

const transformOrganization = (organization) => {
  return {
    ...organization._doc,
    _id: organization.id,
    user: user.bind(this, organization.user),
  };
};

const transformLogo = (logo) => {
  return {
    ...logo._doc,
    _id: logo.id,
    user: user.bind(this, logo.user),
  };
};

const transformResourceImage = (resourceImage) => {
  return {
    ...resourceImage._doc,
    _id: resourceImage.id,
    user: user.bind(this, resourceImage.user),
  };
};

const transformAlphaResourceMinimal = (alphaResource) => {
  return {
    _id: alphaResource._id,
    title: alphaResource.title,
    category: alphaResource.category,
    resourceRouteParam: alphaResource.resourceRouteParam,
  };
};

const transformAlphaResource = async (alphaResource) => {
  if (alphaResource.content && alphaResource.content.length) {
    for (const content of alphaResource.content) {
      if (content.filename !== "" && content.imageRequired) {
        content.imageLink = await getS3Item(
          content.filename,
          process.env.S3_BUCKET_NAME_ITEM
        );
      }
    }
  }
  return {
    _id: alphaResource._id,
    title: alphaResource.title,
    contentIntro: alphaResource.contentIntro,
    content: alphaResource.content,
    category: alphaResource.category,
    type: alphaResource.type,
    references: alphaResource.references,
    tags: alphaResource.tags,
    resourceRouteParam: alphaResource.resourceRouteParam,
    isPageConstructor: alphaResource.isPageConstructor,
  };
};

// tranforming menu
const transformMenu = async (menu) => {
  try {
    const transformedMenu = {
      _id: menu._id,
      name: menu.name,
      description: menu.description,
      position: menu.position,
      isSideMenu: menu.isSideMenu,
      position: menu.position,
      isTopMenu: menu.isTopMenu,
      isBottomMenu: menu.isBottomMenu,
      disabled: menu.disabled,
      published: menu.published,
      menuType: menu.menuType,
      routeParam: menu.routeParam,
      subMenus: menu.subMenus,
    };
    return transformedMenu;
  } catch (error) {
    throw error;
  }
};
// tranforming menu
const transformCategory = async (category) => {
  try {
    const transformedCategory = {
      _id: category._id,
      name: category.name,
      description: category.description,
      disabled: category.disabled,
      published: category.published,
      categoryType: category.categoryType,
      subCategories: category.subCategories,
    };
    return transformedCategory;
  } catch (error) {
    throw error;
  }
};

const transformOrders = async (orders) => {
  // Replace this with your actual function to fetch AppEnv or other relevant data
  const appEnv = await AppEnv.find()[0];
  let dealName = "";
  let siteWideDiscount = 0;

  if (appEnv) {
    dealName =
      Date.now() > appEnv._doc.dealExpiry ? appEnv._doc.dealName : "Sale";
    siteWideDiscount =
      Date.now() > appEnv._doc.dealExpiry && appEnv._doc.siteWideDiscount > 0
        ? appEnv._doc.siteWideDiscount
        : 0;
  }

  return Promise.all(
    orders.map(async (el) => {
      const items = await Promise.all(
        el.items.map(async (elItem) => {
          let defaultImage = "";
          if (elItem.item.images && elItem.item.images.length) {
            defaultImage = await getS3Item(
              elItem.item.images[0].filename,
              process.env.S3_BUCKET_NAME_ITEM
            );
          }
          return {
            item: {
              _id: elItem.item._id,
              name: elItem.item.name,
              category: elItem.item.category,
              defaultImage: defaultImage,
              price: elItem.item.price,
              stock: elItem.item.stock,
              tax: elItem.item.tax,
              routeParam: elItem.item.routeParam,
              discount:
                elItem.item.discount > 0 &&
                elItem.item.discount > siteWideDiscount
                  ? elItem.item.discount
                  : siteWideDiscount,
              dealName: elItem.item.discount > 0 ? dealName : "",
              routeParam: elItem.item.routeParam,
            },
            quantity: elItem.quantity,
          };
        })
      );

      return {
        _id: el._id,
        orderNumber: el.orderNumber,
        transactionId: el.transactionId,
        deliveryEstimate: el.deliveryEstimate,
        items: items,
        subTotal: el.subTotal,
        promotion: el.promotion,
        billingAddress: el.billingAddress,
        paymentMethod: el.paymentMethod,
        shippingAddress: el.shippingAddress,
        tax: el.tax,
        orderValue: el.orderValue,
        orderDate: el.orderDate,
        orderCurrency: el.orderCurrency,
        orderStatus: el.orderStatus,
        orderComplete: el.orderComplete,
        canceled: el.canceled,
      };
    })
  );
};

// Transform a single order with proper image processing
const transformSingleOrder = async (order) => {
  try {
    // Get app environment for deal info
    const appEnv = await AppEnv.findOne();
    let dealName =
      appEnv && Date.now() > appEnv._doc.dealExpiry
        ? appEnv._doc.dealName
        : "Sale";
    let siteWideDiscount =
      appEnv &&
      Date.now() > appEnv._doc.dealExpiry &&
      appEnv._doc.siteWideDiscount > 0
        ? appEnv._doc.siteWideDiscount
        : 0;

    // Process each item to add S3 URLs for images
    for (const item of order.items) {
      // Only process if item exists and has images
      if (item.item && item.item.images && item.item.images.length > 0) {
        const defaultImage = await getS3Item(
          item.item.images[0].filename,
          process.env.S3_BUCKET_NAME_ITEM
        );

        // Set the defaultImage to the S3 URL
        item.item.defaultImage = defaultImage;

        // Apply discount logic to maintain consistency with transformOrders
        item.item.discount =
          item.item.discount > 0 && item.item.discount > siteWideDiscount
            ? item.item.discount
            : siteWideDiscount;

        item.item.dealName = item.item.discount > 0 ? dealName : "";
      }
    }

    // Add return status information to each item
    if (order.returnDetails && order.returnDetails.items) {
      order.items = order.items.map((item) => {
        const returnItem = order.returnDetails.items.find(
          (ri) => ri.itemId.toString() === item.item._id.toString()
        );
        if (returnItem) {
          // Use returnItem specific status if available
          item.returnStatus =
            returnItem.refundStatus || order.returnDetails.returnStatus;
          item.refundProcessed =
            returnItem.refundStatus === "completed" ||
            order.returnDetails.refundProcessed;
          item.returnInitiated = true;

          // Add refund amount and date if available
          if (returnItem.refundAmount) {
            item.refundAmount = returnItem.refundAmount;
          }
          if (returnItem.refundDate) {
            item.refundDate = returnItem.refundDate;
          }

          // Check refundSessions for this item
          if (
            order.returnDetails.refundSessions &&
            order.returnDetails.refundSessions.length > 0
          ) {
            // Find latest session that contains this item
            const relevantSessions = order.returnDetails.refundSessions
              .filter(
                (session) =>
                  session.items &&
                  session.items.some(
                    (sessionItem) =>
                      sessionItem.itemId.toString() === item.item._id.toString()
                  )
              )
              .sort(
                (a, b) =>
                  (b.refundDate ? new Date(b.refundDate) : 0) -
                  (a.refundDate ? new Date(a.refundDate) : 0)
              );

            if (relevantSessions.length > 0) {
              const latestSession = relevantSessions[0];
              item.refundSessionStatus = latestSession.status;

              // If the session is completed, override the item status
              if (latestSession.status === "completed") {
                item.refundProcessed = true;
                item.returnStatus = "completed";
              }
            }
          }
        } else {
          // Check if the item is marked as returned directly in the items array
          if (item.returned) {
            item.returnInitiated = true;
            item.returnStatus = "completed";
          }
        }
        return item;
      });
    } else {
      // If no returnDetails, check the returned flag in items array
      order.items = order.items.map((item) => {
        if (item.returned) {
          item.returnInitiated = true;
          item.returnStatus = "completed";
        }
        return item;
      });
    }

    return order;
  } catch (error) {
    console.error(`Error processing single order: ${error.message}`);
    throw error;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      _id: user.id,
      email: user._doc.email,
      createdProjects: projects.bind(this, user._doc.createdProjects),
      organization: organization.bind(this, user._doc.organization),
    };
  } catch (error) {
    throw error;
  }
};

const projects = async (projectIds) => {
  try {
    const fetchedProjects = await Project.find({ _id: { $in: projectIds } });
    return fetchedProjects.map((project) => {
      return transformProject(project);
    });
  } catch (error) {
    throw error;
  }
};

const organization = async (oranizationId) => {
  try {
    const fetchedOrganization = await Organization.findById(oranizationId);
    return transformOrganization(fetchedOrganization);
  } catch (error) {
    throw error;
  }
};

const transformPaymentMethod = (paymentMethod) => {
  return {
    ...paymentMethod._doc,
    _id: paymentMethod.id,
    user: user.bind(this, paymentMethod.user),
  };
};

const transformAddress = (address) => {
  if (address) {
    address = Object.assign(
      {},
      {
        _id: address._id,
        //  category: address.category,
        addresseeFirst: address.addresseeFirst,
        addresseeLast: address.addresseeLast,
        line1: address.line1,
        line2: address.line2,
        landmark: address.landmark,
        stateProvince: address.stateProvince,
        cityTown: address.cityTown,
        country: address.country,
        postalCode: address.postalCode,
        phoneNumber: address.phoneNumber,
      }
    );
  }
  return address;
};

module.exports = {
  user,
  transformOrganization,
  transformLogo,
  transformResourceImage,
  transformAlphaResource,
  transformAlphaResourceMinimal,
  transformReview,
  transformItem,
  transformItemModel,
  transformItemMinimal,
  transformItemSearchMinimal,
  transformUser,
  transformCart,
  transformReviewForUser,
  transformPaymentMethod,
  transformOrders,
  transformAddress,
  transformMenu,
  transformCategory,
  transformSingleOrder,
};

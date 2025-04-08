if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { getS3Item } = require("../../utils/s3Actions");
const { User } = require("../../models/user");
const { UserSearch } = require("../../models/userSearch");
const { Item } = require("../../models/item");
const { getUserId } = require("../../utils/getUserId");
// const { transformItemSearchMinimal } = require("../resolvers/merge");
const { AppEnv } = require("../../models/appEnv.js");

const mongoose = require("mongoose");
const geoip = require("geoip-lite");

// getting geo location
const getUserLocation = (ip) => {
  try {
    const geo = geoip.lookup(ip);
    if (geo) {
      const region = geo.region;
      const country = geo.country;
      console.log(`User location: ${region}, ${country}`);
      return geo;
    } else {
      // console.log(`Could not determine user location for IP address ${ip}`);
    }
  } catch (error) {
    console.error(`Error while getting user location: ${error.message}`);
  }
};
// Configuring search keyword
const configureSearchTextPipeline = (pipeline, searchText) => {
  const orQueries = [
    // name
    { name: { $regex: new RegExp(searchText, "i") } },
    // description
    { description: { $regex: new RegExp(searchText, "i") } },
    // featuresDetails caption
    {
      "featuresDetails.caption": {
        $regex: new RegExp(searchText, "i"),
      },
    },
    // featuresDetails description
    {
      "featuresDetails.description": {
        $regex: new RegExp(searchText, "i"),
      },
    },
    // additional info
    { additionalInfo: { $regex: new RegExp(searchText, "i") } },
    // specs name
    { "specs.specName": { $regex: new RegExp(searchText, "i") } },
    // spec description
    {
      "specs.specDescription": { $regex: new RegExp(searchText, "i") },
    },
    // spec text
    { "specs.specText": { $regex: new RegExp(searchText, "i") } },
    // spec text
    {
      "specs.specTextOptions": { $regex: new RegExp(searchText, "i") },
    },
  ];

  if (pipeline.$match) {
    pipeline.$match.$or = pipeline.$match.$or || [];
    pipeline.$match.$or = pipeline.$match.$or.concat(orQueries);
  } else {
    pipeline.$match = { $or: orQueries };
  }

  return pipeline;
};

// registering search keyword
const registerSearch = async (req, searchText, context) => {
  try {
    // Authenticating
    const userId = await getUserId(req);

    if (!userId) {
      return;
      // throw new Error("Unauthenticated!");
    }

    const ipAddress =
      req.req.headers["x-forwarded-for"] || req.req.connection.remoteAddress;

    // let ipAddress = "203.187.231.250";
    const geo = getUserLocation(ipAddress);
    let country, region, city;
    if (geo) {
      ({ country, region, city } = geo);
    }

    // Finding existing user search data by searchText
    const existingSearchData = await UserSearch.findOne({
      searchText: searchText,
    });

    if (existingSearchData) {
      // If existing data found, increment occurrence count and add user to users array
      existingSearchData.occurrence = existingSearchData.occurrence + 1;
      // Check if user already exists in the users array
      if (userId) {
        const userIndex = existingSearchData.users.findIndex(
          (user) => user.toString() === userId
        );
        if (userIndex === -1) {
          // If user not found in array, add user to the users array
          existingSearchData.users.push(mongoose.Types.ObjectId(userId));
        }
      }
      // Check if country already exists in the country array
      if (country) {
        const countryIndex = existingSearchData.countries.findIndex(
          (countryCode) => countryCode === country
        );
        if (countryIndex === -1) {
          // If country not found in array, add country to the country array
          existingSearchData.countries.push(country);
        }
      }
      // Check if region already exists in the region array
      if (region) {
        const regionIndex = existingSearchData.regions.findIndex(
          (regionCode) => regionCode === region
        );
        if (regionIndex === -1) {
          // If region not found in array, add region to the region array
          existingSearchData.regions.push(region);
        }
      }
      // Check if city already exists in the region array
      if (city) {
        const cityIndex = existingSearchData.cities.findIndex(
          (cityCode) => cityCode === city
        );
        if (cityIndex === -1) {
          // If region not found in array, add region to the region array
          existingSearchData.cities.push(city);
        }
      }
      // Save the updated user search data to the database
      await existingSearchData.save();
    } else {
      // If no existing data found, create new user search data
      const newUserSearchData = new UserSearch({
        searchText: searchText,
        occurrence: 1,
        users: [mongoose.Types.ObjectId(userId)],
        countries: country ? [country] : [],
        regions: region ? [region] : [],
        cities: city ? [city] : [],
        context: context,
      });

      // Save the new user search data to the database
      await newUserSearchData.save();
    }

    // Returning the Search results
  } catch (error) {
    // console.log(error);
    return;
  }
};

const getProjectedItemFields = () => {
  return {
    _id: 1,
    name: 1,
    discount: 1,
    routeParam: 1,
    rating: 1,
    description: 1,
    defaultImage: 1,
    images: 1,
    category: 1,
    price: 1,
    maximumOrderQuantity: 1,
    stock: 1,
    tax: 1,
  };
};

// get Deal info
const getAppInfo = async () => {
  try {
    let dealName = "";
    let siteWideDiscount = 0;
    const appEnv = await AppEnv.find()[0];
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
    return { dealName, siteWideDiscount };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// Resolver
const userSearchResolver = {
  Query: {
    // Basic Search
    getItemSearchResults: async (_parent, { searchInput }, { req }) => {
      const searchText = searchInput.searchText.replace(/[^a-z0-9]/gi, "");
      try {
        // Get App Env variables
        // const appEnv = await AppEnv.find()[0];
        const page = 1;
        const limit = parseInt(process.env.ITEMS_PER_PAGE);
        const skip = (page - 1) * limit;
        const pipeline = [
          { $match: {} },
          { $sort: { discount: -1 } },
          {
            $project: getProjectedItemFields(),
          },
        ];

        if (searchText) {
          pipeline[0] = Object.assign(
            {},
            configureSearchTextPipeline(pipeline[0], searchText)
          );
        }
        // Blocking disabled and unpublished items
        pipeline.unshift({ $match: { disabled: false, published: true } });
        pipeline.push({
          $count: "totalItems",
        });
        const result = await Item.aggregate(pipeline);
        const totalItems = result.length > 0 ? result[0].totalItems : 0;

        const itemsPipeline = pipeline.slice(0, -1);
        itemsPipeline.push(
          {
            $skip: skip,
          },
          {
            $limit: limit,
          }
        );
        const items = await Item.aggregate(itemsPipeline);
        // Getting unique  categories
        const categoryPipeline = [
          { $match: {} },
          { $group: { _id: "$category" } },
          { $group: { _id: null, categories: { $addToSet: "$_id" } } },
          { $project: { _id: 0, categories: 1 } },
        ];
        if (searchText) {
          categoryPipeline[0] = Object.assign(
            {},
            configureSearchTextPipeline(categoryPipeline[0], searchText)
          );
        }
        // Blocking disabled and unpublished items
        categoryPipeline.unshift({
          $match: { disabled: false, published: true },
        });
        const categoryResults = await Item.aggregate(categoryPipeline);

        const uniqueCategories = categoryResults[0]
          ? categoryResults[0].categories.map(String)
          : [];

        // Pipeline to get unique colors
        const colorPipeline = [
          { $match: { disabled: false, published: true } }, // Ensure only active items are considered
          { $group: { _id: "$color" } },
          { $group: { _id: null, colors: { $addToSet: "$_id" } } },
          { $project: { _id: 0, colors: 1 } },
        ];

        if (searchText) {
          colorPipeline.unshift(
            configureSearchTextPipeline({ $match: {} }, searchText)
          );
        }

        const colorResults = await Item.aggregate(colorPipeline);
        const uniqueColors = colorResults[0]
          ? colorResults[0].colors.map(String)
          : [];

        // Pipeline to get unique sizes
        const sizePipeline = [
          { $match: { disabled: false, published: true } }, // Ensure only active items are considered
          { $group: { _id: "$size" } },
          { $group: { _id: null, sizes: { $addToSet: "$_id" } } },
          { $project: { _id: 0, sizes: 1 } },
        ];

        if (searchText) {
          sizePipeline.unshift(
            configureSearchTextPipeline({ $match: {} }, searchText)
          );
        }

        const sizeResults = await Item.aggregate(sizePipeline);
        const uniqueSizes = sizeResults[0]
          ? sizeResults[0].sizes.map(String)
          : [];

        // Getting unique  specs
        const specPipeline = [
          // Filter the items based on the searchText
          {
            $match: {
              $or: [
                { name: { $regex: searchText, $options: "i" } },
                { description: { $regex: searchText, $options: "i" } },
                {
                  "featuresDetails.caption": {
                    $regex: searchText,
                    $options: "i",
                  },
                },
              ],
            },
          },
          // Unwind the specs array
          { $unwind: "$specs" },
          // Group the items by specName and specValueType, and collect the values for each group
          {
            $group: {
              _id: {
                specName: "$specs.specName",
                specValueType: "$specs.specValueType",
              },
              specOptions: { $addToSet: "$specs.specTextOptions" },
              specValueSelect: { $addToSet: "$specs.specValueSelect" },
              specValue: { $addToSet: "$specs.specValue" },
              specUnit: { $addToSet: "$specs.specUnit" },
              count: { $sum: 1 }, // add count field
            },
          },

          // Project the desired fields for each group
          {
            $project: {
              _id: 0,
              specName: "$_id.specName",
              specValueType: "$_id.specValueType",
              specOptions: {
                $reduce: {
                  input: "$specOptions",
                  initialValue: [],
                  in: { $setUnion: ["$$value", "$$this"] },
                },
              },
              minValue: {
                $cond: {
                  if: {
                    $or: [
                      { $eq: ["$_id.specValueType", "value"] },
                      { $eq: ["$_id.specValueType", "value with unit"] },
                    ],
                  },
                  then: { $min: "$specValue" },
                  else: {
                    $cond: {
                      if: {
                        $or: [
                          { $eq: ["$_id.specValueType", "value options"] },
                          { $eq: ["$_id.specValueType", "options with unit"] },
                        ],
                      },
                      then: { $min: "$specValueSelect" },
                      else: 0,
                    },
                  },
                },
              },
              maxValue: {
                $cond: {
                  if: {
                    $or: [
                      { $eq: ["$_id.specValueType", "value"] },
                      { $eq: ["$_id.specValueType", "value with unit"] },
                    ],
                  },
                  then: { $max: "$specValue" },
                  else: {
                    $cond: {
                      if: {
                        $or: [
                          { $eq: ["$_id.specValueType", "value options"] },
                          { $eq: ["$_id.specValueType", "options with unit"] },
                        ],
                      },
                      then: { $max: "$specValueSelect" },
                      else: 0,
                    },
                  },
                },
              },
              specUnit: { $arrayElemAt: ["$specUnit", 0] },
              count: 1,
            },
          },
          {
            $project: {
              specName: 1,
              specValueType: 1,
              specOptions: 1,
              minValue: {
                $cond: {
                  if: { $ne: ["$minValue", 0] },
                  then: "$minValue",
                  else: "$$REMOVE",
                },
              },
              maxValue: {
                $cond: {
                  if: { $ne: ["$maxValue", 0] },
                  then: "$maxValue",
                  else: "$$REMOVE",
                },
              },
              count: { $ifNull: ["$count", 0] },
              specUnit: 1,
            },
          },
        ];

        if (searchText) {
          specPipeline[0] = Object.assign(
            {},
            configureSearchTextPipeline(specPipeline[0], searchText)
          );
        }
        // Blocking disabled and unpublished items
        specPipeline.unshift({
          $match: { disabled: false, published: true },
        });
        let specResults = await Item.aggregate(specPipeline);

        // Remove specs when specValueType is 'text'
        // Remove specs when couint is 1
        specResults = [
          ...specResults.filter((spec) => {
            return spec.specValueType !== "text" && spec.count > 1;
          }),
        ];
        // Remove specs when min value and max value are equal
        specResults = [
          ...specResults.filter((spec) => {
            if (spec.minValue > 0 && spec.maxValue > 0) {
              return spec.minValue !== spec.maxValue;
            } else {
              return true;
            }
          }),
        ];
        // split specs into minMax specs  and options specs
        let minMaxSpecs = specResults.filter(
          (spec) => spec.specValueType !== "options"
        );
        // sorting in descending order of count
        minMaxSpecs.sort((a, b) => b.count - a.count);
        // sliceing to max 10

        if (minMaxSpecs.length > 10) {
          minMaxSpecs = [...minMaxSpecs.slice(0, 10)];
        }

        let optionSpecs = specResults.filter(
          (spec) => spec.specValueType === "options"
        );
        // sorting in descending order of count
        optionSpecs.sort((a, b) => b.count - a.count);
        // sliceing to max 10
        if (optionSpecs.length > 10) {
          optionSpecs = [...optionSpecs.slice(0, 10)];
        }

        // const modifiedItems = items.map((item) =>
        //   transformItemSearchMinimal(item._doc)
        // );
        // Registering Search
        await registerSearch(req, searchText, (context = "items"));
        const { dealName, siteWideDiscount } = await getAppInfo();
        const modifiedItems = await Promise.all(
          items.map(async (item) => {
            // setting defaultImage
            let defaultImage = "";
            if (item.images && item.images.length) {
              defaultImage = await getS3Item(
                item.images[0].filename,
                process.env.S3_BUCKET_NAME_ITEM
              );
            }
            return {
              ...item,
              defaultImage: defaultImage,
              discount:
                item.discount > 0 && item.discount > siteWideDiscount
                  ? item.discount
                  : siteWideDiscount,
              dealName: item.discount > 0 ? dealName : "",
              stock: {
                runningLow: item.stock < item.maximumOrderQuantity * 2,
                outOfStock: item.stock <= 0,
                quantity: item.stock,
              },
            };
          })
        );
        // removing images field from items
        modifiedItems.forEach((item) => {
          delete item.images;
        });
        return {
          items: modifiedItems,
          categories: uniqueCategories,
          colors: uniqueColors,
          sizes: uniqueSizes,
          specs: [...optionSpecs, ...minMaxSpecs],
          totalItems,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // Advanced Search
    getItemAdvancedSearchResults: async (_parent, { searchInput }, { req }) => {
      let { searchText, specs, categories, colors, sizes, page, price } =
        searchInput;

      searchText = searchText.replace(/[^a-z0-9]/gi, "");
      try {
        const limit = parseInt(process.env.ITEMS_PER_PAGE);
        const skip = (page - 1) * limit;

        const pipeline = [
          { $match: {} },
          { $sort: { discount: -1 } },
          {
            $project: getProjectedItemFields(),
          },
        ];
        // facoring in search text
        if (searchText) {
          pipeline[0] = Object.assign(
            {},
            configureSearchTextPipeline(pipeline[0], searchText)
          );
        }
        // // Blocking disabled and unpublished items
        pipeline.unshift({ $match: { disabled: false, published: true } });
        // facoring in scategories
        if (categories && categories.length > 0) {
          pipeline[0].$match.category = { $in: categories };
        }
        // facoring in colors
        if (colors && colors.length > 0) {
          pipeline[0].$match.color = { $in: colors };
        }
        // facoring in sizes
        if (sizes && sizes.length > 0) {
          pipeline[0].$match.size = { $in: sizes };
        }
        // facoring in specs
        if (specs && specs.length > 0) {
          const specMatch = {
            $and: [],
          };
          for (const spec of specs) {
            const {
              specName,
              userSelectedOptions,
              userMinValue,
              userMaxValue,
              specValueType,
            } = spec;
            if (specValueType === "options") {
              const optionsMatch = {
                "specs.specName": specName,
                "specs.specTextSelect": { $in: userSelectedOptions },
              };
              specMatch.$and.push(optionsMatch);
            } else if (
              specValueType === "value" ||
              specValueType === "value with unit"
            ) {
              const valueMatch = {
                specs: {
                  $elemMatch: {
                    specName,
                    specValue: {
                      $gte: userMinValue || Number.MIN_SAFE_INTEGER,
                      $lte: userMaxValue || Number.MAX_SAFE_INTEGER,
                    },
                  },
                },
              };
              specMatch.$and.push(valueMatch);
            } else if (
              specValueType === "value options" ||
              specValueType === "options with unit"
            ) {
              const valueMatch = {
                specs: {
                  $elemMatch: {
                    specName,
                    specValueSelect: {
                      $gte: userMinValue || Number.MIN_SAFE_INTEGER,
                      $lte: userMaxValue || Number.MAX_SAFE_INTEGER,
                    },
                  },
                },
              };
              specMatch.$and.push(valueMatch);
            }
          }
          pipeline.unshift({ $match: specMatch });
        }
        // facoring in price
        if (price && (price.minPrice > 0 || price.maxPrice > 0)) {
          const { minPrice, maxPrice, isAscendingOrder } = price;

          // First, add a stage to calculate effective price (after discount, without tax)
          // This needs to be added before we use it in filters
          const effectivePriceStage = {
            $addFields: {
              effectivePrice: {
                $multiply: [
                  "$price.value",
                  { $divide: [{ $subtract: [100, "$discount"] }, 100] },
                ],
              },
            },
          };

          pipeline.push(effectivePriceStage);

          // Now filter based on the calculated field
          const priceFilter = {
            $match: {
              effectivePrice: {
                $gte: minPrice || Number.MIN_SAFE_INTEGER,
                $lte: maxPrice || Number.MAX_SAFE_INTEGER,
              },
            },
          };

          pipeline.push(priceFilter);

          // Add sorting based on the calculated field
          if (isAscendingOrder) {
            // For "Low to High" - Sort in ascending order by effectivePrice
            pipeline.push({
              $sort: {
                effectivePrice: 1,
              },
            });
          } else {
            // For "High to Low" - Sort in descending order by effectivePrice
            pipeline.push({
              $sort: {
                effectivePrice: -1,
              },
            });
          }
        }
        // If no price filter applied but sort order is specified, still need to calculate and sort by effectivePrice
        else if (price && price.isAscendingOrder !== undefined) {
          // Add stage to calculate effective price for sorting
          const effectivePriceStage = {
            $addFields: {
              effectivePrice: {
                $multiply: [
                  "$price.value",
                  { $divide: [{ $subtract: [100, "$discount"] }, 100] },
                ],
              },
            },
          };

          pipeline.push(effectivePriceStage);

          // Sort based on calculated field
          if (price.isAscendingOrder) {
            pipeline.push({ $sort: { effectivePrice: 1 } });
          } else {
            pipeline.push({ $sort: { effectivePrice: -1 } });
          }
        }

        // Add the count stage AFTER all filters have been applied
        pipeline.push({
          $count: "totalItems",
        });
        const result = await Item.aggregate(pipeline);
        const totalItems = result.length > 0 ? result[0].totalItems : 0;

        // Create a copy of the pipeline without the count stage for fetching items
        const itemsPipeline = pipeline.slice(0, -1);
        itemsPipeline.push(
          {
            $skip: skip,
          },
          {
            $limit: limit,
          }
        );

        const items = await Item.aggregate(itemsPipeline);
        const { dealName, siteWideDiscount } = await getAppInfo();
        const modifiedItems = await Promise.all(
          items.map(async (item) => {
            // setting defaultImage
            let defaultImage = "";
            if (item.images && item.images.length) {
              defaultImage = await getS3Item(
                item.images[0].filename,
                process.env.S3_BUCKET_NAME_ITEM
              );
            }
            return {
              ...item,
              defaultImage: defaultImage,
              discount:
                item.discount > 0 && item.discount > siteWideDiscount
                  ? item.discount
                  : siteWideDiscount,
              dealName: item.discount > 0 ? dealName : "",
              stock: {
                runningLow: item.stock < item.maximumOrderQuantity * 2,
                outOfStock: item.stock <= 0,
                quantity: item.stock,
              },
            };
          })
        );
        // removing images field from items
        modifiedItems.forEach((item) => {
          delete item.images;
        });
        return {
          totalItems,
          items: modifiedItems,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  // Mutation: {
  // },
};

module.exports = { userSearchResolver, getProjectedItemFields };

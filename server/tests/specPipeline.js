const specPipeline = [
  { $match: {} },
  { $unwind: "$specs" },
  {
    $group: {
      _id: "$specs.specName",
      specValueType: { $first: "$specs.specValueType" },
      unit: { $first: "$specs.specUnit" },
      specValueOptions: { $addToSet: "$specs.specValueOptions" },
      values: {
        $push: {
          $cond: [
            {
              $and: [
                {
                  $or: [
                    {
                      $eq: ["$specs.specValueType", "value with unit"],
                    },
                    { $eq: ["$specs.specValueType", "value"] },
                  ],
                },
                { $isNumber: "$specs.specValue" },
              ],
            },
            { $toInt: "$specs.specValue" },
            null,
          ],
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      specName: "$_id",
      specValueType: 1,
      unit: {
        $cond: {
          if: {
            $or: [
              { $eq: ["$specValueType", "value with unit"] },
              { $eq: ["$specValueType", "options with unit"] },
            ],
          },
          then: "$unit",
          else: null,
        },
      },
      specValueOptions: {
        $cond: {
          if: {
            $or: [
              { $eq: ["$specValueType", "options"] },
              { $eq: ["$specValueType", "options with unit"] },
            ],
          },
          then: "$specValueOptions",
          else: null,
        },
      },
      minValue: {
        $cond: {
          if: {
            $or: [
              { $eq: ["$specValueType", "value with unit"] },
              { $eq: ["$specValueType", "value"] },
            ],
          },
          then: {
            $reduce: {
              input: "$values",
              initialValue: null,
              in: {
                $cond: [{ $lt: ["$$this", "$$value"] }, "$$this", "$$value"],
              },
            },
          },
          else: null,
        },
      },
      maxValue: {
        $cond: {
          if: {
            $or: [
              { $eq: ["$specValueType", "value with unit"] },
              { $eq: ["$specValueType", "value"] },
            ],
          },
          then: {
            $reduce: {
              input: "$values",
              initialValue: null,
              in: {
                $cond: [{ $gt: ["$$this", "$$value"] }, "$$this", "$$value"],
              },
            },
          },
          else: null,
        },
      },
    },
  },
];

const specPipeline1 = [
  {
    $match: {},
  },
  {
    $unwind: "$specs",
  },
  {
    $group: {
      _id: {
        specName: "$specs.specName",
        specValueType: "$specs.specValueType",
        specUnit: "$specs.specUnit",
      },
      values: {
        $push: {
          $cond: {
            if: {
              $or: [
                { $eq: ["$specs.specValueType", "value"] },
                { $eq: ["$specs.specValueType", "value with unit"] },
              ],
            },
            then: "$specs.specValue",
            else: "$specs.specValueOptions",
          },
        },
      },
    },
  },
  {
    $addFields: {
      minMaxValues: {
        $reduce: {
          input: "$values",
          initialValue: [],
          in: {
            $concatArrays: [
              "$$value",
              {
                $cond: {
                  if: { $isArray: "$$this" },
                  then: [{ $min: "$$this" }, { $max: "$$this" }],
                  else: ["$$this", "$$this"],
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    $unwind: "$minMaxValues",
  },
  {
    $group: {
      _id: {
        specName: "$_id.specName",
        specValueType: "$_id.specValueType",
        specUnit: "$_id.specUnit",
      },
      minValue: {
        $min: "$minMaxValues",
      },
      maxValue: {
        $max: "$minMaxValues",
      },
      specValueOptions: {
        $addToSet: {
          $cond: {
            if: { $isArray: "$minMaxValues" },
            then: "$minMaxValues",
            else: null,
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      specName: "$_id.specName",
      specValueType: "$_id.specValueType",
      unit: {
        $cond: {
          if: { $eq: ["$_id.specValueType", "value with unit"] },
          then: "$_id.specUnit",
          else: null,
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
          then: "$minValue",
          else: null,
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
          then: "$maxValue",
          else: null,
        },
      },
      specValueOptions: {
        $cond: {
          if: { $eq: ["$_id.specValueType", "options"] },
          then: "$specValueOptions",
          else: {
            $cond: {
              if: { $eq: ["$_id.specValueType", "options with unit"] },
              then: "$specValueOptions",
              else: null,
            },
          },
        },
      },
    },
  },
];

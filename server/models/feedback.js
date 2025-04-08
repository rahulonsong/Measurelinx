const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    calendarDownloadCount: {
      type: Number,
      required: false,
    },
  },
  // time stamps
  {
    timestamps: true,
  }
);
const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = { Feedback };

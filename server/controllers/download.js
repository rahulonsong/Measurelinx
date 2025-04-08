const { Feedback } = require("../models/feedback");

const mongoose = require("mongoose");
// Set strictQuery to false to address deprecation warning
mongoose.set("strictQuery", false);

// calendar download function for post tea route
const calendarDownload = async (req, res, next) => {
  const file = `${
    __dirname + "/../"
  }/public/downloads/Canada_Events_Calendar_2023_Desktop.jpg`;
  // res.headers["Content-Disposition"] =
  //   'attachment; filename="Canada_Events_Calendar_2023_Desktop.jpg"';
  // Updating calendar count
  const feedbackInfo = await Feedback.find();
  if (feedbackInfo.length) {
    let existingFeedback = feedbackInfo[0];
    existingFeedback.calendarDownloadCount++;
    await existingFeedback.save();
  } else {
    let newFeedback = new Feedback({
      calendarDownloadCount: 1,
    });
    await newFeedback.save();
  }
  res.download(file); // Set disposition and send it.
  // Sending the calendar to client
  // res.send();
};

module.exports = { calendarDownload };

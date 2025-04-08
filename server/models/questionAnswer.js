const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionAnswerSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answers: [
      {
        answer: {
          type: String,
          required: false,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        timeStamp: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const QuestionAnswer = mongoose.model("QuestionAnswer", questionAnswerSchema);
module.exports = { QuestionAnswer };

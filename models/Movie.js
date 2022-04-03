const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    img: { type: String },
    trailer: { type: String },
    video: { type: String },
    year: { type: String },
    limit: { type: Number },
    genre: { type: String },
    isSeries: { type: Boolean, default: false },
    time: { type: String },
    comments: [
      {
        type: new mongoose.Schema(
          {
            userId: String,
            message: String,
          },
          { timestamps: true }
        ),
      },
    ],
    // comments: [{ userId: String, message: String, timestamps: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);

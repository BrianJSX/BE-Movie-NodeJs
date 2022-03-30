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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);

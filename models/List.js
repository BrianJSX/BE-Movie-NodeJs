const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    img: { type: String },
    trailer: { type: String },
    desc: { type: String },
    type: { type: String },
    genre: { type: String },
    content: { type: Array },
    limit: { type: Number },
    year: { type: String },
    time: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", ListSchema);

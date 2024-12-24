const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topic: { type: String, required: false, unique: false },
  customAlias: { type: String, required: false, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Url", urlSchema);
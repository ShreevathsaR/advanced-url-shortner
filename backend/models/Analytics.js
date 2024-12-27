const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  shortUrlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  osType: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;

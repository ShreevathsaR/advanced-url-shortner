const router = require("express").Router();
const { createShortUrl, redirectShortUrl, getAnalyticsData, getTopicAnalytics, getOverallAnalytics } = require("../controller/urlController");
const {isAuthenticated} = require("../middlewares/authMiddleware");
const { urlCreationLimiter } = require("../middlewares/rateLimiter");
const Url = require("../models/Url");

router.post("/shorten", urlCreationLimiter,  createShortUrl);
router.get("/:shortUrl", redirectShortUrl);
router.get("/analytics/:shortUrlId", getAnalyticsData);
router.get("/analytics/topic/:topic", getTopicAnalytics);
router.get("/overall/analytics", getOverallAnalytics);
  

module.exports = router;

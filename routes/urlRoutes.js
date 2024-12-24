const router = require("express").Router();
const { createShortUrl, redirectShortUrl } = require("../controller/urlController");
const {isAuthenticated} = require("../middlewares/authMiddleware");
const { urlCreationLimiter } = require("../middlewares/rateLimiter");
const Url = require("../models/Url");

router.post("/shorten", urlCreationLimiter,  createShortUrl);
router.get("/:shortUrl", redirectShortUrl);
  

module.exports = router;

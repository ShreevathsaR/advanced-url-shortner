const router = require("express").Router();
const { createShortUrl, redirectShortUrl, getAnalyticsData, getTopicAnalytics, getOverallAnalytics, getAllUrls, deleteShortUrl, getNumbers } = require("../controller/urlController");
const {isAuthenticated} = require("../middlewares/authMiddleware");
const { urlCreationLimiter } = require("../middlewares/rateLimiter");
const Url = require("../models/Url");

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Create a shortened URL
 *     description: Allows authenticated users to create a shortened URL with an optional custom alias and topic.
 *     tags:
 *       - URL Shortener
 *     security:
 *       - Cookie: connect.sid=sessionId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 description: The original URL to be shortened.
 *                 example: "https://example.com"
 *               customAlias:
 *                 type: string
 *                 description: (Optional) A custom alias for the shortened URL.
 *                 example: "my-custom-alias"
 *               topic:
 *                 type: string
 *                 description: (Optional) A topic or category for the shortened URL.
 *                 example: "tech"
 *     responses:
 *       "201":
 *         description: URL successfully shortened.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The shortened URL.
 *                   example: "http://localhost:3000/my-custom-alias"
 *                 originalUrl:
 *                   type: string
 *                   description: The original URL.
 *                   example: "https://example.com"
 *       "400":
 *         description: Bad request, missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Original URL is required"
 *       "409":
 *         description: Conflict, custom alias already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Provided custom alias is already taken"
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.post("/shorten", isAuthenticated, urlCreationLimiter,  createShortUrl);

/**
 * @swagger
 * /{shortUrl}:
 *   get:
 *     summary: Redirect to the original URL from the shortened URL
 *     description: Redirects the user to the original URL based on the provided shortened URL alias. Caches the result in Redis for subsequent requests.
 *     tags:
 *       - URL Shortener
 *     parameters:
 *       - name: shortUrl
 *         in: path
 *         required: true
 *         description: The alias of the shortened URL.
 *         schema:
 *           type: string
 *           example: "my-custom-alias"
 *     responses:
 *       "302":
 *         description: Redirects to the original URL.
 *         headers:
 *           Location:
 *             description: The original URL.
 *             schema:
 *               type: string
 *               example: "https://example.com"
 *       "401":
 *         description: The shortened URL alias was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Url not found"
 *       "500":
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get("/:shortUrl", redirectShortUrl);

/**
 * @swagger
 * /analytics/{shortUrlId}:
 *   get:
 *     summary: Retrieve analytics data for a shortened URL
 *     description: Fetches analytics data, including total clicks, unique clicks, operating system breakdown, device type breakdown, and clicks over the last 7 days for a specific shortened URL.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: shortUrlId
 *         in: path
 *         required: true
 *         description: The ID of the shortened URL for which analytics data is being retrieved.
 *         schema:
 *           type: string
 *           example: "607c72efc4a8b3349c56e789"
 *     responses:
 *       "200":
 *         description: Successfully retrieved the analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: The total number of clicks on the shortened URL.
 *                   example: 120
 *                 uniqueClicks:
 *                   type: integer
 *                   description: The number of unique clicks based on IP addresses.
 *                   example: 80
 *                 clicksByDate:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   description: The number of clicks per day over the last 7 days.
 *                   example:
 *                     "2024-12-20": 15
 *                     "2024-12-21": 10
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         description: The name of the operating system.
 *                         example: "Windows"
 *                       uniqueClicks:
 *                         type: integer
 *                         description: The number of unique clicks for that OS.
 *                         example: 60
 *                       uniqueUsers:
 *                         type: integer
 *                         description: The number of unique users for that OS.
 *                         example: 50
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         description: The name of the device type.
 *                         example: "Mobile"
 *                       uniqueClicks:
 *                         type: integer
 *                         description: The number of unique clicks for that device.
 *                         example: 70
 *                       uniqueUsers:
 *                         type: integer
 *                         description: The number of unique users for that device.
 *                         example: 60
 *       "401":
 *         description: Unauthorized access, user must be authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "404":
 *         description: No analytics data found for the given URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No analytics data found for this url"
 *       "500":
 *         description: Internal server error when retrieving analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving analytics data"
 */
router.get("/analytics/:shortUrlId", getAnalyticsData);

/**
 * @swagger
 * /analytics/topic/{topic}:
 *   get:
 *     summary: Retrieve analytics data for a specific topic
 *     description: Fetches analytics data for all URLs associated with a specific topic, including total clicks, unique users, clicks over the last 7 days, and detailed URL-level analytics.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: topic
 *         in: path
 *         required: true
 *         description: The topic for which analytics data is being retrieved.
 *         schema:
 *           type: string
 *           example: "technology"
 *     responses:
 *       "200":
 *         description: Successfully retrieved the analytics data for the topic.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: The total number of clicks for all URLs in the topic.
 *                   example: 500
 *                 uniqueUsers:
 *                   type: integer
 *                   description: The number of unique users who clicked URLs in the topic.
 *                   example: 300
 *                 clicksByDate:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   description: The number of clicks per day over the last 7 days for all URLs in the topic.
 *                   example:
 *                     "2024-12-20": 50
 *                     "2024-12-21": 40
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         description: The shortened URL.
 *                         example: "http://localhost:3000/abc123"
 *                       totalClicks:
 *                         type: integer
 *                         description: The total number of clicks for the specific URL.
 *                         example: 100
 *                       uniqueUsers:
 *                         type: integer
 *                         description: The number of unique users for the specific URL.
 *                         example: 80
 *       "401":
 *         description: Unauthorized access, user must be authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "404":
 *         description: No URLs or analytics data found for the specified topic.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No URLs found for this topic"
 *       "500":
 *         description: Internal server error when retrieving topic analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving topic analytics"
 */
router.get("/analytics/topic/:topic", getTopicAnalytics);

/**
 * @swagger
 * /overall/analytics:
 *   get:
 *     summary: Retrieve overall analytics data for the authenticated user
 *     description: Fetches overall analytics data for the authenticated user, including total URLs, total clicks, unique users, clicks over the last 7 days, and breakdowns by OS and device type.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successfully retrieved overall analytics data for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: integer
 *                   description: The total number of URLs owned by the user.
 *                   example: 5
 *                 totalClicks:
 *                   type: integer
 *                   description: The total number of clicks for the user's URLs.
 *                   example: 1000
 *                 uniqueUsers:
 *                   type: integer
 *                   description: The number of unique users who clicked on the user's URLs.
 *                   example: 600
 *                 clicksByDate:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   description: The number of clicks per day over the last 7 days for the user's URLs.
 *                   example:
 *                     "2024-12-20": 50
 *                     "2024-12-21": 60
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         description: The name of the operating system.
 *                         example: "Windows"
 *                       uniqueClicks:
 *                         type: integer
 *                         description: The number of unique clicks from users using this operating system.
 *                         example: 300
 *                       uniqueUsers:
 *                         type: integer
 *                         description: The number of unique users who used this operating system.
 *                         example: 250
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         description: The name of the device.
 *                         example: "Mobile"
 *                       uniqueClicks:
 *                         type: integer
 *                         description: The number of unique clicks from users using this device.
 *                         example: 400
 *                       uniqueUsers:
 *                         type: integer
 *                         description: The number of unique users who used this device.
 *                         example: 350
 *       "401":
 *         description: Unauthorized access, user must be authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal server error when retrieving overall analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving overall analytics data"
 */
router.get("/overall/analytics", isAuthenticated, getOverallAnalytics);
router.get("/user/urls", isAuthenticated, getAllUrls);
router.delete("/:urlId", isAuthenticated, deleteShortUrl)
router.get('/landing/all', getNumbers)
  

module.exports = router;

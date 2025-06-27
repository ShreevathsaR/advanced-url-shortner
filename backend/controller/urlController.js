const Url = require("../models/Url");
const crypto = require("crypto");
const { nanoid } = require("nanoid");
const useragent = require("useragent");
const Analytics = require("../models/Analytics");
const redisClient = require("../config/redis");
const { isValidObjectId, default: mongoose } = require("mongoose");

const createShortUrl = async (req, res) => {
  const { originalUrl, customAlias, topic } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  try {
    let alias = customAlias || nanoid();

    const existingAlias = await Url.findOne({ customAlias: alias });
    if (existingAlias) {
      return res
        .status(409)
        .json({ message: "Provided custom alias is already taken" });
    }

    const newUrl = new Url({
      originalUrl,
      customAlias: alias,
      shortUrl: `http://localhost:${process.env.PORT}/${alias}`,
      userId: req.user._id,
      topic: topic || "",
    });

    await newUrl.save();
    res.status(201).json({
      success: true,
      shortUrl: newUrl.shortUrl,
      originalUrl: newUrl.originalUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllUrls = async (req, res) => {
  const userId = req.user._id;

  try {
    const userUrls = await Url.find({ userId: userId });

    if (!userUrls.length) {
      return res
        .status(404)
        .json({ success: false, message: "No URLs found for the user." });
    }
    return res.status(200).json({
      success: true,
      message: "Urls fetched successfuly",
      data: userUrls,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching urls for the user" });
  }
};

const redirectShortUrl = async (req, res) => {
  const { shortUrl: alias } = req.params;

  try {
    const cachedUrl = await redisClient.get(`shortUrl:${alias}`);
    if (cachedUrl) {
      console.log("Cache hit");
      return res.redirect(cachedUrl);
    }

    const url = await Url.findOne({ customAlias: alias });

    if (!url) {
      return res.status(401).json({ message: "Url not found" });
    }

    const ipAddress = req.ip;
    const userAgentString = req.headers["user-agent"];
    const agent = useragent.parse(userAgentString);

    const analyticsData = new Analytics({
      shortUrlId: url._id,
      userAgent: userAgentString,
      ipAddress: ipAddress,
      osType: agent.os.family,
      deviceType: agent.device.family,
      timestamp: new Date(),
    });

    await analyticsData.save();

    console.log(analyticsData);

    await redisClient.set(`shortUrl:${alias}`, url.originalUrl, { EX: 3600 });

    res.redirect(url.originalUrl);
  } catch (err) {
    console.log(err);
    res.json({ message: "Server error" });
  }
};

const getAnalyticsData = async (req, res) => {
  const { shortUrlId } = req.params;
  try {
    const cachedAnalytics = await redisClient.get(`analytics:${shortUrlId}`);
    if (cachedAnalytics) {
      console.log("Cache hit");
      return res.json({ success: true, ...JSON.parse(cachedAnalytics) });
    }

    const records = await Analytics.find({ shortUrlId: shortUrlId });

    if (!records) {
      return res
        .status(404)
        .json({ message: "No analytics data found for this url" });
    }

    console.log(records);

    const totalClicks = records.length;

    const uniqueClicks = new Set(
      records.map((record) => {
        return record.ipAddress;
      })
    ).size;

    const osType = records.reduce((acc, record) => {
      const os = record.osType || "Unknown";
      if (!acc[os]) {
        acc[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      if (!acc[os].uniqueUsers.has(record.ipAddress)) {
        acc[os].uniqueClicks += 1;
        //as per my understanding this is the way to get uniqueClicks
      }
      acc[os].uniqueUsers.add(record.ipAddress);
      return acc;
    }, {});

    const osTypeFormatted = Object.keys(osType).map((osName) => ({
      osName,
      uniqueClicks: osType[osName].uniqueClicks,
      uniqueUsers: osType[osName].uniqueUsers.size,
    }));

    const deviceType = records.reduce((acc, record) => {
      const device = record.deviceType || "Unknown";
      if (!acc[device]) {
        acc[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      if (!acc[device].uniqueUsers.has(record.ipAddress)) {
        acc[device].uniqueClicks += 1;
      }
      acc[device].uniqueUsers.add(record.ipAddress);
      return acc;
    }, {});

    const deviceTypeFormatted = Object.keys(deviceType).map((deviceName) => ({
      deviceName,
      uniqueClicks: deviceType[deviceName].uniqueClicks,
      uniqueUsers: deviceType[deviceName].uniqueUsers.size,
    }));

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const clicksByDate = records
      .filter((record) => new Date(record.timestamp) >= sevenDaysAgo)
      .reduce((acc, record) => {
        const date = record.timestamp.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    const payload = {
      totalClicks,
      uniqueClicks,
      clicksByDate,
      osType: osTypeFormatted,
      deviceType: deviceTypeFormatted,
    };

    await redisClient.set(`analytics:${shortUrlId}`, JSON.stringify(payload), {
      EX: 3600,
    });

    res.status(200).json({
      success: true,
      ...{ ...payload },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving analytics data" });
  }
};

const getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;

    const urls = await Url.find({ topic });

    if (!urls.length) {
      return res.status(404).json({ message: "No URLs found for this topic" });
    }

    const shortUrlIds = urls.map((url) => url._id.toString());

    const analyticsRecords = await Analytics.find({
      shortUrlId: { $in: shortUrlIds },
    });

    if (!analyticsRecords.length) {
      return res
        .status(404)
        .json({ message: "No analytics data found for this topic" });
    }

    const totalClicks = analyticsRecords.length;
    const uniqueUsers = new Set(
      analyticsRecords.map((record) => record.ipAddress)
    ).size;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const clicksByDate = analyticsRecords
      .filter((record) => new Date(record.timestamp) >= sevenDaysAgo)
      .reduce((acc, record) => {
        const date = new Date(record.timestamp).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    const urlAnalytics = shortUrlIds.map((shortUrlId) => {
      //urls are mapped
      const urlRecords = analyticsRecords.filter(
        //from a set of records of all urls we are filtering the records of a particular url
        (record) => record.shortUrlId.toString() === shortUrlId
      );

      const urlUniqueUsers = new Set(
        urlRecords.map((record) => record.ipAddress)
        //map throws ipaddresses set only takes unique values and we store the number of unique users
      ).size;

      return {
        shortUrl: urls.find(
          (url) => url._id.toString() === shortUrlId.toString()
        ).shortUrl,
        //matching the ids to retieve the short url
        totalClicks: urlRecords.length,
        uniqueUsers: urlUniqueUsers,
      };
    });

    res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate,
      urls: urlAnalytics,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving topic analytics" });
  }
};

const getOverallAnalytics = async (req, res) => {
  try {
    // console.log(req.user)

    const userId = req.user._id;

    const userUrls = await Url.find({ userId: userId });

    if (!userUrls.length) {
      return res.status(404).json({ message: "No URLs found for the user." });
    }

    const shortUrlIds = userUrls.map((url) => url._id);

    const analyticsRecords = await Analytics.find({
      shortUrlId: { $in: shortUrlIds },
    });

    const totalUrls = userUrls.length;

    const totalClicks = analyticsRecords.length;

    const uniqueUsers = new Set(
      analyticsRecords.map((record) => record.ipAddress)
    ).size;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const clicksByDate = analyticsRecords
      .filter((record) => new Date(record.timestamp) >= sevenDaysAgo)
      .reduce((acc, record) => {
        const date = record.timestamp.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    const osType = analyticsRecords.reduce((acc, record) => {
      acc[record.osType] = acc[record.osType] || {
        uniqueClicks: 0,
        uniqueUsers: new Set(),
      };
      acc[record.osType].uniqueClicks++;
      acc[record.osType].uniqueUsers.add(record.ipAddress);
      return acc;
    }, {});

    const osTypeFormatted = Object.keys(osType).map((osName) => ({
      osName,
      uniqueClicks: osType[osName].uniqueClicks,
      uniqueUsers: osType[osName].uniqueUsers.size,
    }));

    const deviceType = analyticsRecords.reduce((acc, record) => {
      acc[record.deviceType] = acc[record.deviceType] || {
        uniqueClicks: 0,
        uniqueUsers: new Set(),
      };
      acc[record.deviceType].uniqueClicks++;
      acc[record.deviceType].uniqueUsers.add(record.ipAddress);
      return acc;
    }, {});

    const deviceTypeFormatted = Object.keys(deviceType).map((deviceName) => ({
      deviceName,
      uniqueClicks: deviceType[deviceName].uniqueClicks,
      uniqueUsers: deviceType[deviceName].uniqueUsers.size,
    }));

    res.json({
      totalUrls,
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType: osTypeFormatted,
      deviceType: deviceTypeFormatted,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error retrieving overall analytics data" });
  }
};

const deleteShortUrl = async (req, res) => {
  const { urlId } = req.params;

  function ObjectIdCheck(urlId) {
    if (isValidObjectId(urlId)) {
      return urlId;
    }
    return mongoose.Types.ObjectId(urlId);
  }

  try {
    const url = await Url.findByIdAndDelete(ObjectIdCheck(urlId));

    if (!url) {
      res.status(404).json({ success: false, message: "URL not found" });
    }

    res
      .status(200)
      .json({ success: false, message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed deleting url" });
  }
};

module.exports = {
  redirectShortUrl,
  createShortUrl,
  getAnalyticsData,
  getTopicAnalytics,
  getOverallAnalytics,
  getAllUrls,
  deleteShortUrl,
};

const Url = require("../models/Url");
const crypto = require("crypto");
const { nanoid } = require('nanoid');

const createShortUrl = async (req, res) => {
    const { originalUrl, customAlias, topic } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: "Original URL is required" });
    }

    try {
        let alias = customAlias || nanoid();

        const existingAlias = await Url.findOne({ customAlias: alias });
        if (existingAlias) {
            return res.status(409).json({ message: "Provided custom alias is already taken" }); 
        }

        const newUrl = new Url({
            originalUrl,
            customAlias: alias,
            shortUrl: `http://localhost:${process.env.PORT}/${alias}`,
            userId: '676a42790a6a5a02fd5f9203', 
            topic: topic || '' 
        });

        await newUrl.save();
        res.status(201).json({ shortUrl: newUrl.shortUrl, originalUrl: newUrl.originalUrl });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const redirectShortUrl = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ customAlias: shortUrl })

        if (!url) {
            return res.status(401).json({ "message": "Url not found" })
        }
        res.redirect(url.originalUrl)
    }
    catch (err) {
        console.log(err)
        res.json({ "message": "Server error" })
    }
}

module.exports = { redirectShortUrl, createShortUrl }
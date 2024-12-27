const rateLimit = require('express-rate-limit')

exports.urlCreationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
	limit: 20,
    message: "You have exceeded the URL creation limit. Try again later.",
    keyGenerator: (req) => req.ip,
})


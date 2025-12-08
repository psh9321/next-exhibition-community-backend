const rateLimit = require("express-rate-limit");

function api_limiter() {
    rateLimit({
        windowMs : 1000,
        max : 1,
        standardHeaders : true,
        legacyHeaders : false,
        message : "Too many accounts created from this IP"
    })
}

module.exports = {
    api_limiter
}
"use strict"

const jwt = require("jsonwebtoken");

/**
 * 토큰 생성
 * @param {string} userId 유저아이디
 * @param {boolean} isRefresh true : 리프레시 토큰
 */
function setToken(userId, isRefresh) {
    const secretKey = process["env"][isRefresh ? "REFRESH_KEY" : "ACCESS_KEY"];
    const tokenTime = process["env"][isRefresh ? "REFRESH_TIME" : "ACCESS_TIME"];

    const tokenInfo = {
        id : userId,
        pw : null,
        name : null,
    }

    const options = {
        expiresIn : tokenTime,
        issuer : process["env"]["ADMIN_ISSUER"]        
    }

    const result = jwt.sign(tokenInfo, secretKey, options);

    return result
}

module.exports = {
     setToken
}
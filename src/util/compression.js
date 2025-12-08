"use strict"

const pako = require("pako");

/**
 * 문자 압축 인코딩
 * @param {string} str base64 인코딩할 문자
 */
const compressData = (str) => {
    const compressStr = pako.deflate(str, {level : 9});
    
    const base64Str = Buffer.from(compressStr).toString("base64");

    return base64Str
}

/**
 * 압축 문자 디코딩
 * @param {string} encodeStr base64 인코딩 된 문자
 */
const deCompressData = (encodeStr) => {

    if(!encodeStr || encodeStr === "null") return null;

    const deCompressStr = Buffer.from(encodeStr,"base64");

    const result = pako.inflate(deCompressStr, {to : "string"});


    return result
}

module.exports = { compressData, deCompressData }
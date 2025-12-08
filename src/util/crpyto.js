"use strict"

const { AES, enc } = require("crypto-js")

/**
 * 문자화 된 데이터 를 암호화 함
 * @param {string} paramsStr 
 * 
 * @returns {string} 암호화된 문자열
 */
function dataEncrypt(paramsStr){
    const data = AES.encrypt(paramsStr, process["env"]["SECRET_KEY"]);

    const result = data.toString();
    
    return result
}

/**
 * 암호화된 문자열을 복호화 함
 * @param {string} encryptStr 암호화된 문자열
 * 
 * @returns {any} 복호화된 데이터 
 */
 function dataDecrypt(encryptStr){
    const decrypt = AES.decrypt(encryptStr, process["env"]["SECRET_KEY"]);

    const result = decrypt.toString(enc.Utf8);

    return result;
}

module.exports = { dataDecrypt, dataEncrypt }
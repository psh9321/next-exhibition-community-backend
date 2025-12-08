const { genSaltSync, hashSync, compare } = require("bcryptjs");
const { ResponseModel } = require("../model/response");

/**
 * 비밀번호 암호화
 * @param {string} pw 비밀번호
 * @returns {string} 암호화된 비밀번호
 */
function PassWordEncrypt(pw){
    try {
        const salt = genSaltSync(10);
        const hash = hashSync(pw, salt);

        return hash
    }
    catch(err) {
        throw new ResponseModel(500, err, "PassWordEncrypt error")
    }
}

/**
 * 비밀번호 검증
 * @param {string} pw 비밀번호
 * @param {string} bycripyPw 암호화된 비밀번호
 */
async function PassWordCompare(pw, bycripyPw){
    return await compare(pw, bycripyPw);
}

module.exports = {
    PassWordEncrypt,
    PassWordCompare
}
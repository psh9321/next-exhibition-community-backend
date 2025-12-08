"use strict"

const { UserModel } = require("../model/user");

/** 
 * 회원중복 검사
 * @param {object} info
 * @property {string} id 아이디
 * @property {string} pw 비밀번호
 * @property {string} job 직업
 * @property {string} name 이름
 * @property {string} email 이메일
 * @property {string} birth 생년월일 ex) yyyymmdd
 * @property {string} phone 폰번호 ex) 00011112222
 * @property {number} gender 성별 0 : 남, 1 : 여
 * 
 * @returns {string} 아이디, 폰번호
 */
async function checkDuplicate(info) {

    try {
        for( const key in info) {
            if (!["id", "phone"].includes(key)) continue;
    
            let result = null;
    
            if (key === "id") {
                result = await UserModel.findOne({ id: info[key] });
            } else {
                result = await UserModel.findOne({ [`${key}.value`]: info[key] });
            }
    
            if(result) {
                switch (key) {
                    case "id": return "아이디";
                    case "phone" : return "폰번호";

                    default : return "";
                }
            }
        }
    }
    catch(err) {
        throw err
    }
}

module.exports = { checkDuplicate }
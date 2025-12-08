"use strict"

const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user");
const { ResponseModel } = require("../model/response");
const { dataEncrypt } = require("../util/crpyto");
const { setToken } = require("../util/token");



/**
 * 토큰 유효성 검사
 * @param {object} tokenObj { a : string, r : string }
 */
async function Token(tokenObj) {
    try {
        const { a, r } = tokenObj;

        return jwt.verify(a, process["env"]["ACCESS_KEY"], async (accessErr, access) => {
            /** accessToken 기간 만료 */
            if(accessErr) {                

                return jwt.verify(r, process["env"]["REFRESH_KEY"], async (refreshErr, refresh) => {
                    /** refreshToken 기간만료 */
                    if(refreshErr) {
                        return new ResponseModel(403, null, "토큰 만료")
                    }
                    /** refreshToken 유효함 */
                    else {
                        const { id } = refresh;

                        const userInfo = await UserModel.findOne({id})

                        if(!userInfo) return new ResponseModel(403, null, "유저 정보가 조회 되지않는 토큰");

                        const objStr = JSON.stringify({
                            a : setToken(refresh["id"]),
                            r : r
                        });

                        return new ResponseModel(200, dataEncrypt(objStr), "");
                    }
                })
            }
            /** accessToken 유효함 */
            else {

                // console.log(access,"accessaccess")
                const { id } = access;

                const userInfo = await UserModel.findOne({id})

                if(!userInfo) return new ResponseModel(403, null, "유저 정보가 조회 되지않는 토큰");

                return new ResponseModel(200, null, "");
            }
        })
    }
    catch(err) {
        throw new ResponseModel(500, err.message ,"token verify api 알수 없는 에러");
    }
}

/**
 * 
 * @param {string} key 
 */
async function ClientKey(key) {
    try {
        const userInfo = await UserModel.findOne({id : key});

        if(!userInfo) return new ResponseModel(403, null, "유효 하지않은 클라이언트 키");

        return new ResponseModel(200);
    }
    catch(err) {

    }    
}

module.exports = { Token, ClientKey }
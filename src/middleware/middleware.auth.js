"use strict"

const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user");
const { ResponseModel } = require("../model/response");
const { dataDecrypt } = require("../util/crpyto");

async function AuthToken(req, res, next) {

    try {

        const token = req.headers["auth"];
 
        if(!token) {
            req.id = null;
            return res.status(200).send(new ResponseModel(-99, null, "토큰 없음"))
        }

        const decriptToken = JSON.parse(dataDecrypt(token));

        const { a, r } = decriptToken;

        return jwt.verify(a, process["env"]["ACCESS_KEY"], async (accessErr, access) => {
            /** accessToken 기간 만료 */
            if(accessErr) {                

                return jwt.verify(r, process["env"]["REFRESH_KEY"], async (refreshErr, refresh) => {
                    /** refreshToken 기간만료 */
                    if(refreshErr) {
                        return res.status(200).send(new ResponseModel(-999, null, "토큰 만료"))
                    }
                    /** refreshToken 유효함 */
                    else {
                        const { id } = refresh;

                        const userInfo = await UserModel.findOne({id})

                        if(!userInfo) return res.status(200).send( new ResponseModel(403, null, "유저 정보가 조회 되지않는 토큰"));

                        // const objStr = JSON.stringify({
                        //     a : setToken(refresh["id"]),
                        //     r : r
                        // });

                        req.id = id;

                        return next();
                    }
                })
            }
            /** accessToken 유효함 */
            else {

                // console.log(access,"accessaccess")
                const { id } = access;

                const userInfo = await UserModel.findOne({id})

                if(!userInfo) return res.status(200).send(new ResponseModel(403, null, "유저 정보가 조회 되지않는 토큰"));

                req.id = id;

                return next();
            }
        })
    }
    catch(err) {
        console.log(err,"token")
    }
}


module.exports = {
    AuthToken,
}
"use strict"

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    id : String, /** 아이디(이메일) */
    pw: String, /** 비밀번호 */
    name : String, /** 이름 */
    gender : Number, /** 성별 0 : 남, 1 : 여 */
    isReceiveEmail : Boolean, /** 이메일 수신 동의 */
    birth : String, /** 생년월일 ex) 19940711 */
    area : String,
    nickName : String, /** 닉네임 */
    createRegister : { /** 가입시간 */
        type : Date,
        default : new Date()
    },    
    profileImg : { /** 프로필 이미지 */
        type : String,
        default : ""
    },
    phone : { 
        value : { /** 폰번호 */
            type : String,
        },
        agency : { /** 통신사 (SKT, KT, LG+U) */
            type : String
        },
    },
    
})

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel }


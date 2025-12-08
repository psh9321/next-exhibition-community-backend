"use strict"

const path = require("path");
const fs = require("fs");

const { UserModel } = require("../model/user");
const { setToken } = require("../util/token");
const { dataEncrypt } = require("../util/crpyto");
const { ResponseModel } = require("../model/response");
const { dateParser } = require("../util/dateParse");
const { PassWordEncrypt, PassWordCompare } = require("../util/bcrypt");
const { checkDuplicate } = require("../util/checkDuplicate")

/**
 * 로그인
 * @param {string} id 
 * @param {string} pw 
 * @returns {object} {resultCode : number, data : string | object | null, errMsg : string}
 */
async function Login(id, pw){
    
    try {
        const userInfo = await UserModel.findOne({id});

        if(!userInfo) return new ResponseModel(403, null, "가입되지않는 계정입니다.");

        const pwCheck = await PassWordCompare(pw, userInfo["pw"]);

        if(!pwCheck) return new ResponseModel(403, null, "비밀번호를 확인 해주세요.");

        const accessToken = setToken(id);
        const refreshToken = setToken(id, true);

        const objStr = JSON.stringify({
            a : accessToken,
            r : refreshToken
        });
 
        return new ResponseModel(200, dataEncrypt(objStr));
    }
    catch(err) {
        return new ResponseModel(500, err, "알수 없는 에러");
    }
}

/**
 * 아이디 중복체크
 * @param {string} id 유저아이디
 * @returns {object} {resultCode : number, data : string | null, errMsg : string}
 */
async function IdCheck(id) {

    try {

        if(!id) throw "아이디 값이 없습니다.";

        const userInfo = await UserModel.findOne({id});

        if(userInfo) return new ResponseModel(403, null, "이미 가입된 아이디 입니다.");
        
        return new ResponseModel(200, null, "");
    }
    catch(err) {
        throw new ResponseModel(500, err, "idSearch api 알수 없는 에러");
    }
}

/**
 * 아이디 찾기
 * @param {string} name 
 * @param {string} phone 
 * 
 * @returns {object} {resultCode : number, data : string | null, errMsg : string}
 */
async function IdSearch(name, phone) {
    try {
        const userInfo = await UserModel.findOne({
            name,
            "phone.value" : phone

        });
 
        if(!userInfo) return new ResponseModel(403, null, "조회된 정보가 없습니다.");
        
        const result = {
            id : userInfo["id"],
            createDate : dateParser(userInfo["createRegister"])
        }        

        return new ResponseModel(200, result, "");
    }
    catch(err) {
        throw new ResponseModel(500, err, "idSearch api 알수 없는 에러");
    }
}

/** 
 * 이메일 중복체크 
 * @param {string} email 이메일 입력값
 * @returns {object} {resultCode : number, data : string | null, errMsg : string}
 * */
async function EmailCheck(email){
    try {

        const userInfo = await UserModel.findOne(email);

        if(userInfo) return new ResponseModel(403, null, "가입된 이메일 입니다.");

        
        return new ResponseModel(200, null, "");
    }
    catch(err) {
        throw new ResponseModel(500, err, "emailCheck api 알수 없는 에러");
    }
}

/**
 * 폰번호 중복체크
 * @param {string} phone 폰번호 입력값
 * @param {string} agency 통신사 (SKT, KT, LG+U)
 * @returns {object} {resultCode : number, data : string | null, errMsg : string}
 */
async function PhoneCheck(phone, agency) {
    try {

        const userInfo = await UserModel.findOne({
            "phone.value" : phone,
            "phone.agency" : agency
        });

        if(userInfo) return new ResponseModel(403, null, "가입된 폰번호 입니다.");
        
        return new ResponseModel(200, null, "");
    }
    catch(err) {
        throw new ResponseModel(500, err, "emailCheck api 알수 없는 에러");
    }
}

/**
 * 회원가입
 * @param {object} info 
 * @property {string} id 아이디
 * @property {string} pw 비밀번호
 * @property {string} job 직업
 * @property {string} name 이름
 * @property {string} email 이메일
 * @property {string} birth 생년월일 ex) yyyymmdd
 * @property {string} phone 폰번호 ex) 00011112222
 * @property {string} agency 통신사 : SKT, KT, LG U+
 * @property {number} gender 성별 0 : 남, 1 : 여
 * @property {string} nickName 닉네임
 * @property {string} area 거주지역
 * @returns {object} {resultCode : number, data : string | null, errMsg : string}
 */
async function Register(info) {
    try {

        const infoCheck = await checkDuplicate(info);

        if(infoCheck) return new ResponseModel(403, null, `이미 가입된 ${infoCheck} 입니다.`)

        const user = new UserModel({
            ...info, 
            nickName : info["name"],
            pw : PassWordEncrypt(info["pw"]),
            phone: { value : info["phone"], agency : info["phoneAgency"] },
        });

        const userID = user["id"];
 
        /** @type {string} 유저 폴더를 생성할 경로 */
        const BASE_FILE_URL = path.join(__dirname, "..","..",`/${process["env"]["FILE_DIRECTORY_NAME"]}`);
 
        /** 유저 폴더 생성 */
        fs.mkdir(path.join(`${BASE_FILE_URL}`,userID), (err) => {
            if(err) return console.log("folder create Error",err)

            /** 유저 프로필 사진 폴더 생성 */
            fs.mkdir(path.join(`${BASE_FILE_URL}/${userID}`,"profile"), (err2) => {
                if(err2){
                    return console.log("user profile folder create error",err2)
                }
            }), 
    
            /** 유저 포트폴리오 사진 폴더 생성 */
            fs.mkdir(path.join(`${BASE_FILE_URL}/${userID}`,"file"), (err3) => {
                if(err3){
                    return console.log("user file folder create error",err3)
                }
            })
        }); 

        /** 회원정보 저장 */
        user.save();

        return new ResponseModel(200, null, "");
    }
    catch(err) {
        throw new ResponseModel(500, err.message, "register api 알수 없는 에러");
    }
}

/** 
 * 비밀번호 찾기
 * @param {object} param 
 * @property {string} id 아이디
 * @property {string} name 이름
 * @property {string} phone 폰번호
 *  
 * @returns {object} {resultCode : number, data : string | null, errMsg : string}
 */
async function PwSearch(param) {
    try {

        const { id, name, phone } = param;
 
        const userInfo = await UserModel.findOne({
            id : id,
            name : name,
            "phone.value" : phone,
        });

        if(!userInfo) return new ResponseModel(403, null, "일치하는 정보가 없습니다."); 

        return new ResponseModel(200, null, ""); 
    }
    catch(err) {
        throw new ResponseModel(500, err, "PwSearch api 알수 없는 에러"); 
    }
}
/**
 * 비밀번호 변경
 * @param {object} param 
 * @property {string} id 아이디
 * @property {string} newPw 변경할 비밀번호
 * @property {string} email 이메일
 * @property {string} phone 폰번호
 * 
 * @returns {object} {resultCode : number, data : string | null, errMsg : string}
 */
async function PwChange(param) {

    try {
        const { id, newPw, name, phone } = param;

        const userInfo = await UserModel.findOne({
            id : id,
            name : name,
            "phone.value" : phone,
        });
    
        if(!userInfo) return new ResponseModel(403, null, "일치하는 정보가 없습니다.");

        const pwCheck = await PassWordCompare(newPw, userInfo["pw"]);

        if(pwCheck)  return new ResponseModel(403, null, "기존의 비밀번호와 다른 비밀번호로 변경해주세요.");
    
        userInfo["pw"] = PassWordEncrypt(newPw);
    
        userInfo.save();

        return new ResponseModel(200, null, ""); 
    }
    catch(err) {
        throw new ResponseModel(500, err.message, "PwChange api 알수 없는 에러"); 
    }
}

/**
 * 회원 탈퇴
 * @param {string} id 유저 아이디 
 */
async function Withdrawal(id) {
    try {
        const userInfo = await UserModel.findOne({id});

        if(!userInfo) return new ResponseModel(403, null, "일치하는 정보가 없습니다.");

        /** @type {string} 유저 폴더 경로 */
        const BASE_FILE_URL = path.join(__dirname, "..","..",`/${process["env"]["FILE_DIRECTORY_NAME"]}`);

        /** @type {string} 삭제할 폴더 경로 */
        const resultPath = path.join(BASE_FILE_URL, id);

        const deleteResult = await UserModel.deleteOne({id});

        if(deleteResult.deletedCount === 0) {
            return new ResponseModel(403, deleteResult, "회원탈퇴에 실패 했습니다. 잠시후 다시 시도 해주세요.");
        }

        /** 폴더 삭제 */
        if(fs.existsSync(resultPath)) fs.rmSync(resultPath, {recursive : true, force : true});

        return new ResponseModel(200, null, ""); 
    }
    catch(err) {
        throw new ResponseModel(500, err.message, "Withdrawal api 알수 없는 에러"); 
    }
}

module.exports = { 
    Login,
    IdCheck,
    IdSearch,
    EmailCheck,
    PhoneCheck,
    Register,
    PwSearch,
    PwChange,
    Withdrawal
}
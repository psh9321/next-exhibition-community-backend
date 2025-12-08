"use strict"

const { Login, IdCheck, EmailCheck, PhoneCheck, Register, PwSearch, PwChange, Withdrawal, IdSearch } = require("../api/api.account");
const { AuthToken } = require("../middleware/middleware.auth");
const { isDuplicateCalls } = require("../util/isDuplicateCalls");




const router = require("express").Router();

/** 로그인 */
router.post(`/${process["env"]["API_URL_METHOD"]}/account/login`, async (req, res) => {

    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {

        // if(process["env"]["NODE_ENV"] === "production" && req.headers["user-agent"].includes("PostmanRuntime")) return ""

        const { id, pw } = req.body;

        const response = await Login(id, pw);
        
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 회원가입 */
router.post(`/${process["env"]["API_URL_METHOD"]}/account/register`, async (req, res) => {

    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {

        // if(process["env"]["NODE_ENV"] === "production" && req.headers["user-agent"].includes("PostmanRuntime")) return ""

        const data = req.body;

        const response = await Register(data);

        res.status(200).send(response);

    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 아이디 중복 확인 */
router.post(`/${process["env"]["API_URL_METHOD"]}/account/idCheck`, async (req, res) => {

    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {

        const { id } = req.body;

        const response = await IdCheck(id);
        
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
})

/** 아이디 찾기 */
router.post(`/${process["env"]["API_URL_METHOD"]}/account/idSearch`, async (req, res) => {

    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {

        const { name, phone } = req.body;

        const response = await IdSearch(name, phone);
        
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
})

/** 이메일 중복 체크 */
router.post(`/${process["env"]["API_URL_METHOD"]}/account/emailCheck`, async (req, res) => {

    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {

        const { email } = req.body;

        // if(req.headers["user-agent"].includes("PostmanRuntime") && regex_email.test(email)) {
            
        // }
        
        const response = await EmailCheck(email);
        
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 폰번호 중복 체크 */
router.post(`/${process["env"]["API_URL_METHOD"]}/account/phoneCheck`, async (req, res) => {

    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {

        const { phone, agency } = req.body;
        
        const response = await PhoneCheck(phone, agency);
        
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});
 
/** 비밀번호 확인 */
router.post(`/${process["env"]["API_URL_METHOD"]}/account/pwSearch`,  async (req, res) => {

    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {
        
        const data  = req.body;

        const response = await PwSearch(data);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
})

/** 비밀번호 변경 */
router.patch(`/${process["env"]["API_URL_METHOD"]}/account/pwChange`,  async (req, res) => {

    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {
        const data  = req.body;
 
        const response = await PwChange(data);
    
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 회원 탈퇴 */
router.delete(`/${process["env"]["API_URL_METHOD"]}/account/withdrawal`, AuthToken, async (req, res) => {

    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {

        const { id } = req;

        const response = await Withdrawal(id);
    
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
})

module.exports = router;
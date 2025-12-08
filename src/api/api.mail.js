const nodemailer = require("nodemailer");
const { UserModel } = require("../model/user");
const { generateRandomKey } = require("../util/generateRandomCode");
const { ResponseModel } = require("../model/response");

/**
 * 인증메일 보내기
 * @param {string} toUser 메일 받는 사람 주소 
 */
async function AuthEmail(toUser) {

    try {
    
        const userInfo = await UserModel.findOne({ id : toUser });

        if(userInfo) return new ResponseModel(403, null, "이미 가입된 이메일 입니다.");

        const transport = nodemailer.createTransport({
            service : "gmail",
            port : 2953,    
            auth : {
                user : process["env"]["GMAIL_USER"],
                pass : process["env"]["GMAIL_APP_KEY"],
            }
        });

        const authKey = generateRandomKey(6);

        const options = {
            from : process["env"]["GMAIL_USER"],
            to : toUser,
            subject : "회원가입을 위한 인증 메일",
            html : `
                <dl>
                    <dt>아래의 인증번호를 입력해주세요.</dt>
                    <dd>${authKey}</dd>
                </dl>
            `,
        }
    
        await transport.sendMail(options);

        return new ResponseModel(200, authKey);
    }
    catch(err) {
        throw new ResponseModel(500, err, "authEmail api 에서 알수없는 에러");
    }
}

module.exports = {
    AuthEmail,
}
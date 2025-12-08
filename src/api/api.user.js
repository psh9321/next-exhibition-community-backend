const { UserModel } = require("../model/user");
const { ResponseModel } = require("../model/response");

/**
 * 클라이언트로 보낼 유저데이터 
 * @param {object} data 
 * @returns {object}
 */
function UserItem(data){
    const result = {
        id : data["id"],
        name : data["name"],
        nickName : data["nickName"],
        phone : data["phone"]["value"],
        birth : data["birth"],
        gender : data["gender"],
        createDate : data["createRegister"],
        profileImg : data["profileImg"],
        area : data["area"],
        key : data["_id"]
    }

    return result
}

/**
 * 유저 정보 조회
 * @param {string} id user id
 */
async function GetUser(id){

    try {
        const userInfo = await UserModel.findOne({id});

        if(!userInfo) return new ResponseModel(404, null, "조회되지않는 토큰");
    
        const result = UserItem(userInfo);
    
        return new ResponseModel(200, result);
    }
    catch(err) {
       return new ResponseModel(500, err, "GetUser api 에러")
    }
}

/**
 * 유저 데이터 변경
 * @param {string} id 유저 아이디 
 * @param {object} data
 * @property {string} area 지역 
 * @property {string} nickName 닉네임
 * @property {string} profileImg  프로필 이미지
 */
async function SetUser(id, data){
    try {

        const userInfo = await UserModel.findOne({id});

        userInfo["area"] = data["area"];
        userInfo["nickName"] = data["nickName"];
        userInfo["profileImg"] = data["profileImg"];

        userInfo.save();

        const result = UserItem(userInfo);

        return new ResponseModel(200, result);

    }
    catch(err) {
        return new ResponseModel(500, err, "SetUser api 에러")
    }
}

module.exports = {
    GetUser,
    SetUser
}
const { MeetingDataModel, MeetingExhibitionModel } = require("../model/meeting");
const { UserModel } = require("../model/user");
const { ResponseModel } = require("../model/response");
const { dateParser } = require("../util/dateParse");

/**
 * 
 * @param {string} id 유저아이디
 * @returns {object}
 * @property {number} total 약속된 모임 수
 * @property {array} promise 약속된 모임 데이터
 */
async function GetPromiseInfo(id){
    try {
        const searchParams = { "members" : id };

        const [total, promise] = await Promise.all([
            MeetingDataModel.countDocuments(searchParams).exec(),
            MeetingDataModel.find(searchParams)
            .sort({createDate : -1}),
        ]);

        await Promise.all(
            promise.map(async item => {
                const userInfo = await UserModel.findOne({id : item["createUserId"]});
    
                if(!userInfo) return 
    
                item["createUserImg"] = userInfo["profileImg"];
    
                return item
            })
        ) 

        const newData = {
            total, 
            promise,
        };

        return newData
    }
    catch(err) {
        throw err
    }
}

/**
 * 
 * @param {object} queryParams
 * @property {string} offset 페이지 인덱스 번호
  * @property {string} limit 페이지에 보여질 수
 * @property {string?} seq 전시 seq 번호
 * @property {string?} keyword 모임 이름
 * @property {string?} meetingDate 모임 날짜
 */
async function GetMeeting({
    offset = "0",
    limit = "20",
    seq,
    keyword,
    meetingDate
}){
    try {

        const searchParams = {};

        if(seq) searchParams["seq"] = String(seq);
        if(meetingDate) searchParams["date"] = meetingDate;

        if(keyword && keyword.trim() !== "") {
            const searchKeyword = keyword.trim();

            searchParams["$or"] = [
                { title : { "$regex" : searchKeyword, "$options" : "i"} }
            ]
        }

        const [ total, meeting ] = await Promise.all([
            MeetingDataModel.countDocuments(searchParams).exec(),
            MeetingDataModel.find(searchParams)
            .sort({createDate : -1})
            .skip(Number(offset) * Number(limit))
            .limit(Number(limit))
        ]);
        
        const result = {
            total,
            meeting
        }

        return new ResponseModel(200, result);
    }
    catch(err) {
        console.log("err",err)
        throw new ResponseModel(500, err, "GetMeeting api 알수 없는 에러");
    }
}

/**
 * 약속된 모임 가져오기
 * @param {string} id 
 */
async function PromiseMeeting(id){
    try {
        
        const promiseData = await GetPromiseInfo(id)
        
        return new ResponseModel(200, promiseData);
    }
    catch(err) {
        throw new ResponseModel(500, err, "PromiseMeeting api 알수 없는 에러");
    }
}

/**
 * 미팅 상세페이지
 * @param {string} _id mongoDB objectId
 */
async function GetMeetingDetail(_id){
    try {
        const meetingInfo = await MeetingDataModel.findOne({_id});

        if(!meetingInfo) return new ResponseModel(403, null, "모임 정보가 없음");

        const { members } = meetingInfo;

        const membersInfo = [];

        for(let i = 0; i < members.length; i++) {
            const userId = members[i]; 
            const userInfo = await UserModel.findOne({id : userId});

            if(!userInfo) continue

            const { id, nickName, area, gender, profileImg, _id } = userInfo

            membersInfo.push({ id, nickName, area, gender, profileImg, key : _id.toString() });
        }

        return new ResponseModel(200, { meetingInfo, membersInfo });
    }
    catch(err) {
        throw new ResponseModel(500, err, "GetMeetingDetail api 알수 없는 에러");
    }
}

/**
 * 모임이 있는 전시 조회
 * @param {number} offset
 * @param {number} limit
 */
 async function GetMeetingExhibition(offset, limit){
    try {
        const [ total, meetingExhibition ] = await Promise.all([
            MeetingExhibitionModel.countDocuments().exec(),
            MeetingExhibitionModel.find()
            .sort({ exhibitionTitle: 1 })
            .skip(offset * limit)
            .limit(limit)
        ]);

        return new ResponseModel(200, {total, meetingExhibition});
    }
    catch(err) {
        throw new ResponseModel(500, err, "GetMeetingExhibition api 알수 없는 에러");
    }
}

/**
 * 전시 있는 모임 상세 조회
 * @param {string} seq 
 * @param {number} offset 
 * @param {number} limit 
 */
async function GetMeetingExhibitionTargetList(seq, offset, limit){
    try {
        const [ total, meetingTargetList ] = await Promise.all([
            MeetingDataModel.countDocuments({seq}).exec(),
            MeetingDataModel.find({seq})
            .sort({ createDate: -1 })
            .skip(offset * limit)
            .limit(limit)
        ]);

        return new ResponseModel(200, {total, meetingTargetList});
    }
    catch(err) {
        throw new ResponseModel(500, err, "GetMeetingExhibitionTargetList api 알수 없는 에러");
    }
}

async function GetTargetMeetingExhibition(seq){
    try{
        const meetingExhibitionInfo = await MeetingExhibitionModel.findOne({seq});

        if(!meetingExhibitionInfo) return new ResponseModel(403, null, "해당 전시는 모임이 등록되지 않은 전시 입니다.");

        return new ResponseModel(200, meetingExhibitionInfo);
    }
    catch(err) {
        throw new ResponseModel(500, err, "GetTargetMeetingExhibition api 알수 없는 에러");
    }
}

/**
 * 모임 있는 전시 추가
 * @param {string} seq 전시 seq 번호 
 * @param {object} data 
 */
async function SetMeetingExhibition(data){
    try {

        const {
            seq,
            exhibitionTitle,
            exhibitionImg,
            exhibitionStartDate, 
            exhibitionEndDate,
            exhibitionArea, 
            exhibitionPlace, 
            exhibitionPrice, 
            exhibitionType
        } = data;

        const MeetingExhibitionInfo = await MeetingExhibitionModel.findOne({seq : data["seq"]});

        if(!MeetingExhibitionInfo) {
            const MeetingExhibition = new MeetingExhibitionModel({
                seq,
                exhibitionTitle,
                exhibitionImg,
                exhibitionStartDate, 
                exhibitionEndDate,
                exhibitionArea, 
                exhibitionPlace, 
                exhibitionPrice, 
                exhibitionType
            });

            await MeetingExhibition.save();
        }

        return new ResponseModel(200);

    }
    catch(err) {
        return new ResponseModel(500, err, "SetMeetingExhibition api 알수 없는 에러");
    }
}

/**
 * 모임 등록
 * @param {string} id 
 * @param {object} data 
 * @returns 
 */
async function AddMeeting(id, data){
    try {
         
        const userInfo = await UserModel.findOne({id});
        
        const meeting = new MeetingDataModel({
            members : [id],
            createUserId : id,
            createUserImg : userInfo["profileImg"],
            createUserNickName : userInfo["nickName"],
            createUserKey : userInfo["_id"],
            createDate : dateParser(new Date().toString()),
            ...data
        });        

        await meeting.save();

        await SetMeetingExhibition(data);

        const newData = await GetPromiseInfo(id);

        return new ResponseModel(200, newData);
    }
    catch(err) {
        throw new ResponseModel(500, err, "AddMeeting api 알수 없는 에러");
    }
}

/**
 * 모임 삭제
 * @param {string} id 유저 아이디
 * @param {string} _id objId
 * @param {string} _seq 전시 seq
 */
async function DeleteMeeting(id, _id, seq){
    try {

        if(!_id) return ResponseModel(403, seqArr, "_id null");

        return MeetingDataModel({_id}).deleteOne({ _id })
        .then(async () => {

            const meetingTargetTotal = await MeetingDataModel.countDocuments({seq}).exec();

            if(meetingTargetTotal <= 0) await MeetingExhibitionModel.deleteOne({seq});
    
            const newData = await GetPromiseInfo(id)

            return new ResponseModel(200, newData);
        })
        .catch(err => {
            throw new ResponseModel(500, err, "DeleteMeeting api 삭제 실패");  
        })
    }
    catch(err) {
        throw new ResponseModel(500, err, "DeleteMeeting api 알수 없는 에러");  
    }
}

/**
 * 모임 참석
 * @param {string} objId 
 * @param {string} userId 
 */
async function AttendMeeting(userId, objId){
    try {
        const meetingInfo = await MeetingDataModel.findOne({_id : objId});

        if(!meetingInfo) return ResponseModel(403, null, `${objId} : 조회되지않은 모임 또는 삭제된 모임 입니다.`);

        if(meetingInfo["membersTotal"] === meetingInfo["members"].length) return ResponseModel(403, null, `정원 초과`);

        meetingInfo["members"].push(userId);

        await meetingInfo.save();

        const newData = await GetPromiseInfo(userId);

        return new ResponseModel(200, newData);
    }
    catch(err) {
        throw new ResponseModel(500, err, "AttendMeeting api 알수 없는 에러");  
    }
}

/**
 * 모임 참석 취소
 * @param {string} objId 
 * @param {string} userId 
 */
async function CancelMeeting(userId, objId){
    try {
        const meetingInfo = await MeetingDataModel.findOne({_id : objId});

        if(!meetingInfo) return ResponseModel(403, null, `${objId} : 조회되지않은 모임 또는 삭제된 모임 입니다.`);

        const deleteIdx = meetingInfo["members"].findIndex(el => el === userId);

        meetingInfo["members"].splice(deleteIdx, 1);

        await meetingInfo.save();

        const newData = await GetPromiseInfo(userId);

        return new ResponseModel(200, newData);
    }
    catch(err) {
        throw new ResponseModel(500, err, "CancelMeeting api 알수 없는 에러");  
    }
}

/**
 * 모임 수정
 * @param {string} id 
 * @param {object} data 
 * @returns 
 */
 async function UpdateMeeting(id, data){
    try {

        await MeetingDataModel.updateOne(
            { _id : data["_id"]},
            { $set : data }
        );

        const newData = await GetPromiseInfo(id);

        return new ResponseModel(200, newData);
    }
    catch(err) {
        throw new ResponseModel(500, err, "UpdateMeeting api 알수 없는 에러");
    }
}

module.exports = {
    GetMeeting,
    PromiseMeeting,
    GetMeetingDetail,
    AddMeeting,
    DeleteMeeting,
    AttendMeeting,
    CancelMeeting,
    UpdateMeeting,
    GetMeetingExhibition,
    GetMeetingExhibitionTargetList,
    GetTargetMeetingExhibition
}
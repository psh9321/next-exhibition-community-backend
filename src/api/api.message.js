"use strict"

const { ResponseModel } = require("../model/response");

const { UserModel } = require("../model/user");
const { ChattingRoomModel, ChattingModel } = require("../model/Chatting");

const { dateParser } = require("../util/dateParse");

/**
 * 수신인 조회
 * @param {string} _id 
 * @returns 
 */
async function GetAnotherUser(_id){
    try {
        const anotherUserInfo = await UserModel.findOne({_id});
        
        if(!anotherUserInfo) return new ResponseModel(403, null, "유저 정보가 없습니다.");

        const result = {
            area : anotherUserInfo["area"],
            nickName : anotherUserInfo["nickName"]??anotherUserInfo["name"],
            profileImg : anotherUserInfo["profileImg"],
            id : anotherUserInfo["id"]
        }

        return new ResponseModel(200, result);
    }
    catch(err) {
        return new ResponseModel(500, err, "GetAnotherUser api 에러")
    }
}

/**
 * 
 * @param {string} user_id 
 * @param {string} another_id 
 * @returns 
 */
 async function GetTargetRoomInfo(user_id, another_id){
    try {

        const ids = [user_id, another_id];

        const users = {};

        for(const _id of ids) {
            const userInfo = await UserModel.findOne({ _id });

            users[userInfo["_id"]] = {
                id : userInfo["id"],
                profileImg : userInfo["profileImg"],
                nickName : userInfo["nickName"],
            }
        }
 
        const roomInfo = await ChattingRoomModel.findOne({
            ids: { $all: ids }
        });

        const unReadMessage = await ChattingModel.countDocuments({
            ids : {$all : ids},
            isRead : { $nin : [user_id] } 
        });
        
        return {
            roomInfo,
            users,
            unReadMessage
        }
    }
    catch(err) {
        console.log("ee",err)
    }
}

/**
 * 메세지 방 조회
 * @param {string} id 유저 objId
 */
 async function GetMessageRoom(id) {
    try {
        
        const userInfo = await UserModel.findOne({id});

        if(!userInfo) return new ResponseModel(403, null, "유저 정보가 없습니다.");

        const userKey = userInfo["_id"].toString();

        const messageRooms = await ChattingRoomModel.find({
            ids : { $in : [userKey] }
        });

        if(messageRooms.length <= 0) return new ResponseModel(200, []);

        const result = [];
        
        for(let i = 0; i < messageRooms.length; i++) {

            const room = messageRooms[i];

            const reciverId = room["ids"].find(el => el !== userKey);
            
            const roomInfo = await GetTargetRoomInfo(userKey, reciverId);

            result.push(roomInfo)
        }
        
        
        return new ResponseModel(200, result);
    }
    catch(err) {
        console.log("eee",err)
        throw new ResponseModel(500, err.message, "GetMessageRoom api 알수 없는 에러"); 
    }
}


/**
 * 채팅방 생성, 업데이트
 * @param {object} data 
 */
async function SetMessageRoom(data) {
    try {

        const messageRoomInfo = await ChattingRoomModel.findOne({
            ids : {
                $all : [data["senderId"], data["reciverId"]] 
            }
        });

        if(messageRoomInfo) {

            const result = {
                message : data["message"],
                sendDate : dateParser(new Date()),
                isRead : [data["senderId"]],
                sender : data["senderId"],
            }

            messageRoomInfo["lastMessage"] = result;

            await messageRoomInfo.save();

            const updateRoomInfo = await ChattingRoomModel.findOne({
                ids : {
                    $all : [data["senderId"], data["reciverId"]] 
                }
            });

            return updateRoomInfo
        }
        else {
            const messageRoom = new ChattingRoomModel({
                ids : [data["senderId"], data["reciverId"]],
                lastMessage : {
                    message : data["message"],
                    sendDate : dateParser(new Date()),
                    isRead : [data["senderId"]],
                    sender : data["senderId"],
                }
            })
            
            await messageRoom.save();
    
            return messageRoom
        }
    }
    catch(err) {
        throw new ResponseModel(500, err, "SetMessageRoom api 에러")
    }
}

/** 
 * 채팅 메세지 생성
 */
async function AddMessageItem(data, roomKey){
    try {

        const ids = [data["senderId"], data["reciverId"]];
        const currentTime = dateParser(new Date());

        const message = new ChattingModel({
            isRead : [data["senderId"]],
            ids,
            sendDate : currentTime,
            sender : data["senderId"],
            roomKey,
            ...data
        });

        message.save();
 
        return message

    }
    catch(err) {
        throw new ResponseModel(500, err, "AddMessageItem api 에러")
    }
}

/**
 * 채팅방 메세지 불러오기
 * @param {string} id 
 * @param {string} anotherId 
 * @param {number} offset 
 * @param {number} limit
 */
 async function GetMessagesRoomData(id, anotherId, offset = 0, limit = 20){
    try {
        const userInfo = await UserModel.findOne({id});

        if(!userInfo) return new ResponseModel(403, null, "유저 정보가 없습니다.");

        const ids = [userInfo["_id"].toString(), anotherId];

        const queryData = { ids : { $all: ids, $size: ids.length } };
        
        const [ total, message ] = await Promise.all([
            ChattingModel.countDocuments(queryData).exec(),
            ChattingModel.find(queryData)
            .sort({sendDate : -1})
            .skip(offset * limit)
            .limit(limit)
        ]);

        const result = {
            total,
            limit,
            page : offset,
            message : message.reverse(), 
        }
        
        return new ResponseModel(200, result);
    }
    catch(err) {
        throw new ResponseModel(500, err, "GetMessagesRoomData api 에러")
    }
}

async function SetReadMessage(reader_id, sender_id){
    try {

        const readerUserInfo = await UserModel.findOne({ _id : reader_id });
        const senderUserInfo = await UserModel.findOne({ _id : sender_id });
        
        if(!readerUserInfo || !senderUserInfo) return new ResponseModel(403, null, `senderUserInfo : ${senderUserInfo ? true : false}, readerUserInfo : ${readerUserInfo ? true : false} 조회 되지 않은 유저정보`);

        const ids = [reader_id, sender_id];

        const messageItems = await ChattingModel.find({
            ids : { $all : ids },
            sender: sender_id
        });

        const messageItemIds = messageItems.map(el => el._id);

        await ChattingModel.updateMany(
            { _id : { $in : messageItemIds } },
            { $addToSet : { isRead : reader_id }}
        );

        const result = await GetMessageRoom(readerUserInfo["id"])

        return result

    }
    catch(err) {
        throw new ResponseModel(500, err, "GetMessagesRoomData api 에러")
    }
}

module.exports = {
    GetAnotherUser,
    GetMessageRoom,
    SetMessageRoom,
    AddMessageItem,
    GetMessagesRoomData,
    SetReadMessage,
    GetTargetRoomInfo
}
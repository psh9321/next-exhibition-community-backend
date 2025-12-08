"use strict"

const mongoose = require("mongoose");

const ChattingSchema = mongoose.Schema({
    ids : Array, /** 채팅방 참여 유저 objId */
    message : String, /** 매세지 내용 */
    sendDate : Date, /** 발송 시간 */
    isRead : Array, /** 읽음 여부 */
    sender : String, /** 보낸 사람 */
    roomKey : String, /** 채팅방 _id */
})

const ChattingRoomSchema = mongoose.Schema({
    ids : Array, /** 채팅방 참여 유저 objId */
    users : Object,
    /** 마지막 메세지 */
    lastMessage : {
        isRead : Array, /** 읽음 여부 */
        message : String, /** 매세지 내용 */
        sendDate : Date, /** 발송 시간 */
        sender : String, /** 보낸 사람 */
    } 
 })
 
 const ChattingModel = mongoose.model("ChattingItems", ChattingSchema);
 const ChattingRoomModel = mongoose.model("ChattingRooms", ChattingRoomSchema);
 
 module.exports = { ChattingModel, ChattingRoomModel }
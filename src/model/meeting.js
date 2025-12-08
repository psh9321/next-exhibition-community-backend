"use strict"

const mongoose = require("mongoose");

const MeetingDataScheme = mongoose.Schema({
    id : String,
    title : String,
    membersTotal : Number,
    contents : String,
    date : String,
    seq : String,
    createUserId : String,
    createUserImg : String,
    createUserNickName : String,
    createUserKey : String,
    exhibitionImg : String,
    exhibitionTitle : String,
    exhibitionStartDate : String,
    exhibitionEndDate : String,
    members : Array,
    createDate : {
        type : Date,
        default : new Date()
   },
});

const MeetingExhibitionScheme = mongoose.Schema({
    exhibitionImg : String,
    exhibitionTitle : String,
    exhibitionStartDate : String,
    exhibitionEndDate : String,
    exhibitionPlace : String,
    exhibitionArea : String,
    exhibitionPrice : String,
    exhibitionType : String,
    seq : String,
})

const MeetingDataModel = mongoose.model("MeetingData", MeetingDataScheme);
const MeetingExhibitionModel = mongoose.model("MeetingExhibition", MeetingExhibitionScheme);

module.exports = { MeetingDataModel, MeetingExhibitionModel }
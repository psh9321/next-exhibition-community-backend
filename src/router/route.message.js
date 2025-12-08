"use strict"

const { AuthToken } = require("../middleware/middleware.auth");

const { GetMessageRoom, GetAnotherUser, GetMessagesRoomData, SetReadMessage } = require("../api/api.message");

const router = require("express").Router();

/** 수신인 조회 */
router.get(`/${process["env"]["API_URL_METHOD"]}/message/anoter/:_id`, AuthToken, async (req, res) => {
    try {
        
        const { _id } = req.params;
        
        const response = await GetAnotherUser(_id);
 
        res.status(200).send(response)

    }
    catch(err) {
        res.status(500).send(err);
    }
})

/** 메세지방 조회 */
router.get(`/${process["env"]["API_URL_METHOD"]}/message/room`, AuthToken, async (req, res) => {  

    try {

        const { id } = req;

        const response = await GetMessageRoom(id);
 
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

router.get(`/${process["env"]["API_URL_METHOD"]}/message/data/:anotherId`, AuthToken, async (req, res) => {
    try {
        const { id, query, params } = req;

        const { offset, limit } = query;

        const { anotherId } = params;

        const response = await GetMessagesRoomData(id, anotherId, Number(offset??0), Number(limit??0));
         
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

router.get(`/${process["env"]["API_URL_METHOD"]}/message/read/:reader_id/:sender_id`, AuthToken, async (req, res) => {
    try {
        const { reader_id, sender_id } = req.params;

        const response = await SetReadMessage(reader_id, sender_id);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);   
    }
})

module.exports = router;
"use strict"

const { AuthToken } = require("../middleware/middleware.auth");
const { GetMeeting, PromiseMeeting, GetMeetingDetail, AddMeeting, DeleteMeeting, AttendMeeting, CancelMeeting, UpdateMeeting, GetMeetingExhibition, GetMeetingExhibitionTargetList, GetTargetMeetingExhibition } = require("../api/api.meeting");

const router = require("express").Router();

/** 모임 조회 */
router.get(`/${process["env"]["API_URL_METHOD"]}/meeting`, async (req, res) => {
    try {
        const queryParams = req.query;
        
        const response = await GetMeeting(queryParams);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 약속된 모임 조회 */
router.get(`/${process["env"]["API_URL_METHOD"]}/meeting/promise`, AuthToken, async (req, res) => {
    try {
        const { id } = req;

        const response = await PromiseMeeting(id);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 모임 상세페이지 조회 */
router.get(`/${process["env"]["API_URL_METHOD"]}/meeting/detail/:_id`, async (req, res) => {
    try {
        
        const { _id } = req.params;
        
        const response = await GetMeetingDetail(_id);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 모임 등록 */
router.post(`/${process["env"]["API_URL_METHOD"]}/meeting`, AuthToken, async (req, res) => {
    try {
        const { id, body } = req;

        const response = await AddMeeting(id, body);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 모임 삭제 */
router.delete(`/${process["env"]["API_URL_METHOD"]}/meeting/:_id/:seq`, AuthToken, async (req, res) => {
    try {
        const { id } = req;

        const { _id, seq } = req.params;
 
        const response = await DeleteMeeting(id, _id, seq);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 모임 참석 */
router.patch(`/${process["env"]["API_URL_METHOD"]}/meeting/attend/:_id`, AuthToken, async (req, res) => {
    try {
        const { id } = req;

        const { _id } = req.params;

        const response = await AttendMeeting(id, _id);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
})

/** 모임 참석 취소 */
router.patch(`/${process["env"]["API_URL_METHOD"]}/meeting/cancel/:_id`, AuthToken, async (req, res) => {
    try {
        const { id } = req;

        const { _id } = req.params;

        const response = await CancelMeeting(id, _id);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 등록된 모임 수정 */
router.patch(`/${process["env"]["API_URL_METHOD"]}/meeting`, AuthToken, async (req, res) => {
    try {
        const { id, body } = req;

        const response = await UpdateMeeting(id, body);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

router.get(`/${process["env"]["API_URL_METHOD"]}/meeting/exhibition`, async (req, res) => {
    try {
        const { offset, limit } = req.query;

        const response = await GetMeetingExhibition(Number(offset??0), Number(limit??20));

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

router.get(`/${process["env"]["API_URL_METHOD"]}/meeting/exhibition/:_req`, async (req, res) => {

    try {
        const { offset, limit } = req.query;

        const { _req } = req.params;
    
        const response = await GetMeetingExhibitionTargetList(_req, Number(offset??0), Number(limit??0));
    
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
})

router.get(`/${process["env"]["API_URL_METHOD"]}/meeting/exhibition/target/:_req`, async (req, res) => {

    try {

        const { _req } = req.params;
    
        const response = await GetTargetMeetingExhibition(_req);
    
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
})


module.exports = router
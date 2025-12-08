"use strict"

const { FileUpload, ProfileUpload } = require("../api/api.files");
const { AuthToken } = require("../middleware/middleware.auth");

const router = require("express").Router();

router.post(`/${process["env"]["API_URL_METHOD"]}/files`, AuthToken, async (req, res) => {
    try {
        /** @type {File[]} */
        const { files : { filesData }, id } = req;

        const response = await FileUpload(id, filesData);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

router.post(`/${process["env"]["API_URL_METHOD"]}/files/profileImg`, AuthToken, async (req, res) => {
    try {
        
        const { id } = req;

        /** @type {File[]} */
        const { files : { filesData } } = req;

        const response = await ProfileUpload(id, filesData);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router
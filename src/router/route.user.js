"use strict"

const { GetUser, SetUser, GetReciverUser } = require("../api/api.user");
const { AuthToken } = require("../middleware/middleware.auth");

const router = require("express").Router();

router.get(`/${process["env"]["API_URL_METHOD"]}/user`, AuthToken, async (req, res) => {
    try {
        const { id } = req;

        const response = await GetUser(id);

        res.status(200).send(response)

    }
    catch(err) {
        res.status(500).send(err);
    }
})

router.patch(`/${process["env"]["API_URL_METHOD"]}/user`, AuthToken, async (req, res) => {
    try {
        const { id, body } = req;

        const response = await SetUser(id, body);

        res.status(200).send(response)
    }
    catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router
"use strict"

const { AuthToken } = require("../middleware/middleware.auth");
const { GetFavorite, AddFavorite, RemoveFavorite } = require("../api/api.favorite");

const router = require("express").Router();

/** 좋아요 한 전시 조회 */
router.get(`/${process["env"]["API_URL_METHOD"]}/favorite`, AuthToken, async (req, res) => {
    try {
        const { id } = req;

        const response = await GetFavorite(id);

        res.status(200).send(response)

    }
    catch(err) {
        res.status(500).send(err);
    }
});

/** 좋아요 한 전시 등록 */
router.post(`/${process["env"]["API_URL_METHOD"]}/favorite`, AuthToken, async (req, res) => {
    try {
        const { id, body } = req;

        const response = await AddFavorite(id, body);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
})

/** 좋아요 한 전시 제거 */
router.delete(`/${process["env"]["API_URL_METHOD"]}/favorite`, AuthToken, async (req, res) => {
    try {
        
        const { id, body } = req;

        const response = await RemoveFavorite(id, body);

        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
})
 
module.exports = router
"use strict"

const { AuthToken } = require("../middleware/middleware.auth");

const router = require("express").Router();

router.get(`/${process["env"]["API_URL_METHOD"]}/verify/token`, AuthToken, async (req, res) => {    
    try {

        res.status(200).send({
            resultCode : 200,
            data : null,
            errMsg : ""
        })
    }
    catch(err) {
        res.status(500).send(err);
    }    
});


module.exports = router
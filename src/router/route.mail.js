"use strict"

const { AuthEmail } = require("../api/api.mail");
const { isDuplicateCalls } = require("../util/isDuplicateCalls");
const router = require("express").Router();

router.post(`/${process["env"]["API_URL_METHOD"]}/mail/auth`, async (req, res) => {  
    
    // const isReturn = isDuplicateCalls(req);
    // if(isReturn) return;

    try {
        
        const { user } = req.body;

        const response = await AuthEmail(user);
 
        res.status(200).send(response);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router;
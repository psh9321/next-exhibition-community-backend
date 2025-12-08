/**
 * 운영에서 호출 방지
 * @param {request} req 
 * @returns {boolean} true : api 호출 중지하고 return 으로 흘리기
 */
function isDuplicateCalls(req) {

    if(!req || !req.headers || !req.headers["user-agent"]) return true
    if(process["env"]["NODE_ENV"] === "production" && req.headers["user-agent"].includes("PostmanRuntime")) return true

    return false
}

module.exports = {
    isDuplicateCalls
}
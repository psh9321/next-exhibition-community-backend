/**
 * 랜덤 키 생성
 * @param {number} n 키의 글자수 
 * @returns {string}
 */
function generateRandomKey(n) {
    let str = '';
    for (let i = 0; i < n; i++) {
        str += Math.floor(Math.random() * 10);
    }
    return str;
}

module.exports = { generateRandomKey }
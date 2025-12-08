/**
 * 
 * @param {string | number} param 숫자 문자열이 10 이하의 수 일경우 0을 붙여 리턴함
 */
function mergeToZeroStr(param) {

    if(typeof param === "number") param = String(param);

    return param.length < 2 ? `0${param}` : param
}

/**
 * 
 * @param {Date} dateStr 
 * @returns {string} "yyyy.mm.dd hh:mm:ss"
 */
function dateParser(dateStr) {
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = mergeToZeroStr(date.getMonth()+1);
    const day = mergeToZeroStr(date.getDate());

    const hours = mergeToZeroStr(date.getHours());
    const minutes = mergeToZeroStr(date.getMinutes());
    const second = mergeToZeroStr(date.getSeconds());

    return `${year}.${month}.${day} ${hours}:${minutes}:${second}`;
}

module.exports = {dateParser}
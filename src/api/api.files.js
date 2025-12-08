const path = require("path");
const fs = require("fs");
const { v4 } = require("uuid");
const { UserModel } = require("../model/user");
const { ResponseModel } = require("../model/response");

const util = require("util");


/**
 * 유저 파일 폴더 경로를 리턴
 * @param {string} id 
 * @param {string} type profile, file 
 * @param {string | undefined} fileName 
 * @returns {string} file path
 */
function GetUserDirectoryPath(id){
    const _path = path.join(__dirname, "../..", process.env.FILE_DIRECTORY_NAME, id);

    return _path;
}

function DirectoryInquiry(path){
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if(err) reject(err)
            else resolve(files)
        })
    })    
}

/**
 * 
 * @param {File} file 
 * 
 * @returns {object} 
 * @property {string} fileName 변환된 파일 이름
 * @property {string} originName 파일 원본 이름
 * @property {string} type 파일 타입
 */
function FileToItem(file){
    const parseName = Buffer.from(file["name"],"latin1").toString("utf8");

    /** @type {string} 새로 생성한 파일 이름 */
    const fileName = v4() + new Date().getTime()+path.extname(parseName);

    return {
        fileName,
        originName : parseName,
        type : file["mimetype"],
    }
}
/**
 * 
 * @param { string } id 
 * @param { File[] | File } files 
 */
async function FileUpload(id, files){    
    try {
        if(!id || !files) return new ResponseModel(403, null, "id, files null");

        /** @type {string} 유저 파일 폴더 경로 */
        const BASE_FILE_DIRECTORY_URL = path.join(__dirname, "../..", process.env.FILE_DIRECTORY_NAME, id);

        const responseData = [];

        if(Array.isArray(files)) {

            for(let  i = 0; i < files.length; i++){
                const file = files[i];
    
                const item = FileToItem(file);

                /** @type {string} 파일의 최종 경로 */
                const saveFilePath = path.join(BASE_FILE_DIRECTORY_URL, item["fileName"]);

                const obj = {
                    id,
                    ...item
                }

                const promiseResponseData = new Promise((resolve) => {
                    file.mv(saveFilePath, err => {

                        if(err) {
                            resolve({
                                isFail : true,
                                ...obj
                            });
                        }
                        else {
                            resolve(obj);
                        }
                    })
                })

                responseData.push(await promiseResponseData);    
            }

            return new ResponseModel(200, responseData)
        }
        /** 단일 객체 */
        else {
            const item = FileToItem(files);

            /** @type {string} 파일의 최종 경로 */
            const saveFilePath = path.join(BASE_FILE_DIRECTORY_URL, item["fileName"]);

            const obj = {
                id,
                ...item
            }

            const promiseResponseData = new Promise((resolve) => {
                files.mv(saveFilePath, err => {

                    if(err) {
                        resolve({
                            isFail : true,
                            ...obj
                        });
                    }
                    else {
                        resolve(obj);
                    }
                })
            })

            responseData.push(await promiseResponseData);  

            return new ResponseModel(200, responseData)
        }

    }
    catch(err) {
        throw new ResponseModel(500, err, "FileUpload api 에서 알수없는 에러");
    }
}

async function ProfileUpload(id, file) {
    try {
        if(!id || !file) return new ResponseModel(403, null, "id, file null");
    
        const userDirectoryPath = path.join(GetUserDirectoryPath(id), "profile");

        const beforeImgs = await DirectoryInquiry(userDirectoryPath);
        
        
        if(beforeImgs.length > 0) {

            for(let i = 0; i < beforeImgs.length; i++) {
                const deletePath = path.join(userDirectoryPath, beforeImgs[i]);
                await fs.unlinkSync(deletePath);
            }
        }

        

        const item = FileToItem(file);

        const resultPath = path.join(userDirectoryPath, item["fileName"])

        return new Promise((resolve) => {
            file.mv(resultPath, (err) => {
                if(err) return resolve(new ResponseModel(403, err, "파일업로드 실패"));
    
                resolve(new ResponseModel(200, {...item, id}))
            })
        })
    }
    catch(err) {
        console.log(err,"err")
    }
}

module.exports = {
    FileUpload,
    ProfileUpload
}
const { UserModel } = require("../model/user");
const { FavoriteModel } = require("../model/favorite")
const { ResponseModel } = require("../model/response");

async function FavoriteInfoData(id) {
    const [favorite, total] = await Promise.all([
        await FavoriteModel.find({ id }),
        FavoriteModel.countDocuments({id}).exec(),
    ]);

    // const seqResultArr = Array.from(seqArr, item => item.seq);

    const result = {
        favorite,
        total
    }

    return result
}

/**
 * 좋아요 한 전시 조회
 * @param {string} id 유저 아이디
 * @returns {array}
 */
async function GetFavorite(id){
    try {

        const [ total, favorite ] = await Promise.all([
            FavoriteModel.countDocuments({id}).exec(),
            FavoriteModel.find({id})
            .sort({favoriteDate : -1}) /** 내림차순 정렬 */
        ]);

        const result = {
            total,
            favorite
        }

        return new ResponseModel(200, result);

    }
    catch(err) {
        throw new ResponseModel(500, err, "GetFavorite api 알수 없는 에러");
    }
}

/**
 * 좋아요 한 전시 등록
 * @param {string} id 
 * @param {object} data 
 */
async function AddFavorite(id, data){
    try {
        const favorite = new FavoriteModel({
            id,
            ...data
        });

        await favorite.save();

        const newData = await FavoriteInfoData(id);

        return new ResponseModel(200, newData);
    }
    catch(err) {
        throw new ResponseModel(500, err, "AddFavorite api 알수 없는 에러");
    }
}

async function RemoveFavorite(id, seqArr){
    try {
        if(seqArr.length <= 0) return ResponseModel(403, seqArr, "seqArr.length <= 0");
        
        return FavoriteModel.deleteMany({seq : {$in : seqArr }})
        .then( async ({ acknowledged, deletedCount }) => {
            /**
             * acknowledged: boolean,  작업이 성공적으로 수행되었음을 나타냄
             * deletedCount: number 삭제된 문서의 수 
             */
            
             const newData = await FavoriteInfoData(id);

             return new ResponseModel(200, newData);

        })
        .catch(err => {
            throw new ResponseModel(500, err, "RemoveFavorite api 삭제 실패");  
        })
        
    }
    catch(err) {
        throw new ResponseModel(500, err, "RemoveFavorite api 알수 없는 에러");  
    }
}

module.exports = {
    AddFavorite,
    GetFavorite,
    RemoveFavorite,
}
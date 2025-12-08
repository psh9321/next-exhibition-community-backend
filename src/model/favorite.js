"use strict"

const mongoose = require("mongoose");

const FavoriteSchema = mongoose.Schema({
   id : String, /** 유저 아이디 */
   seq: String, /** ex) 311142 */
   serviceName: String , /** ex) 공연/전시 */
   title: String,  /** ex) 창작의 순간 - 예술가의 작업실 */
   startDate: String, /** ex) 20250214 */
   endDate: String, /** ex) 20250214 */
   place: String, /** ex) 국립현대미술관 서울관 */
   realmName: String, /** ex) 전시 */
   area: String, /** ex) 서울, 경기 ... */
   thumbnail: String, /** image src url */
   gpsX: String, /** ex) 126.98010361777375 */
   gpsY: String, /** ex) 37.578627490528596 */

   favoriteDate : {
        type : Date,
        default : new Date()
   }
})

const FavoriteModel = mongoose.model("Favorite", FavoriteSchema);

module.exports = { FavoriteModel }
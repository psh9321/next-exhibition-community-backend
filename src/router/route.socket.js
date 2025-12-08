const { SetMessageRoom, AddMessageItem, GetTargetRoomInfo } = require("../api/api.message");



module.exports = (io) => {
    io.on("connection",(socket) => {
            
        // const { socketId } = socket.handshake.query;

        socket.on("key of connect",(_id) => {  
            socket.join(_id);
        });

        socket.on("key of disconnect",(_id) => {  
            socket.leave(_id);
        });

        // socket.onAny((event, ...args) => {
        //     console.log("📢 모든 수신 이벤트:", event, args);
        //   });

        socket.on("sendMessage", async (data) => {
            const messageRoom = await SetMessageRoom(data);

            await AddMessageItem(data, messageRoom["_id"]);
            
            const messageRoomInfo = await GetTargetRoomInfo(data["senderId"], data["reciverId"]);
            
            io.to(data["reciverId"]).emit("reciveMessage", messageRoomInfo);
        })
    })
}
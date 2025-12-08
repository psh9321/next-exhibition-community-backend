const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

/** 환경변수 셋팅 */
dotenv.config();

const app = express();

app.use(bodyParser.json({limit:"10000mb"}));
app.use(bodyParser.urlencoded({limit:"100mb",extended:true}));

const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use("/public", express.static("public"));

/** process.env.NODE_ENV : production : 운영 */
const isProduction = process["env"]["NODE_ENV"] === "production";

const port = process["env"][isProduction ? "PRODUCTION_PORT" : "DEVELOPEMENT_PORT"];

const ROUTE_API_ACCOUNT = require(isProduction ? "./src_dist/router/route.account" : `./src/router/route.account`);
const ROUTE_API_AUTH = require(isProduction ? "./src_dist/router/route.auth" : "./src/router/route.auth");
const ROUTE_API_MAIL = require(isProduction ? "./src_dist/router/route.mail" : "./src/router/route.mail");
const ROUTE_API_FILES = require(isProduction ? "./src_dist/router/route.files" : "./src/router/route.files");
const ROUTER_API_USER = require(isProduction ? "./src_dist/router/route.user" : "./src/router/route.user");
const ROUTER_API_FAVORITE = require(isProduction ? "./src_dist/router/route.favorite" : "./src/router/route.favorite");
const ROUTER_API_MEETING = require(isProduction ? "./src_dist/router/route.meeting" : "./src/router/route.meeting");
const ROUTER_API_MESSAGE = require(isProduction ? "./src_dist/router/route.message" : "./src/router/route.message");
const ROUTER_SOCKET = require(isProduction ? "./src_dist/router/route.socket" : "./src/router/route.socket");
 
// app.use(cors({
//   origin : "*",
//   credentials : true
// }));

app.get("/health",(req, res) => {
    res.status(200).send("success health check")
});

app.use(cors({
    origin : process["env"][isProduction ? "PRODUCTION_CORS_ORIGIN" : "DEVELOPEMENT_CORS_ORIGIN"],
    credentials : true
}));


const http = require("http");

const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors : {
        origin : process["env"]["SOCKET_CORS_ORIGIN"],
        methods : ["get","post"]
    }
});

app.use(ROUTE_API_ACCOUNT);
app.use(ROUTE_API_AUTH);
app.use(ROUTE_API_FILES);
app.use(ROUTE_API_MAIL);
app.use(ROUTER_API_USER);
app.use(ROUTER_API_FAVORITE);
app.use(ROUTER_API_MEETING);
app.use(ROUTER_API_MESSAGE);
ROUTER_SOCKET(io);

mongoose.connect(process.env.CONNECT_URL)
.then(() => {
    server.listen(port, () => {
     
        console.log(`connect port=${port} ${new Date()}`);
    })
})


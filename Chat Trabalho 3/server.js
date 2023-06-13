"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const users = {};
const connections = [];
app.use(express_1.default.static(__dirname));
function getUsernames() {
    return Object.values(users).map((socket) => socket.id || "Unknown");
}
server.listen(3000);
app.get("/", function (req, resp) {
    resp.sendFile(__dirname + "/index.html");
});
io.sockets.on("connection", function (socket) {
    connections.push(socket);
    users[socket.id] = socket;
    console.log("Connected : %s socket connected", connections.length);
    socket.on("disconnect", function (data) {
        connections.splice(connections.indexOf(socket), 1);
        delete users[socket.id];
        console.log("Disconnected : %s socket connected", connections.length);
    });
    socket.on("send message", function (data) {
        console.log(data);
        const username = socket.id;
        const messageData = {
            username: username,
            msg: data,
        };
        io.sockets.emit("new message", messageData);
    });
});
console.log('server is listening');

import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users: { [key: string]: Socket } = {};
const connections: Socket[] = [];

app.use(express.static(__dirname));

server.listen(3000);

app.get("/", function (req, resp) {
  resp.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", function (socket: Socket) {
  connections.push(socket);
  users[socket.id] = socket; //pega o id do socket conectado, utilizado para reconhecer de quem vem as mensagens
  console.log("Connected : %s socket connected", connections.length);


  socket.on("disconnect", function (data) {
    connections.splice(connections.indexOf(socket), 1);
    delete users[socket.id]; //tira o id do socket da lista
    console.log("Disconnected : %s socket connected", connections.length);
  });

  socket.on("send message", function (data) {
    console.log(data);
    const username = socket.id; //recebe a mensagem e envia ela com o id usuario que enviou originalmente 
    const messageData = { 
      username: username,
      msg: data,
    };
    io.sockets.emit("new message", messageData);
  });

});

console.log('server is listening');
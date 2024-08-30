import express from "express";
import { Server } from "socket.io";
import http from "node:http";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`Connection established with ${socket.id}`);
  let username = "";

  socket.once("username", (name) => {
    username = name;
    console.log(`User logged on: ${username} (${socket.id})`);
  });

  socket.once("message", (message) => {
    io.emit("message", { message, username });
    console.log(`Message sent by ${username} (${socket.id}): ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`${username} (${socket.id}) disconnected`);
  });
});

const port = 3000 || process.env.DAWOOD_CHAT_PORT;

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

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
    io.emit("log", `${username} joined the chat!`);
    console.log(`User logged on: ${username} (${socket.id})`);
  });

  socket.on("message", (message) => {
    io.emit("message", { message, username });
    console.log(`Message sent by ${username} (${socket.id}): ${message}`);
  });

  socket.once("disconnect", () => {
    io.emit("log", `${username} left the chat.`);
    console.log(`${username} (${socket.id}) disconnected`);
  });
});

const port = process.env.DAWOODS_CHAT_PORT || 3000;

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

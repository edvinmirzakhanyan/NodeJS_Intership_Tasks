const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("new user connected");

    socket.emit("welcomeMessage", "Welcome to real-time chat");

    socket.on("newMessage", (message) => {
        console.log(message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    })
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
  });
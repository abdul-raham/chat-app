const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change to your frontend URL
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {}; // Stores online users

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Track user when they join
  socket.on("userConnected", (userData) => {
    onlineUsers[socket.id] = userData;
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  // Broadcast received messages
  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  // Typing indicator
  socket.on("userTyping", (userId) => {
    socket.broadcast.emit("userTyping", userId);
  });

  // Remove user when they disconnect
  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("onlineUsers", Object.values(onlineUsers));
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});

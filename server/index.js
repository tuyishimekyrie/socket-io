const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5174",
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("message", (message) => {
    console.log(`Message from ${socket.id}: ${message.content}`);
    socket.broadcast.emit("message", message); // Broadcast the message to all clients except the sender
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});

const express = require("express");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const http = require("http"); // For creating the HTTP server
const { Server } = require("socket.io"); // Import Socket.IO
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://mydevtinder.netlify.app",
    ],
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mydevtinder.netlify.app"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);

//all Routes

app.use("/auth", require("./src/routes/authRoute"));
app.use("/message", require("./src/routes/messageRoute"));
app.use("/request", require("./src/routes/friendRequestRoute"));
app.use("/search", require("./src/routes/searchFriendRoute"));

//first connect to db then start listening to api calls
connectDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(PORT, () => {
      console.log("server working at " + PORT);
    });
  })
  .catch((err) => {
    console.log("database connection error", err);
  });

// Socket.IO configuration
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join room
  socket.on("joinRoom", (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room: ${roomID}`);
  });

  // Listen for chat messages and emit only to the room
  socket.on("sendMessage", (message) => {
    // console.log("Message received:", message);
    const roomID = message.conversationID;

    if (roomID) {
      // Emit message only to users in the same room
      io.to(roomID).emit("receiveMessage", message);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.get("/health", async (req, res) => {
  res.status(200).send("working fine 🔥🔥");
});

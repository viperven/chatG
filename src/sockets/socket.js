const socket = require("socket.io");
const crypto = require("crypto");
const FriendRequestModel = require("../models/friendsRequest");

const getSecretRoomId = (userId, targetUserId) => {
  //to ger encrypter roomid to join
  return crypto.createHash("sha256").update([userId, targetUserId].sort().join("$")).digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("connection start");

    socket.on("joinRoom", async ({ firstName, userId, targetUserId }) => {
      console.log(firstName, userId, targetUserId);

      const isFriends = await FriendRequestModel.findOne({
        $or: [
          { senderId: userId, receiverId: targetUserId, status: "accepted" },
          { senderId: targetUserId, receiverId: userId, status: "accepted" },
        ],
      });

      if (!isFriends) {
        socket.emit("unauthorizedJoin", { error: "Invalid users. Not friends." });
        return;
      }

      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      // Save messages to the database
      try {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(firstName + " " + text);

        io.to(roomId).emit("messageReceived", { firstName, lastName, text });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;

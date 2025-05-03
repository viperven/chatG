const mongoose = require("mongoose");

const lastMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
      required: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const users = mongoose.model("lastMessage", lastMessageSchema);

lastMessageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });

module.exports = users;

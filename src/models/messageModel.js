const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema(
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
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
    },
    content: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },
  },
  { timestamps: true }
);

const message = mongoose.model("message", messageSchema);

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 }); // Private
messageSchema.index({ groupId: 1, createdAt: -1 }); // Group


module.exports = message;

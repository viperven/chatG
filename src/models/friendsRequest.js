const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "blocked"],
      default: "pending",
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

friendRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

module.exports = mongoose.model("friendRequest", friendRequestSchema);

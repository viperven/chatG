//validation check sender and receiver should be valid and should be friends and status should be accepted
//insert message in messageModel , update last message model
// for last message check if last message exists in db then update that document if not then create a new one
//also when updating last message increase unread count by 1

const MessageModel = require("../models/messageModel");
const UserModel = require("../models/userModel");
const LastMessageModel = require("../models/lastMessageModel");
const friendsRequestModel = require("../models/friendsRequest");

const { validateSendMessage } = require("../validation/validate");

const sendMessage = async (req, res) => {
  try {
    validateSendMessage(req);

    const { receiverId, content, media, mediaType } = req.body;
    const senderId = req.user.id;

    const isReceiverFriend = await friendsRequestModel.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (!isReceiverFriend) {
      return res.status(400).json({
        isSuccess: false,
        message: "You are not friends with this user.",
      });
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      content,
      media,
      mediaType,
    });

    await newMessage.save();

    const isLastMessageExists = await LastMessageModel.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (isLastMessageExists) {
      await LastMessageModel.updateOne(
        { _id: isLastMessageExists._id },
        {
          $set: { lastMessageId: newMessage._id },
          $inc: { unreadCount: 1 },
        }
      );
    } else {
      await LastMessageModel.create({
        senderId,
        receiverId,
        lastMessageId: newMessage._id,
        unreadCount: 1,
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.log(err?.message);

    if (err.statusCode === 400) {
      return res.status(err.statusCode).json({
        isSuccess: false,
        message: err.message,
        field: err.field, // Optionally include the problematic field
      });
    }

    res.status(500).json({
      isSuccess: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  sendMessage,
};

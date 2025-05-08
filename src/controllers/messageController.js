const MessageModel = require("../models/messageModel");
const LastMessageModel = require("../models/lastMessageModel");
const FriendsRequestModel = require("../models/friendsRequest");

const { validateSendMessage, validateGetAllMessages } = require("../validation/validate");

// validation check sender and receiver should be valid and should be friends and status should be accepted
// insert message in messageModel , update last message model
// if sending first message then create entry in friendrequestmodel with status pending
// for last message check if last message exists in db then update that document if not then create a new one
// also when updating last message increase unread count by 1
// cant send message to ourself

const sendMessage = async (req, res) => {
  try {
    validateSendMessage(req);

    const { receiverId, content, mediaType } = req.body;
    const senderId = req.user.id;

    if (receiverId == senderId) {
      //can't send message to our self
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid ! sender and receiver id cant be same  .",
      });
    }

    const isReceiverFriend = await FriendsRequestModel.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId, status: "pending" },
        { senderId: receiverId, receiverId: senderId, status: "pending" },
      ],
    });

    let newMessage;
    if (!isReceiverFriend) {
      //first message is for first time create a entry in friend request with status pending
      const saveFirstMessage = await FriendsRequestModel.create({ senderId, receiverId, status: "pending" });

      newMessage = new MessageModel({ senderId, receiverId, content, mediaType });
      await newMessage.save();
    }
    if (isReceiverFriend?.status == "pending") {
      //if friend request is in pending state means 1 message is already send then return
      return res.status(400).json({
        isSuccess: false,
        message: "you have already sended a message and receiver has not accepted your message yet .",
      });
    }
    if (isReceiverFriend?.status == "rejected") {
      return res.status(400).json({
        isSuccess: false,
        message: "Sorry , User Has rejected Your , Request You can't Send any further messages .",
      });
    }
    if (isReceiverFriend?.status == "blocked") {
      return res.status(400).json({
        isSuccess: false,
        message: "Sorry , User Has Blocked You , You can't Send any further messages .",
      });
    }

    if (isReceiverFriend?.status == "accepted") {
      newMessage = new MessageModel({ senderId, receiverId, content, mediaType });
      await newMessage.save();
    }

    const isLastMessageExists = await LastMessageModel.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    console.log(senderId, receiverId, "..........");

    console.log(isLastMessageExists, "isLastMessageExists");

    if (isLastMessageExists) {
      await LastMessageModel.updateOne(
        { _id: isLastMessageExists._id },
        {
          $set: { lastMessageId: newMessage?._id },
          $inc: { unreadCount: 1 },
        }
      );
    } else {
      await LastMessageModel.create({ senderId, receiverId, lastMessageId: newMessage._id, unreadCount: 1 });
    }

    res.status(200).json({ isSuccess: true, message: "Message sent successfully", data: newMessage });
  } catch (err) {
    console.log(err?.message);

    if (err.statusCode === 400) {
      return res.status(err.statusCode).json({
        isSuccess: false,
        message: err.message,
        field: err.field,
      });
    }

    res.status(500).json({
      isSuccess: false,
      message: "Server error. Please try again later.",
    });
  }
};

// validation check senderid is valid as i am receiver id , sender and receiver should be friends and status should  be accepted
// find all messages between sender and receiver from message collection by or condtion use limit and skip for pagination
// also check if last message exists in db then decerement the count
// and update the last message model with the last message id and unread count 0

const getAllMessages = async (req, res) => {
  try {
    validateGetAllMessages(req);

    const { senderId, limit = 20, page = 1 } = req.query;
    const receiverId = req.user.id;

    if (receiverId == senderId) {
      //can't send message to our self
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid ! sender and receiver id cant be same .",
      });
    }

    const isReceiverFriend = await FriendsRequestModel.findOne({
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

    // if status block or rejected send back if pending or accepted continue
    // if in pending we are allowing to send only one meesage from send message

    if (isReceiverFriend.status == "blocked" || isReceiverFriend.status == "rejected") {
      return res.status(400).json({
        isSuccess: false,
        message: "Sorry Can't get message either you have blocked or rejected by user .",
        Data: { db_status: isReceiverFriend.status },
      });
    }

    const getAllMessages = await MessageModel.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ isSuccess: true, message: "Message fetched successfully", data: getAllMessages });
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
  getAllMessages,
};

//validation check send and receiver should be

const mongoose = require("mongoose");

const { validateAceptOrDeclineFriendRequest } = require("../validation/validate");

const UserModel = require("../models/userModel");
const FriendModel = require("../models/friendsRequest");

// anyone can send message only one message and receiver will get popup to accept or not if not notified to user

// check validation : proper _id [receiver id], receiver id should exists ,
// sender and receiver should not be friend or in pending state so just check entry in friendrequest collection
// update status in friend request either accepted or rejected
// can't accept or reject own request

const acceptOrDeclineFriendRequest = async (req,res) => {
  try {
    validateAceptOrDeclineFriendRequest(req);

    const { senderId, status } = req.body;
    const receiverId = req.user.id; //logged in user
    let id = new mongoose.Types.ObjectId(senderId);

    if (receiverId == senderId) {
      //can't send message to our self
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid ! sender and receiver id cant be same ",
      });
    }

    const isUserExists = await UserModel.findById(id);
    if (!isUserExists) {
      return res.status(400).json({
        isSuccess: false,
        message: "receiver id does not exist.",
      });
    }

    const isUserSendedMessage = await FriendModel.findOne(
      {
        senderId: senderId,
        receiverId: receiverId,
        status: "pending",
      },
      { status: status }
    );

    if (!isUserSendedMessage) {
      return res.status(400).json({
        isSuccess: false,
        message: "user have not initiated any message , so you can send your first message to user : " + isUserSendedMessage?.status,
      });
    }

    //i am logged in and getting option to accept or reject means
    // i am reciever and another person has send message to logged in user means he is sender
    const saveUserStatus = await FriendModel.updateOne(
      {
        senderId: senderId,
        receiverId: receiverId,
        status: "pending",
      },
      { status: status },
      { new: true }
    );

    res.status(200).json({
      isSuccess: true,
      message: "sucessfully set Status : " + status,
      data: saveUserStatus,
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
  acceptOrDeclineFriendRequest,
};

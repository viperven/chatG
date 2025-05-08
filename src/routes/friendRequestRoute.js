const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const { acceptOrDeclineFriendRequest } = require("../controllers/friendRequestController");


router.post("/accept-decline", userAuth, acceptOrDeclineFriendRequest);


module.exports = router;

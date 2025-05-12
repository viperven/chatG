const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const { searchFriends } = require("../controllers/searchFriendController");


router.get("/friend", userAuth, searchFriends);

module.exports = router;

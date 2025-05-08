const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const { getAllMessages, sendMessage } = require("../controllers/messageController");

router.post("/send-message", userAuth, sendMessage);
router.get("/get-all-messages", userAuth, getAllMessages);

module.exports = router;

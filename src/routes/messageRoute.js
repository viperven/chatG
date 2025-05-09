const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const { getAllMessages, sendMessage, deleteMessage } = require("../controllers/messageController");

router.post("/send-message", userAuth, sendMessage);
router.get("/get-all-messages", userAuth, getAllMessages);
router.post("/delete-message", userAuth, deleteMessage);

module.exports = router;

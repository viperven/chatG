const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");

router.post("/send-message", userAuth, sendMessage);

module.exports = router;

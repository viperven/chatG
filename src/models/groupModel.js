const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  memberIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    required: true,
  },
},{timestamps: true});

const users = mongoose.model("group", groupSchema);

module.exports = users;

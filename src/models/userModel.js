const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  age: {
    type: Number,
    required: true,
    min: 8,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  address: {
    type: String,
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  groups: {
    type: [mongoose.Schema.Types.ObjectId],
  },
},{timestamps: true});

const users = mongoose.model("user", userSchema);

userSchema.index({ gmail: 1 }, { unique: true });

module.exports = users;

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const handleDuplicateKeyError = require("../helper/errorValidations");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
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
  },
  { timestamps: true }
);



userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateAuthToken = async function () {
  return await jwt.sign(
    {
      id: this._id,
      email: this.emailId,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.jwtSecret,
    { expiresIn: "1d" }
  );
};

userSchema.methods.validatePassword = async function (userEnteredPassword) {
  const user = this;

  const ispasswordMatched = await bcrypt.compare(
    userEnteredPassword,
    user.password
  );
  return ispasswordMatched;
};

userSchema.post("save", function (error, doc, next) {
  handleDuplicateKeyError(error, next);
});

const users = mongoose.model("user", userSchema);

module.exports = users;

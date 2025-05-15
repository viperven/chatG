const { default: mongoose } = require("mongoose");
const validator = require("validator");

//signup validation

const validateSignUpData = (req) => {
  const { email, password, userOtp } = req.body;

  if (!email || !password) {
    const customError = new Error("Please provide both email and password!");
    customError.statusCode = 400;
    throw customError;
  }

  if (!validator.isEmail(email)) {
    const customError = new Error("Invalid email address !");
    customError.statusCode = 400;
    throw customError;
  }

  if (!userOtp) {
    const customError = new Error("OTP is madatory !");
    customError.statusCode = 400;
    throw customError;
  }
  // if (
  //   !validator.isStrongPassword(password, {
  //     minLength: 8,
  //     minLowercase: 1,
  //     minUppercase: 1,
  //     minNumbers: 1,
  //   })
  // ) {
  //   throw new Error(
  //     "Password is not strong required one capital,small letter ,number of minimum of 8 digit."
  //   );
  // }
};

const validateLoginData = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const customError = new Error("Please provide both email and password!");
    customError.statusCode = 400;
    throw customError;
  }

  if (!validator.isEmail(email)) {
    const customError = new Error("Invalid email address.");
    customError.statusCode = 400; // Bad Request
    throw customError;
  }
};

const validateOtpData = (req) => {
  const { emailId, newPassword, step } = req.body;

  if (!emailId || !newPassword) {
    throw new Error("Please provide both email and newPassword !");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address.");
  }

  // if (
  //   !validator.isStrongPassword(password, {
  //     minLength: 8,
  //     minLowercase: 1,
  //     minUppercase: 1,
  //     minNumbers: 1,
  //   })
  // ) {
  //   throw new Error(
  //     "Password is not strong required one capital,small letter ,number of minimum of 8 digit."
  //   );
  // }
};

//message validation

const validateSendMessage = (req) => {
  const { receiverId, content, mediaType } = req.body;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    const customError = new Error("invalid receiverID user ID");
    customError.statusCode = 400;
    throw customError;
  }

  if (!mediaType && !["text", "image", "video"].includes(mediaType)) {
    const customError = new Error("mediaType is required or invalid mediatype");
    customError.statusCode = 400;
    throw customError;
  }

  if (!content) {
    const customError = new Error("content is required");
    customError.statusCode = 400;
    throw customError;
  }
};

const validateGetAllMessages = (req) => {
  const { friendId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    const customError = new Error("invalid friendId user ID");
    customError.statusCode = 400;
    throw customError;
  }
};

const validateAceptOrDeclineFriendRequest = (req) => {
  const { senderId, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(senderId)) {
    const customError = new Error("invalid senderId user ID");
    customError.statusCode = 400;
    throw customError;
  }

  if (!["accepted", "rejected"].includes(status)) {
    const customError = new Error("invalid status");
    customError.statusCode = 400;
    throw customError;
  }
};

const validateDeleteMessage = (req) => {
  const { friendId, messageId } = req.body;
  console.log(friendId, messageId, "ssssssss");

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    const customError = new Error("invalid friendId user ID");
    customError.statusCode = 400;
    throw customError;
  }

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    const customError = new Error("invalid messageId user ID");
    customError.statusCode = 400;
    throw customError;
  }
};

const validateSearchFriends = (req) => {
  const { emailInput, suggestionCount } = req.query;

  if (!emailInput || typeof emailInput !== "string" || emailInput.trim().length < 3) {
    const customError = new Error("Invalid input! Must be a non-empty string with at least 3 characters.");
    customError.statusCode = 400;
    throw customError;
  }

  if (/[\s<>{}$;]/.test(emailInput)) {
    // Optional: Basic check to prevent injection-like patterns
    const customError = new Error("Invalid characters in input.");
    customError.statusCode = 400;
    throw customError;
  }

  if (Number(suggestionCount) < 1 || Number(suggestionCount) > 10) {
    const customError = new Error("Invalid suggestionCount! Must be a number between 1 and 10.");
    customError.statusCode = 400;
    throw customError;
  }
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateOtpData,
  validateSendMessage,
  validateGetAllMessages,
  validateAceptOrDeclineFriendRequest,
  validateDeleteMessage,
  validateSearchFriends,
};

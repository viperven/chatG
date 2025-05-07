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
  const { receiverId, content, media, mediaType } = req.body;

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
  const { senderId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(senderId)) {
    const customError = new Error("invalid senderId user ID");
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

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateOtpData,
  validateSendMessage,
  validateGetAllMessages,
  validateAceptOrDeclineFriendRequest,
};

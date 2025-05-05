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



module.exports = {
  validateSignUpData,
  validateLoginData,
  validateOtpData,
};

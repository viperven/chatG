//validation check send and receiver should be

const sendMessage = async (req, res) => {
  try {
    const { emailID } = req.body;

    if (!emailID) {
      res
        .status(400)
        .send({ isSuccess: false, message: "email id is required" });
    }
    const isEmailIdExists = await User.findOne({ emailId: emailID });

    if (isEmailIdExists) {
      return res.status(400).send({
        isSuccess: false,
        message: "email id already exists.",
      });
    }

    const otp = await generateOtpAndStore(emailID);
    await sendOTPMail(emailID, otp?.otp);
    res.status(200).send({
      isSuccess: true,
      message: "OTP sent succesfully.",
    });
  } catch (err) {
    console.log(err?.message);
    if (err.statusCode === 400) {
      return res.status(err.statusCode).json({
        isSuccess: false,
        message: err.message,
        field: err.field, // Optionally include the problematic field
      });
    }

    res.status(500).json({
      isSuccess: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  sendMessage,
};

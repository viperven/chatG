const UserModel = require("../models/userModel");
const { validateSearchFriends } = require("../validation/validate");

//functionality requirements
// user will type another user gmail.id use [debouncing in fe]
// get last active prefix matching 10 suggestions in dropdown
// user will click on it if already friend previous chat will be rendered
// if new user can send only one message

// api flow
// validate it should be minimum three words , take number of suggestions to show users
// find users
//    - find exact user match
//    - find by regex on prefix
//    - sort by last updatedAT
//    - limit max 10 users

const searchFriends = async (req, res) => {
  try {
    validateSearchFriends(req);

    const { emailInput, suggestionCount } = req.query;

    const exactUserMatch = await UserModel.findOne({ email: emailInput });

    if (exactUserMatch) {
      // if exactly matched then retur
      return res.status(200).json({
        isSuccess: true,
        message: "User Fetched successfully.",
        data: [exactUserMatch],
      });
    }

    const matchingRegexUsers = await UserModel.find({ email: { $regex: `^${emailInput}`, $options: "i" } })
      .sort({ updatedAt: -1 })
      .limit(suggestionCount);

    // match regex eith most active 10 users

    return res.status(200).json({
      isSuccess: true,
      message: "User Fetched successfully.",
      data: matchingRegexUsers,
    });
  } catch (err) {
    console.error(err?.message);

    if (err.statusCode === 400) {
      return res.status(err.statusCode).json({
        isSuccess: false,
        message: err.message,
        field: err.field,
      });
    }

    return res.status(500).json({
      isSuccess: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  searchFriends
}
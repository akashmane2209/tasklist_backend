const { generateToken } = require("../helpers/jwt");
// handles admin login
exports.loginUser = async (req, res) => {
  try {
    // if we reach here means user is valid from passport
    const user = req.user;
    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

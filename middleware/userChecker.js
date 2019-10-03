require("dotenv").config();
const ADMIN_ID = process.env.ADMIN_ID;

exports.checkUser = (req, res, next) => {
  if (req.user._id == ADMIN_ID) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

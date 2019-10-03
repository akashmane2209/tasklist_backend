const { validateUser, User } = require("../models/User");
const { generateToken } = require("../helpers/jwt");

exports.addUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { firstName, lastName, email, password } = req.body;
    const user = await new User({
      firstName,
      lastName,
      email,
      password
    }).save();
    const token = generateToken(user);
    res.status(201).json({
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("ERROR:", error.message);
  }
};

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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("ERROR:", error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User does not exists!" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("ERROR:", error.message);
  }
};

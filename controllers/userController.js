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
    const logged = await User.findById(user._id).populate({
      path: "teamId",
      model: "team"
    });
    console.log(logged);
    // console.log(user);
    const token = generateToken(user);
    res.status(200).json({
      token,
      user
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
    const user = await User.findById(req.params.id).populate("teamId");
    if (!user) {
      return res.status(404).json({ message: "User does not exists!" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("ERROR:", error.message);
  }
};

exports.getUserByTeamId = async (req, res) => {
  try {
    const users = await User.find({ teamId: req.params.teamId });
    if (users.length == 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("ERROR:", error.message);
  }
};

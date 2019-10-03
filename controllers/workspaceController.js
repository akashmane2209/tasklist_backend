const { validateWorkspace, Workspace } = require("../models/Workspace");
const { User } = require("../models/User");
const { Team } = require("../models/Team");
exports.getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find().populate({
      path: "projectList",
      select: "title"
    });
    if (!workspaces) {
      return res.status(404).json({ message: "No workspaces created" });
    }
    res.status(200).json({ workspaces });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.addWorkspace = async (req, res) => {
  try {
    console.log(req.body);
    const { error } = validateWorkspace(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findById(req.body.createdBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const workspace = await new Workspace({
      createdBy: req.body.createdBy,
      title: req.body.title
    }).save();
    res.status(201).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate({
      path: "projectList",
      select: "title"
    });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace does not exists" });
    }
    res.status(200).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

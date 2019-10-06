const { validateTeam, Team } = require("../models/Team");
const { User } = require("../models/User");
const { Project } = require("../models/Project");
exports.addTeam = async (req, res) => {
  try {
    const { error } = validateTeam(req.body);
    if (error) {
      return res.status(401).json({ message: error.details[0].message });
    }
    const { title, membersList } = req.body;
    const newTeam = await new Team({
      title,
      membersList
    }).save();
    membersList.forEach(async member => {
      await User.findByIdAndUpdate(member, {
        $push: {
          teamList: newTeam._id
        }
      });
    });
    const team = await Team.populate(newTeam, {
      path: "membersList",
      select: "firstName lastName"
    });
    res.status(201).json({ team });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate({
      path: "membersList",
      select: "firstName lastName"
    });
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate({
      path: "membersList",
      select: "firstName lastName"
    });
    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { update } = req.query;

    if (update == "user") {
      const { userId } = req.body;
      console.log(userId);
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User does not exists" });
      }
      if (user.teamId) {
        return res.status(200).json({ message: "User already part of a team" });
      }
      const team = await Team.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            membersList: userId
          }
        },
        {
          new: true
        }
      );
      console.log(team);
      user = await User.findByIdAndUpdate(userId, {
        teamId: team._id
      });
      res.status(200).json({ team });
    } else if (update == "project") {
      const { projectId } = req.body;
      let project = await Project.find(userId);
      if (!project) {
        return res.status(404).json({ message: "Project does not exists" });
      }
      const team = await Team.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            projectList: projectId
          }
        },
        { new: true }
      );

      project = await User.findByIdAndUpdate(projectId, {
        teamId: team._id
      });
      res.status(200).json({ team });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

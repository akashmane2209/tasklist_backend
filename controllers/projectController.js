const { validateProject, Project } = require("../models/Project");
const { Workspace } = require("../models/Workspace");
const { Team } = require("../models/Team");
const { User } = require("../models/User");

exports.addProject = async (req, res) => {
  try {
    const dueDate = new Date(req.body.dueDate);
    const startDate = new Date(req.body.startDate);
    const reqBody = { ...req.body, dueDate: dueDate, startDate: startDate };
    const { error } = validateProject(reqBody);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, teamId, workspaceId, userId } = req.body;
    let team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team does not exists" });
    }
    let workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace does not exists" });
    }
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exists" });
    }
    let project = await new Project({
      title,
      teamId,
      startDate,
      dueDate,
      workspaceId,
      userId
    }).save();
    project = await Project.populate(project, {
      path: "teamId",
      select: "title"
    });
    project = await Project.populate(project, {
      path: "workspaceId",
      select: "title"
    });
    workspace = await Workspace.findByIdAndUpdate(workspaceId, {
      $push: {
        projectList: project._id
      }
    });
    team = await Team.findByIdAndUpdate(teamId, {
      $push: {
        projectList: project._id
      }
    });
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate({ path: "teamId", select: "title" })
      .populate({ path: "workspaceId", select: "title" });
    if (!projects) {
      return res.status(404).json({ message: "No projects created" });
    }
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getProjectsByWorkspaceId = idType => async (req, res) => {
  try {
    if (idType == "workspace") {
      const project = await Project.find({
        workspaceId: req.params.id
      })
        .populate({ path: "teamId", select: "title" })
        .populate({ path: "workspaceId", select: "title" });
      if (project.length == 0) {
        return res.status(404).json({ message: "Project does not exists" });
      }
      res.status(200).json({ project });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.updateProjectById = async (req, res) => {
  try {
    const { update } = req.query;
    if (update == "team") {
      const { teamId } = req.body;
      let team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team does not exists" });
      }
      const project = await Project.findByIdAndUpdate(req.params.id, {
        teamId: teamId
      });
      if (!project) {
        return res.status(404).json({ message: "Project does not exists" });
      }
      team = await Team.findByIdAndUpdate(teamId, {
        projectId: project._id
      });
      res.status(200).json({ message: "Team changed successfully", project });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getProjectsByTeamId = async (req, res) => {
  console.log(req.params.teamId);
  const projects = await Project.find({ teamId: req.params.teamId }).populate({
    path: "teamId"
  });

  if (projects.length === 0) {
    return res.status(404).json({ message: "Projects not found" });
  }
  res.status(200).json({ projects });
};

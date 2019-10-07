const { validateTask, Task } = require("../models/Task");
const { User } = require("../models/User");
const { Project } = require("../models/Project");
exports.addTask = async (req, res) => {
  try {
    const dueDate = new Date(req.body.dueDate);
    const startDate = new Date(req.body.startDate);
    const reqBody = { ...req.body, dueDate: dueDate, startDate: startDate };
    const { error } = validateTask(reqBody);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, assignedTo, priority, projectId } = req.body;
    let user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: "User does not exists" });
    }

    let project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project does not exists" });
    }

    const seconds = Date.now();
    const currentDate = new Date(seconds);
    console.log(currentDate);
    console.log(startDate);
    if (startDate < currentDate) {
      return res
        .status(200)
        .json({ message: "Start Date should be greater than current date" });
    }
    if (dueDate < currentDate) {
      return res
        .status(200)
        .json({ message: "Due Date should be greater than current date" });
    }
    if (dueDate <= startDate) {
      return res
        .status(200)
        .json({ message: "Due Date should be greater than start date" });
    }
    let flag = "";
    if (currentDate > startDate && currentDate < dueDate) {
      flag = 2;
    } else if (currentDate > dueDate) {
      flag = 3;
    } else if (currentDate < startDate) {
      flag = 1;
    }

    let task = await new Task({
      title,
      assignedTo,
      startDate,
      dueDate,
      priority,
      projectId,
      flag
    }).save();
    user = await User.findByIdAndUpdate(assignedTo, {
      $push: {
        taskList: task._id
      }
    });
    project = await Project.findByIdAndUpdate(projectId, {
      $push: {
        taskList: task._id
      }
    });
    task = await Task.findById(task._id).populate("assignedTo");
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo")
      .populate("messageList");
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getTasksByUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const tasks = await Task.find({ assignedTo: req.params.userId })
      .populate("projectId")
      .populate("assignedTo");
    if (tasks.length == 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.updateTaskFlag = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, {
      flag: 0,
      priority: "Completed"
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Update Successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

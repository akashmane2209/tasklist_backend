const { validateMessage, Message } = require("../models/Message");

const { User } = require("../models/User");
const { Task } = require("../models/Task");

exports.addMessage = async (req, res) => {
  try {
    const { error } = validateMessage(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { content, userId, taskId } = req.body;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exists" });
    }
    let task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task does not exists" });
    }
    let message = await new Message({
      content,
      userId,
      taskId
    }).save();
    task = await Task.findByIdAndUpdate(taskId, {
      $push: {
        messageList: message._id
      }
    });
    message = await Message.findById(message._id).populate("userId");
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("userId");
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

exports.getMessagesByTaskId = async (req, res) => {
  try {
    const messages = await Message.find({ taskId: req.params.taskId });
    if (messages.length == 0) {
      return res.status(404).json({ message: "No messages found" });
    }
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("ERROR:", error.message);
  }
};

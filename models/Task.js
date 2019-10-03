const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const validateTask = task => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    assignedTo: Joi.string().required(),
    startDate: Joi.date().required(),
    dueDate: Joi.date().required(),
    priority: Joi.string().required(),
    projectId: Joi.string().required()
  });
  return schema.validate(task);
};

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  projectId: { type: mongoose.Schema.ObjectId, ref: "project" },
  priority: { type: String, required: true },
  flag: { type: String },
  messageList: [{ type: mongoose.Schema.ObjectId, ref: "message" }]
});

const Task = mongoose.model("task", taskSchema);

module.exports = { validateTask, Task };

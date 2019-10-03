const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const validateProject = project => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    teamId: Joi.string().required(),
    startDate: Joi.date().required(),
    dueDate: Joi.date().required(),
    workspaceId: Joi.string().required()
  });
  return schema.validate(project);
};

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    teamId: { type: mongoose.Schema.ObjectId, ref: "team" },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    workspaceId: { type: mongoose.Schema.ObjectId, ref: "workspace" },
    flag: { type: String },
    taskList: [{ type: mongoose.Schema.ObjectId, ref: "task" }]
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model("project", projectSchema);

module.exports = { validateProject, Project };

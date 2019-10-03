const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const validateWorkspace = workspace => {
  const schema = Joi.object().keys({
    createdBy: Joi.string().required(),
    title: Joi.string().required()
  });
  return schema.validate(workspace);
};

const workspaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectList: [{ type: mongoose.Schema.ObjectId, ref: "project" }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "user" }
});

const Workspace = mongoose.model("workspace", workspaceSchema);

module.exports = { validateWorkspace, Workspace };

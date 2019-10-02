const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const validateWorkspace = workspace => {
  const schema = Joi.object().keys({
    title: Joi.string().required()
  });
  return Joi.validate(workspace, schema);
};

const workspaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectList: [{ type: mongoose.Schema.ObjectId, ref: "project" }],
  createdAt: { type: Date, default: Date.now }
});

const Workspace = mongoose.model("workspace", workspaceSchema);

module.exports = { validateWorkspace, Workspace };

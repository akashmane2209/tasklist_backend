const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const validateTeam = team => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    membersList: Joi.array().required(),
    projectId: Joi.string()
  });
  return Joi.validate(team, schema);
};

const teamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectList: [{ type: mongoose.Schema.ObjectId, ref: "project" }],
  membersList: [{ type: mongoose.Schema.ObjectId, ref: "user" }]
});

const Team = mongoose.model("team", teamSchema);

module.exports = { validateTeam, Team };

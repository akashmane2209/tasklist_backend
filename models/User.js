const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const bcyrpt = require("bcrypt");

const validateUser = user => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  });
  return schema.validate(user);
};

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  teamId: { type: mongoose.Schema.ObjectId, ref: "team" },
  taskList: [{ type: mongoose.Schema.ObjectId, ref: "task" }],
  projectList: [{ type: mongoose.Schema.ObjectId, ref: "project" }]
});

userSchema.pre("save", async function(next) {
  try {
    const salt = await bcyrpt.genSalt(10);
    const hashedPassword = await bcyrpt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Change Password
userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcyrpt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("user", userSchema);

module.exports = { validateUser, User };

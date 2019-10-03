const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const validateMessage = message => {
  const schema = Joi.object().keys({
    content: Joi.string().required(),
    userId: Joi.string().required(),
    taskId: Joi.string().required()
  });
  return schema.validate(message);
};

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  createdAt: { type: Date, default: Date.now() },
  taskId: { type: mongoose.Schema.ObjectId, ref: "task" }
});

const Message = mongoose.model("message", messageSchema);

module.exports = { validateMessage, Message };

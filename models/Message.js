const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const validateMessage = message => {
  const schema = Joi.object().keys({
    content: Joi.string().required(),
    userId: Joi.string().required()
  });
  return Joi.validate(message, schema);
};

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("message", messageSchema);

module.exports = { validateMessage, Message };

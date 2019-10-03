const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport/passportConfig");
const userChecker = require("../middleware/userChecker");

const router = express.Router();

const messageController = require("../controllers/messageController");

router
  .route("/")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    messageController.getAllMessages
  )
  .post(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    messageController.addMessage
  );

module.exports = router;

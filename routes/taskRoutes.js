const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport/passportConfig");
const userChecker = require("../middleware/userChecker");
const router = express.Router();

const taskController = require("../controllers/taskController");

router
  .route("/")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userChecker.checkUser,
    taskController.getAllTasks
  )
  .post(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userChecker.checkUser,
    taskController.addTask
  );

router
  .route("/user/:userId")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    taskController.getTasksByUserId
  );

module.exports = router;
